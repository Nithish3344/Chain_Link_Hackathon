import React, { useState, useEffect } from "react";
import { Footer, Header } from "../components";
import Lottie from "react-lottie-player";
import loaderGif from "../assets/loader.json";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract/constant";
import { ethers } from "ethers";
import { Link, useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabase";
import { useMoralis } from "react-moralis";

const Payment = () => {
  const { isWeb3Enabled } = useMoralis();
  const [loader, setLoader] = useState(false);

  const [productData, setProductData] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [success, setSuccess] = useState(false);
  const [balanceError, setBalanceError] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAddr = async () => {
      if (isWeb3Enabled) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const { data, error } = await supabase
          .from("Users") // Name of Table
          .select()
          .eq("account", address);

        if (error) {
          console.log(error);
        }
        if (data) {
          setUserAddress(data[0].address);
        }
      }
    };
    fetchUserAddr();
  }, [productData]);

  useEffect(() => {
    const fetchProductData = async () => {
      const { data, error } = await supabase
        .from("Products") // Name of Table
        .select()
        .eq("pid", params.id);

      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
        setProductData(data[0]);
      }
    };
    fetchProductData();
  }, []);
  // 1836;

  const saveOrder = async (orderID, pId, account) => {
    const { data, error } = await supabase
      .from("Orders")
      .insert([{ id: orderID, pid: pId, user: account, quantity: 1 }]) // Name of Table
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      return 0;
    }
  };
  console.log(productData);
  const payNow = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const balance = ethers.utils.formatEther(await signer.getBalance());

      if (balance > productData.price / 1000000) {
        setLoader(true);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        const tx = await contract.placeOrder(productData.pid, 1, {
          value: ethers.utils.parseEther(`${productData.price / 1000000}`),
        });
        const receipt = await tx.wait();
        let orderId = Number(receipt.logs[0].topics[1]);
        console.log(orderId);

        await saveOrder(orderId, params.id, account);
        setLoader(false);
        setSuccess(true);
      } else {
        setBalanceError(true);
        setTimeout(() => {
          setBalanceError(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  return (
    <div>
      {success && (
        <div
          className="fixed w-screen h-[100%] bg-slate-500 flex justify-center items-center -z-1"
          style={{ background: "rgba(0, 0, 0, 0.27)" }}
        >
          <div className="z-1000 w-[400px] text-center  bg-[#ffffff] rounded-xl py-10 px-10 flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col justify-center items-center">
              <h2 className=" text-[1.5rem] mb-2">Payment Successful</h2>
              <p className="font-medium w-[70%] ">
                Your order successfully Placed
              </p>
            </div>
            <img
              src={require("../assets/success.png")}
              className="h-32 mb-2"
            ></img>
            <div>
              <Link to={`/success/${params.id}`}>
                <button
                  // onClick={() => userPetitionSign()}
                  className="bg-primaryColor text-[#ffffff] text-white py-2 px-6 w-52 rounded-[5px] text-[1.1rem] hover:bg-[#007AAF]"
                >
                  Track your Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {loader && (
        <div
          className="fixed w-screen h-screen bg-slate-500 flex justify-center items-center"
          style={{ background: "rgba(255, 255, 255, 0.65)" }}
        >
          <Lottie
            loop
            animationData={loaderGif}
            play
            style={{
              width: 200,
              height: 200,
            }}
          />
        </div>
      )}
      <Header />
      <div className="w-[100vw]">
        <ul className="flex justify-center gap-3 font-medium text-[0.9rem] my-3">
          <Link to="/result/Fashion">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Fashion
            </li>
          </Link>
          <Link to="/result/Grocery">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Grocery
            </li>
          </Link>
          <Link to="/result/Electronics">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Electronics
            </li>
          </Link>
          <Link to="/result/Fashion">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Fashion
            </li>
          </Link>
          <Link to="/result/Beauty">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Beauty
            </li>
          </Link>
          <Link to="/result/Sports">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Sports
            </li>
          </Link>
          <Link to="/result/Home & Kitchen">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Home & Kitchen
            </li>
          </Link>
          <Link to="/result/Toys & Luggage">
            <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
              Toys & Luggage
            </li>
          </Link>
        </ul>
        <div className=" h-[2px] bg-primaryColor mt-8 mx-[5%]"></div>
      </div>
      <div className="flex mx-[5%] gap-5 my-10">
        <div className="w-[100%] flex flex-col gap-5">
          <div className="w-[100%] rounded-xl border-[#B9B9B9] border-[1px] py-5 px-10">
            <h2 className="text-[1.2rem] font-medium mb-5">Deliver At:</h2>
            <textarea
              className="bg-[#F3F9FB] w-full h-32 p-5 rounded-md"
              placeholder="Address here..."
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="w-[100%] flex gap-6 rounded-xl border-[#B9B9B9] border-[1px] py-5 px-10">
            <div className="min-w-[250px] h-[250px] flex justify-center items-center bg-[#F5F5F5] rounded-2xl">
              <img
                src={`${
                  productData
                    ? productData.purl
                    : "https://cdn.questionpro.com/userimages/site_media/no-image.png"
                }`}
                className="h-[100%]"
              ></img>
            </div>
            <div className="w-[100%] flex flex-col gap-2">
              <h1 className="text-[1.2rem]">
                {productData ? productData.name : "name"}
              </h1>
              <h2 className="text-[1.7rem] font-semibold">
                ${productData ? productData.price : "price"}
              </h2>
              <p className="text-[0.8rem] font-light">
                {productData ? productData.description : "description"}
              </p>
              <p className="text-[#249B3E] font-medium">
                CO2 Footprint : {productData ? productData.cfootprint : "10"}g
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-[300px]">
          <div className="w-full rounded-xl border-[#B9B9B9] border-[1px] py-5 px-6 h-[320px]">
            <h2 className="text-[1.2rem] font-medium mb-3">Price Details</h2>
            <div className="flex flex-col gap-5 mt-7">
              <div className="flex justify-between">
                <p>Price</p>
                <p className="font-medium">
                  ${productData ? productData.price : "price"}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p className="font-medium">$10</p>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <p className="font-medium">
                  $
                  {productData
                    ? (productData.price * 0.01).toFixed(2)
                    : "price"}
                </p>
              </div>
              <div className="h-[2px] w-full bg-[#000000]"></div>
              <div className="flex justify-between">
                <p>Discount</p>
                <p className="font-medium">-$10</p>
              </div>
              <div className="flex justify-between">
                <p>Total</p>
                <p className="font-medium">
                  $
                  {productData
                    ? (productData.price + productData.price * 0.01).toFixed(2)
                    : "price"}
                </p>
              </div>
            </div>
          </div>
          <p className="text-[#E51F1F] mt-3 mb-1 text-center">
            {balanceError
              ? "Insufficient Balance!"
              : "Please provide valid address."}
          </p>
          <p className="text-[#E51F1F] mt-1 mb-1 text-center">
            {!isWeb3Enabled && "To pay Please connect Metamask"}
          </p>
          <div className="flex flex-col gap-3">
            <a href="https://verse.bitcoin.com/" target="_blank">
              <button
                // onClick={() => }
                className=" flex justify-center items-center py-2 px-4 gap-5 text-[1.3rem] w-[100%] font-medium cursor-pointer text-[#000000] text-center bg-[#ffffff] rounded-lg border-2 border-[#000000] hover:text-[#0085FF] hover:border-[#0085FF]"
              >
                Swap to ETH
                <img src={require("../assets/verse.png")} width={40}></img>
              </button>
            </a>
            <button
              onClick={() => payNow()}
              className="text-[1.3rem] font-medium cursor-pointer text-[#ffffff] text-center bg-primaryColor py-3 px-4 rounded-lg  hover:bg-[#007AAF]"
            >
              PAY NOW
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
