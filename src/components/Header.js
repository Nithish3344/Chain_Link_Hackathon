import React, { useState } from "react";
import { CartIcon, SearchIcon, UserIcon } from "../assets";
import ConnectWallet from "./ConnectWallet";
import { Link } from "react-router-dom";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <div className="flex items-center justify-between px-[5%] h-20 border-[#C8C8C8] border-b-2">
      <Link to="/">
        {/* <div className="font-bold text-[2rem] text-[#666666]">ZKART</div> */}
        <img src={require("../assets/logo.png")} className="h-[60px]"></img>
      </Link>
      <div className="flex items-center gap-10">
        <div className="flex justify-start items-center bg-[#F3F9FB] w-[700px] rounded-md px-2">
          <a
            href={`/result/${
              searchText ? searchText.replace(/\s/g, "-") : "orange"
            }`}
          >
            <SearchIcon className="h-5 w-7" />
          </a>
          <input
            className="bg-[#F3F9FB]  py-2.5 px-2 w-1/2"
            placeholder="Search essentials, groceries and more..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
        </div>
        <div className="flex items-center justify-center w-[280px]">
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
};

export default Header;
