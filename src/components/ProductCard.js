import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ data }) => {
  return (
    <Link to={`/product/${data.pid}`}>
      <div className="h-[300px] w-[250px] rounded-2xl overflow-hidden border-[#EDEDED] border-2 cursor-pointer hover:border-primaryColor">
        <div className="bg-[#F5F5F5] h-[190px] w-[100%] flex items-center justify-center">
          <img
            src={`${
              data
                ? data.purl
                : "https://cdn.questionpro.com/userimages/site_media/no-image.png"
            }`}
            className="h-[100%]"
          ></img>
        </div>
        <div className="font-semibold flex flex-col justify-start px-3 py-2 gap-1">
          <p>{data ? data.name : ""}</p>
          <div className="font-bold flex gap-1">
            <p>${data ? data.price : ""}</p>
            {/* <p className="font-normal">₹74999</p> */}
          </div>
          <div className="w-full h-[2px] bg-[#EDEDED] my-1"></div>
          <p className="text-[#249B3E]">
            CO2 Footprint : {data ? data.cfootprint : "10"}g
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
