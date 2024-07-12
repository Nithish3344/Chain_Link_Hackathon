import React from "react";
import { Github } from "../assets";

const Footer = () => {
  return (
    <div className="h-14 flex justify-center items-center bg-[#E4F8FF] ">
      <a
        href="https://github.com/Omkar0803/chainlink-hackathon"
        target="_blank"
      >
        <Github className="h-7 cursor-pointer" />
      </a>
    
    </div>
  );
};

export default Footer;
