import React, { useState, useEffect } from "react";
import { Footer, Header } from "../components";
import Lottie from "react-lottie-player";
import loaderGif from "../assets/loader.json";
import { Link, useParams } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract/constant";
import { ethers } from "ethers";
import supabase from "../config/supabase";
var converter = require("hex2dec");

const Success = () => {
  const [OTP, setOTP] = useState("");
  const [timer, setTimer] = useState(80);
  const [success, setSuccess] = useState(false);
  const [pAddress, setpAddress] = useState("");
  const [productData, setProductData] = useState("");
  const [loader, setLoader] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("Products") // Name of Table
        .select(`*,Orders(*)`)
        .eq("pid", params.id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setProductData(data[0]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const setAddress = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      const { data, error } = await supabase
        .from("Users") // Name of Table
        .select()
        .eq("account", account);

      if (error) {
        console.log(error);
      }
      if (data) {
        // console.log(data);
        setpAddress(data[0].address);
        // setProductData(data[0]);
      }
    };
    setAddress();
  }, []);
  // console.log(productData);

  const getOTP = async () => {
    setLoader(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    console.log(productData.Orders[productData.Orders.length - 1].id);
    const tx1 = await contract.generateOTP(
      productData.Orders[productData.Orders.length - 1].id
    );
    const receipt1 = await tx1.wait();
    // console.log(receipt1);
    let reqID = await converter.hexToDec(receipt1);
    console.log("redID: " + reqID);

    setTimeout(async () => {
      console.log("2nd Contract run");

      const tx2 = await contract.getMyOTP(
        reqID,
        productData.Orders[productData.Orders.length - 1].id
      );
      const receipt2 = await tx2.wait();
      let OTP = await converter.hexToDec(receipt2);
      await setOTP(OTP);
      console.log("OTP: " + OTP);
      setSuccess(true);
    }, 60000);

    // ***********************************************
    const intervalId = setInterval(() => {
      setTimer((prevSeconds) => prevSeconds - 1);
    }, 1000);

    setTimeout(async () => {
      clearInterval(intervalId);
      // setSuccess(false);
      // setLoader(false);
    }, 90000);
    // ***********************************************
  };

  // const tempOTP = async () => {
  //   setSuccess(true);
  //   const intervalId = setInterval(() => {
  //     setTimer((prevSeconds) => prevSeconds - 1);
  //   }, 1000);
  //   setTimeout(async () => {
  //     clearInterval(intervalId);
  //     // setSuccess(false);
  //   }, 60000);
  // setLoader(true);
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  // const contract = new ethers.Contract(
  //   CONTRACT_ADDRESS,
  //   CONTRACT_ABI,
  //   signer
  // );
  // console.log(productData.Orders[productData.Orders.length - 1].id);
  // const tx1 = await contract.getMyOTP(
  //   "78580725066007488384178671274494881037686379852825577345749817239985848510726",
  //   productData.Orders[productData.Orders.length - 1].id
  // );
  // const receipt1 = await tx1.wait();
  // let OTP = await converter.hexToDec(receipt1.events[0].topics[1]);
  // console.log(OTP);
  // setLoader(false);
  // };

  return (
    <div>
      {loader && (
        <div
          className="fixed w-screen h-[100%] bg-slate-500 flex justify-center items-center -z-1"
          style={{ background: "rgba(0, 0, 0, 0.27)" }}
        >
          <div className="z-1000 w-[400px] text-center  bg-[#ffffff] rounded-xl py-10 px-5 flex flex-col justify-center items-center gap-5">
            <div className="flex w-[80%] flex-col justify-center items-center">
              <h2 className=" text-[1.5rem] mb-2">
                {success ? "OTP Generated" : "Please Wait"}
              </h2>
              <p className="font-medium w-[100%] ">
                {success ? "Thank You for Ordering" : "It is processing in..."}
              </p>
            </div>
            {success ? (
              <div>
                <p className="text-[1.5rem] font-medium mb-3">OTP Here!</p>
                <input
                  type="text"
                  className="bg-[#F3F9FB] text-center text-[2rem] w-[200px] h-12 p-5 rounded-md"
                  value={OTP}
                  readOnly
                ></input>
              </div>
            ) : (
              <div>
                <div className="w-[80px] h-[80px]">
                  <Lottie
                    loop
                    animationData={loaderGif}
                    play
                    style={{
                      width: 150,
                      height: 150,
                      transform: "translate(-40px,-40px)",
                    }}
                  />
                </div>
                <div>{timer} sec</div>
              </div>
            )}

            {success && (
              <Link to={`/`}>
                <button
                  onClick={() => setLoader(false)}
                  className="bg-primaryColor text-[#ffffff] text-white py-2 px-6 w-52 rounded-[5px] text-[1.1rem] hover:bg-[#007AAF]"
                >
                  Go to home
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      <Header />
      <div className="w-[100vw]">
        <ul className="flex justify-center gap-3 font-medium text-[0.9rem] my-3">
          <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
            Premium Fruits
          </li>
          <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
            Home & Kitchen
          </li>
          <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
            Electronics
          </li>
          <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
            Fashion
          </li>
          <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
            Beauty
          </li>
          <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer hover:bg-[#E4F8FF]">
            Sports
          </li>
          <li className="py-1 px-3 rounded-2xl bg-[#F3F9FB] cursor-pointer">
            Toys & Luggage
          </li>
        </ul>
        <div className="headingContent mx-[5%]">
          <p className="text-[#666666] font-semibold text-[1.5rem]">
            Order Received
          </p>
          <div className="w-full h-[2px] bg-primaryColor mt-2"></div>
        </div>
      </div>
      <div className="flex flex-col mt-10 mx-[5%] gap-5 text-[#008ECC] rounded-xl border-[#B9B9B9] border-[1px] py-5 px-10">
        At the time of delivery, an OTP is generated for one-time use. The OTP
        is communicated to you or your representative by the delivery person
        through a secure channel, such as a dedicated delivery tracking
        application or messaging service. You or your representative enter the
        OTP into the delivery person's device or application to verify the
        authenticity of the delivery.
      </div>
      <div className="flex mx-[5%] gap-5 my-5">
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
            <p className="text-[#249B3E] font-semibold text-[1.5rem]">
              CO2 Footprint : {productData ? productData.cfootprint : "cfp"}g
            </p>
            <div>
              <h3 className="font-medium text-[1.1rem] mb-1">
                About this item
              </h3>
              <p>{productData ? productData.description : "name"}</p>
            </div>
            <p>Deliver at :{pAddress ? pAddress : "Address"}</p>
          </div>
        </div>
        <div className="max-w-[300px] rounded-xl border-[#B9B9B9] border-[1px] py-5 px-6">
          <h2 className="text-[1.2rem] font-medium mb-3">Your OTP</h2>
          {OTP ? (
            <div className="flex flex-col gap-5 mt-7 h-20 border-[1px] border-[#747474] rounded justify-center items-center text-[3rem] font-medium">
              {OTP}
            </div>
          ) : (
            <div className="text-[2rem]">
              <div
                onClick={() => getOTP()}
                className="flex flex-col gap-5 mt-7 h-20 border-[1px] bg-primaryColor cursor-pointer text-[#ffffff] border-primaryColor rounded-lg hover:bg-[#007AAF] justify-center items-center font-medium"
              >
                Generate OTP
              </div>
              {/* <div
                onClick={() => tempOTP()}
                className="flex flex-col gap-5 mt-7 h-20 border-[1px] bg-primaryColor cursor-pointer text-[#ffffff] border-primaryColor rounded-lg hover:bg-[#007AAF] justify-center items-center font-medium"
              >
                Get OTP
              </div> */}
            </div>
          )}
          <p className="mt-4 text-[0.9rem]">
            Please wait for OTP generation and then request OTP
          </p>
        </div>
      </div>
      <div className="flex flex-col mx-[5%] gap-5 rounded-xl border-[#B9B9B9] border-[1px] py-5 px-10">
        <h2 className="font-semibold text-[1.5rem]">Delivery in progress</h2>
        <div className="flex justify-start gap-14 text-[1.1rem]">
          <div className="flex flex-col justify-center items-center gap-1">
            <p>Order Dispatched</p>
            <input type="radio" checked={true} readOnly></input>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <p>Order out for delivery</p>
            <input type="radio" checked={true} readOnly></input>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <p>OTP gave to Delivery Boy</p>
            <input type="radio" readOnly></input>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <p>Order Received</p>
            <input type="radio" readOnly></input>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Success;
