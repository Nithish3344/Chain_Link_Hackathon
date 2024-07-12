// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

struct Order {
    uint pid;
    uint quantity;
    address customer;
    bool reached;
    // address deleveryAgent;
    bool delivered;
    bytes32 otpHash;
}

contract Delivery is VRFConsumerBaseV2, ConfirmedOwner {
    event orderPlaced(uint indexed orderId);
    event otpRequested(uint indexed reqId);
    event otpGenerated(uint indexed otp);
    event productAdded(uint pid, address sid, uint prize);

    // mapping(uint256 => string) public pidToPname; //product Id to product name
    mapping(uint256 => address) public pidToSid; //product Id to seller's id
    // mapping(uint256 => uint256) public pidToCarbon; //product Id to carbon footprint of the product
    mapping(uint256 => uint256) public pidToPrice; //product Id to price of the product
    mapping(uint => Order) public orderDetails;
    uint counter = 1;

    uint[] public orderQueue;

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 2;

    constructor(
        uint64 subscriptionId,
        address seller1
    )
        VRFConsumerBaseV2(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D
        );
        s_subscriptionId = subscriptionId;

        pidToSid[1] = seller1;
        pidToSid[2] = seller1;
        pidToSid[3] = seller1;
        pidToSid[4] = seller1;
        pidToSid[5] = seller1;
        pidToSid[6] = seller1;

        pidToPrice[1] = 599000000000000;
        pidToPrice[2] = 1000000000000;
        pidToPrice[3] = 1000000000000;
        pidToPrice[4] = 15000000000000;
        pidToPrice[5] = 2599000000000000;
        pidToPrice[6] = 149000000000000;
    }

    modifier onlyAdmin() {
        _;
    }

    function addProduct(
        uint _pid,
        address _sid,
        uint _price
    ) external onlyAdmin {
        pidToPrice[_pid] = _price;
        pidToSid[_pid] = _sid;
        emit productAdded(_pid, _sid, _price);
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() internal returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(
        uint256 _requestId
    ) internal view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function placeOrder(
        uint256 _pid,
        uint256 _quantity
    ) public payable returns (uint) {
        // uint256 tax = pidToCarbon[_pid]; /*(Some Calculations)*/
        uint256 totalPrice = (pidToPrice[_pid]) * _quantity;

        require(
            msg.value == totalPrice,
            "Please pay the total price for the product!"
        );

        uint orderId = counter;
        counter = counter + 1;

        orderQueue.push(orderId);
        Order memory order;
        order.customer = msg.sender;
        order.pid = _pid;
        order.quantity = _quantity;
        order.reached = false;
        order.delivered = false;
        orderDetails[orderId] = order;

        emit orderPlaced(orderId);

        return orderId;
    }

    // function assignDeliverAgent(uint _orderId, address _deleveryAgent) external{
    //     require(msg.sender == pidToSid[orderDetails[_orderId].pid], "Not Authorized Seller for the order!");
    //     orderDetails[_orderId].deleveryAgent = _deleveryAgent;
    // }

    function deleveryReached(uint _orderId) external {
        require(
            msg.sender == pidToSid[orderDetails[_orderId].pid],
            "Not Authorized Delevery Agrnt for the order"
        );
        orderDetails[_orderId].reached = true;
    }

    function generateOTP(uint _orderId) external returns (uint) {
        require(
            orderDetails[_orderId].reached == true,
            "Please wait! Your orer is on its way."
        );
        require(
            msg.sender == orderDetails[_orderId].customer,
            "This it not your order, Please put you order ID"
        );
        uint reqId = requestRandomWords();
        emit otpRequested(reqId);
        return reqId;
    }

    function getMyOTP(
        uint _reqId,
        uint _orderId
    ) external returns (bool, uint) {
        require(
            orderDetails[_orderId].reached == true,
            "Please wait! Your order is on its way."
        );
        require(
            msg.sender == orderDetails[_orderId].customer,
            "This it not your order, Please put you order ID"
        );
        bool fulfilled;
        uint256[] memory randomWords;
        (fulfilled, randomWords) = getRequestStatus(_reqId);
        uint otp = randomWords[0] % 1000000;
        bytes32 hash = keccak256(abi.encodePacked(otp));
        orderDetails[_orderId].otpHash = hash;
        emit otpGenerated(otp);
        return (fulfilled, otp);
    }

    function deliveryComplete(uint _orderId, uint _otp) external {
        require(
            msg.sender == pidToSid[orderDetails[_orderId].pid],
            "Not Authorized Delevery Agrnt for the order"
        );
        bytes32 otpHash = keccak256(abi.encodePacked(_otp));
        require(
            otpHash == orderDetails[_orderId].otpHash,
            "Invalid OTP! Please try again"
        );
        orderDetails[_orderId].delivered = true;
    }
}
