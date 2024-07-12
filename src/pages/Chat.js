import React from "react";
import { Link } from "react-router-dom";
import { Footer, Header } from "../components";
import { Send } from "../assets";

const Chat = () => {
  return (
    <div>
      <Header />
      <div className="w-[100vw] ">
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
        <div className="headingContent ">
          <p className="text-[#666666] font-semibold text-[1.5rem] w-[70%] mx-auto">
            Customer Care
          </p>
          <div className="w-full h-[2px] bg-primaryColor mt-2"></div>
        </div>
      </div>
      <div className="w-full bg-[#F1F6FB] flex flex-col items-center">
        <div className="msgContainer w-[70%] py-10 min-h-[88vh]">
          <div className="w-full flex">
            <div className="px-4 py-2 rounded-t-2xl rounded-br-2xl bg-[#ffffff] inline-block drop-shadow-sm">
              asasfdf
            </div>
          </div>
          <div className="w-full flex justify-end">
            <div className="px-4 py-2 rounded-t-2xl rounded-bl-2xl bg-[#ffffff] inline-block drop-shadow-sm">
              ascsacacsc
            </div>
          </div>
          <div className="input fixed bottom-3 w-[70%] flex rounded-none bg-transparent gap-2">
            <input
              type="text"
              className="rounded-md px-2 w-[95%] border-[1px] border-[#000000]"
              //   value={msg}
              //   onChange={(e) => setMsg(e.target.value)}
            />
            <button className="w-12 h-12 rounded-full flex justify-center items-center bg-primaryColor border-none hover:bg-[#007AAF] overflow-hidden">
              <Send className="w-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
