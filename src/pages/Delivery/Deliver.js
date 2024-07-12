import React, { useState, useEffect } from "react";
import { Footer, Header } from "../../components";
import { ethers } from "ethers";
import Lottie from "react-lottie-player";
import loaderGif from "../../assets/loader.json";
import { Link, useParams } from "react-router-dom";
import supabase from "../../config/supabase";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../contract/constant";
var converter = require("hex2dec");

const Deliver = () => {
  const [loader, setLoader] = useState(false);
  const [productData, setProductData] = useState("");
  const [OTP, setOTP] = useState("");
  const [success, setSuccess] = useState(false);
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
        console.log(data);
        setProductData(data[0]);
      }
    };
    fetchProducts();
  }, []);

  const updateOrder = async () => {
    let { data, error } = await supabase
      .from("Orders")
      .update([{}]) // Name of Table
      .eq("account")
      .select();
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
    }
  };

  const orderCompleted = async () => {
    if (OTP) {
      setLoader(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      // console.log(productData.Orders[productData.Orders.length - 1].id);
      const tx = await contract.deliveryComplete(
        productData.Orders[productData.Orders.length - 1].id,
        OTP
      );
      const receipt = await tx.wait();
      console.log(receipt);
      setSuccess(true);
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
              <h2 className=" text-[1.5rem] mb-2">OTP Verified</h2>
              <p className="font-medium w-[70%] ">
                Order Delivered Successfully
              </p>
            </div>
            <img
              src={require("../../assets/success.png")}
              className="h-32 mb-2"
            ></img>
            <div>
              <Link to={`/orders`}>
                <button
                  // onClick={() => userPetitionSign()}
                  className="bg-primaryColor text-[#ffffff] text-white py-2 px-6 w-52 rounded-[5px] text-[1.1rem] hover:bg-[#007AAF]"
                >
                  Track other Orders
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
      <div className="headingContent mx-[5%] mt-5">
        <p className="text-[#666666] font-semibold text-[1.5rem]">
          Order to be deliver
        </p>
        <div className="w-full h-[2px] bg-primaryColor mt-2"></div>
      </div>
      <div className="flex mx-[5%] gap-5 my-10">
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
            {/* <p>Deliver at :{pAddress ? pAddress : "Address"}</p> */}
          </div>
        </div>
        <div className="max-w-[300px] rounded-xl border-[#B9B9B9] border-[1px] py-5 px-6">
          <h2 className="text-[1.2rem] font-medium mb-3">Enter OTP</h2>
          <div className="flex flex-col gap-2 my-4 mb-6">
            <input
              type="number"
              className="bg-[#F3F9FB] w-[100%] h-12 p-5 rounded-md"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
            ></input>
          </div>
          <button
            onClick={() => orderCompleted()}
            className="text-[1.3rem] font-medium cursor-pointer text-[#ffffff] w-[100%] text-center bg-primaryColor py-3 px-4 rounded-lg  hover:bg-[#007AAF]"
          >
            Verify OTP
          </button>
          <p className="mt-4 text-[0.9rem]">
            Please don't share this otp with anyone
          </p>
        </div>
      </div>
      // <Footer />
    </div>
  );
};

export default Deliver;
