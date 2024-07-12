import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { CartIcon, UserIcon } from "../assets";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import supabase from "../config/supabase";
import { useState } from "react";

const ConnectWallet = () => {
  const [name, setName] = useState("");
  const [seller, setSeller] = useState("");
  const [isSeller, setisSeller] = useState("");

  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    deactivateWeb3,
    Moralis,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;

    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, []);

  useEffect(() => {
    // Moralis
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      window.location.reload();
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isWeb3Enabled) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        let isSeller = false;

        const { data, error } = await supabase
          .from("Sellers") // Name of Table
          .select()
          .eq("account", address);

        if (error) {
          console.log(error);
        }
        if (data) {
          // console.log(data);
          await setName((await data) && data[0] ? data[0].name : "");
          isSeller = data && data[0] ? true : false;
        }
        if (!isSeller) {
          const { data, error } = await supabase
            .from("Users") // Name of Table
            .select()
            .eq("account", address);

          if (error) {
            console.log(error);
          }
          if (data) {
            console.log(data);
            await setName((await data) && data[0] ? data[0].name : "");
          }
        }
      }
    };
    fetchUsers();
  }, [account]);

  useEffect(() => {
    const fetchSeller = async () => {
      if (isWeb3Enabled) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const { data, error } = await supabase
          .from("Sellers") // Name of Table
          .select()
          .eq("account", address);

        if (error) {
          console.log(error);
        }
        if (data) {
          // console.log(data);
          setisSeller(data && data[0] ? true : false);
        }
      }
    };
    fetchSeller();
  }, [account]);
  return (
    <div>
      {account ? (
        // <Link to="/profile">
        <div className=" flex justify-center items-center font-semibold text-[#666666] gap-2 bg-white p-[6px]">
          <Link to="/create/user">
            <div className="flex items-center gap-2 cursor-pointer">
              <UserIcon className="h-8 w-8 " />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[1rem]">{name ? name : "guest"}</p>
                  {isSeller && (
                    <p className="text-[0.7rem] text-[#ffffff] bg-[#0074A7] rounded-md w-10 text-center h-4">
                      Seller
                    </p>
                  )}
                </div>
                <p className="text-[0.8rem] font-normal">
                  {account.slice(0, 7)}...
                  {account.slice(account.length - 4)}
                </p>
              </div>
            </div>
          </Link>
          <div className="h-9 w-[2px] bg-[#D9D9D9] mx-3"></div>
          <Link to="/orders">
            <div className="flex items-center gap-1 cursor-pointer">
              <CartIcon className="h-7 w-7" />
              <p>Orders</p>
            </div>
          </Link>
        </div>
      ) : (
        // </Link>
        <button
          // className="connect bg-[#2CAE8F] w-full py-2 px-4 font-bold text-white rounded-md hover:bg-[#219f82]"
          className=" text-[#424242] border-2 bg-white border-[#424242] py-2 px-5 w-[100%] rounded-[5px] hover:border-primaryColor hover:text-primaryColor"
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
