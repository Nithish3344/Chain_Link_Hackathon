import React, { useEffect, useState } from "react";
import { Footer, Header } from "../components";
import supabase from "../config/supabase";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [sellerExist, setSellerExist] = useState("");
  const [userExist, setUserExist] = useState("");
  const [pAddress, setpAddress] = useState("");
  const [success, setSuccess] = useState(false);
  const [crating, setcrating] = useState("10");

  useEffect(() => {
    const fetchUsers = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      let sellerExist = false;

      const { data, error } = await supabase
        .from("Sellers") // Name of Table
        .select()
        .eq("account", address);
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
        await setName(data[0] ? data[0].name : "");
        await setpAddress(data[0] ? data[0].based : "");
        await setSellerExist(data && data[0] ? true : false);
        await setIsSeller(data && data[0] ? true : false);
        sellerExist = data && data[0] ? true : false;
      }

      if (!sellerExist) {
        const { data, error } = await supabase
          .from("Users") // Name of Table
          .select()
          .eq("account", address);
        if (error) {
          console.log(error);
        }
        if (data) {
          console.log(data);
          await setName(data[0] ? data[0].name : "");
          await setpAddress(data[0] ? data[0].address : "");
          await setUserExist(data && data[0] ? true : false);
        }
      }
    };
    fetchUsers();
  }, []);

  const createUsers = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = (await signer.getAddress()).toString();

    if (name && pAddress) {
      if (isSeller) {
        if (sellerExist) {
          let { data, error } = await supabase
            .from("Sellers")
            .update([{ name, based: pAddress, account }]) // Name of Table
            .eq("account", account)
            .select();
          if (error) {
            console.log(error);
          }
          if (data) {
            console.log(data);
            setSuccess(true);
          }
        } else {
          let { data, error } = await supabase
            .from("Sellers")
            .insert([{ name, based: pAddress, account }]) // Name of Table
            .select();
          if (error) {
            console.log(error);
          }
          if (data) {
            console.log(data);
            setSuccess(true);
          }
        }
      } else {
        // console.log(account);
        if (userExist) {
          let { data, error } = await supabase
            .from("Users")
            .update([{ name, address: pAddress, account, crating }]) // Name of Table
            .eq("account", account)
            .select();
          if (error) {
            console.log(error);
          }
          if (data) {
            console.log(data);
            setSuccess(true);
          }
        } else {
          let { data, error } = await supabase
            .from("Users")
            .insert([{ name, address: pAddress, account, crating }]) // Name of Table
            .select();
          if (error) {
            console.log(error);
          }
          if (data) {
            console.log(data);
            setSuccess(true);
          }
        }
      }
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
              <h2 className=" text-[1.5rem] mb-2">User Successfully Created</h2>
              <p className="font-medium w-[70%] ">Explore now!</p>
            </div>
            <img
              src={require("../assets/success.png")}
              className="h-32 mb-2"
            ></img>
            <div>
              <Link to="/">
                <button
                  // onClick={() => userPetitionSign()}
                  className="bg-primaryColor text-[#ffffff] text-white py-2 px-6 w-52 rounded-[5px] text-[1.1rem] hover:bg-[#007AAF]"
                >
                  Go to Home
                </button>
              </Link>
            </div>
          </div>
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
        <div className="headingContent mx-[5%]">
          <p className="text-[#666666] font-semibold text-[1.5rem]">Profile</p>
          <div className="w-full h-[2px] bg-primaryColor mt-2"></div>
        </div>
      </div>
      <div className="w-[500px] mx-auto flex flex-col justify-between items-center gap-5 rounded-xl border-[#B9B9B9] border-[1px] py-7 px-10 mt-10">
        <div className="flex justify-center items-center -translate-x-5">
          <span className="ml-3 text-[1.5rem] font-medium text-gray-900 dark:text-gray-300 mr-2">
            Customer
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSeller}
              className="sr-only peer"
              onChange={() => setIsSeller(!isSeller)}
            />
            <div className="w-11 h-6 bg-[#424242] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#008ECC] dark:peer-focus:ring-[#008ECC] rounded-full peer dark:bg-[#424242] peer-checked:after:translate-x-full peer-checked:after:border-[#ffffff] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#ffffff] after:border-[#424242] after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-[#424242] peer-checked:bg-[#008ECC]"></div>
          </label>
          <span className="ml-3 text-[1.5rem] font-medium text-gray-900 dark:text-gray-300">
            Seller
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <label>Name</label>
          <input
            type="text"
            className="bg-[#F3F9FB] w-[350px] h-10 p-5 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="flex flex-col gap-2">
          <label>Physical Address</label>
          <textarea
            className="bg-[#F3F9FB] w-[350px] h-28 p-3 rounded-md"
            value={pAddress}
            onChange={(e) => setpAddress(e.target.value)}
          ></textarea>
        </div>
        {!isSeller && (
          <div className="flex flex-col gap-2">
            <label>carbon rating</label>
            <input
              type="text"
              className="bg-[#F3F9FB] w-[350px] h-10 p-5 rounded-md"
              value={crating}
              readOnly
            ></input>
          </div>
        )}
        <button
          onClick={() => createUsers()}
          className="text-[1.3rem] font-medium w-44 cursor-pointer text-[#ffffff] text-center bg-primaryColor py-3 px-4 rounded-lg  hover:bg-[#007AAF]"
        >
          Save changes
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CreateUser;
