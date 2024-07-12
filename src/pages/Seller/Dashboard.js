import React, { useState, useEffect } from "react";
import { Footer, Header } from "../../components";
import { ethers } from "ethers";
import Lottie from "react-lottie-player";
import loaderGif from "../../assets/loader.json";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../contract/constant";
import supabase from "../../config/supabase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [loader, setLoader] = useState(false);
  // const [orderID, setOrderID] = useState("");
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [sellerData, setSellerData] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("Orders") // Name of Table
        .select(`*,Users (name,address),Products (*,Sellers(*))`);

      if (error) {
        // setFetchError("Could not fetch Users");
        // setTests(null);
        console.log(error);
      }
      if (data) {
        // setTests(data);
        console.log(data);
        setSellerData(await filterSeller(data));
        // setFetchError(null);
      }
    };
    fetchUsers();
  }, []);

  const filterSeller = async (data) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    console.log(account);
    let sellerData = data.filter((el) => {
      if (el.Products.Sellers.account == account) {
        return el;
      }
    });
    console.log(sellerData);
    return sellerData.reverse();
  };

  const assignDelivery = async (orderId, pId) => {
    // if (orderID) {
    setLoader(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = signer.getAddress();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx2 = await contract.deleveryReached(orderId);
      const receipt2 = await tx2.wait();
      console.log(receipt2);

      navigate(`/delivery/${pId}`);
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
    // }
  };

  return (
    <div>
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
          Orders to be deliver
        </p>
        <div className="w-full h-[2px] bg-primaryColor mt-2"></div>
      </div>
      <div className="cardContainer flex flex-col gap-5 mt-10 mx-[12%] ">
        {sellerData
          ? sellerData.map((item) => {
              return (
                <div
                  className="w-[100%] flex gap-6 rounded-xl border-[#B9B9B9] border-[1px] py-5 px-10"
                  key={item.id}
                >
                  <div className="min-w-[250px] h-[250px] flex justify-center items-center bg-[#F5F5F5] rounded-2xl">
                    <img
                      src={`${
                        item
                          ? item.Products.purl
                          : "https://cdn.questionpro.com/userimages/site_media/no-image.png"
                      }`}
                      className="h-[100%]"
                    ></img>
                  </div>
                  <div className="w-[100%] flex gap-3">
                    <div className="w-[550px] flex flex-col gap-2">
                      <h1 className="text-[1.2rem]">
                        {item ? item.Products.name : "name"}
                      </h1>
                      <h2 className="text-[1.7rem] font-semibold">
                        ${item ? item.Products.price : "price"}
                      </h2>
                      <p className="text-[#249B3E] font-medium text-[1rem]">
                        CO2 Footprint :{item ? item.Products.cfootprint : "cfp"}
                        g
                      </p>
                      <p className="font-light text-[0.9rem]">
                        {item ? item.Products.description : "description"}
                      </p>
                      <p>Ordered by : {item ? item.Users.name : "name"}</p>
                      <p>
                        Deliver to : {item ? item.Users.address : "address"}
                      </p>
                    </div>
                    <div className=" flex  flex-col gap-5">
                      <div className="">
                        <button
                          onClick={() => assignDelivery(item.id, item.pid)}
                          className="text-[1.3rem] font-medium cursor-pointer text-[#ffffff] text-center bg-primaryColor py-3 px-4 rounded-lg  hover:bg-[#007AAF]"
                        >
                          Reached to Location
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
