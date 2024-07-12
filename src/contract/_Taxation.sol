// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract Taxation is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    int256 public tax;
    address current;
    bytes32 private jobId;
    uint256 private fee;
    mapping(address=>uint) spent;
    mapping(address=>uint) taxes;
    mapping(address=>bool) paid;
    mapping(address=>uint256) taxAmounts;

    event RequestTaxation(bytes32 indexed requestId,address payee, int256 tax);
    event TaxFetched(uint256 tax);

    /**
     * @notice Initialize the link token and target oracle
     *
     * Sepolia Testnet details:
     * Link Token: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     * Oracle: 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD (Chainlink DevRel)
     * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xCC79157eb46F5624204f47AB42b3906cAA40eaB7);
        jobId = "fcf4140d696d44b687012232948bdd5d";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestTaxationData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        current = msg.sender;
        // Set the URL to perform the GET request on
        req.add(
            "get",
            "https://xlkldthwqotssakgxfqm.supabase.co/rest/v1/Users?select=crating"
        );
        req.add("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa2xkdGh3cW90c3Nha2d4ZnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYzMDQ0ODIsImV4cCI6MjAwMTg4MDQ4Mn0.svoBsIgCOcLu1KA6BsRY09_6GUcr85GDdSYLzy5dGhw");
        req.add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa2xkdGh3cW90c3Nha2d4ZnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYzMDQ0ODIsImV4cCI6MjAwMTg4MDQ4Mn0.svoBsIgCOcLu1KA6BsRY09_6GUcr85GDdSYLzy5dGhw");

        // Multiply the result by 1 to remove decimals
        int256 timesAmount = 1;
        req.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);
    }

    modifier onlyAdmin() {
        _;
    }

    /**
     * Receive the response in the form of int256
     */
    function fulfill(
        bytes32 _requestId,
        int256 _tax
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestTaxation(_requestId, msg.sender, _tax);
        tax = _tax;
        taxes[current] = uint(tax+10);

    }

    function setTax(int256 _tax, uint _spent, address _payee) onlyAdmin() external {

        taxes[_payee] = uint(_tax+10);
        spent[_payee] = _spent;
        taxAmounts[_payee] = (spent[msg.sender]*taxes[msg.sender])/100;
    }

    function knowMyTax() external view returns (uint) {
        return taxAmounts[msg.sender];
    } 

    function payTax() external payable {

        require(msg.value == taxAmounts[msg.sender], "Please pay full amount");
        paid[msg.sender] = true;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
