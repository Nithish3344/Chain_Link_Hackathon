import React, { useEffect, useState } from "react";
import { Footer, Header } from "../components";
import { FootPrintIcon } from "../assets";
import { Link, useParams } from "react-router-dom";
import supabase from "../config/supabase";

const Product = () => {
  const [productData, setProductData] = useState("");

  const params = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("Products") // Name of Table
        .select("*,Sellers(*)")
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
  console.log(productData);
  return (
    <div>
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
      <div className="productDetail my-10 mx-[10%] flex gap-10 rounded-xl border-[#B9B9B9] border-[1px] py-5 px-8">
        <div className="min-w-[400px] h-[400px] flex justify-center items-center bg-[#F5F5F5] rounded-2xl">
          <img
            src={`${
              productData
                ? productData.purl
                : "https://cdn.questionpro.com/userimages/site_media/no-image.png"
            }`}
            className="h-[100%]"
          ></img>
        </div>
        <div className="w-[100%]">
          <h1 className="text-[2rem]">
            {productData ? productData.name : "name"}
          </h1>
          <h2 className="text-[2.5rem] font-semibold">
            ${productData ? productData.price : "price"}
          </h2>
          <p className="text-[#249B3E] font-semibold text-[1.5rem]">
            CO2 Footprint : {productData ? productData.cfootprint : "cfp"}g
          </p>
          <div>
            <h3 className="font-medium text-[1.1rem] mb-1">About this item</h3>
            <p>{productData ? productData.description : "name"}</p>
          </div>
          <Link to={`/payment/${productData ? productData.pid : "1"}`}>
            <button className="text-[1.3rem] font-medium text-[#ffffff] bg-primaryColor py-3 px-4 rounded-lg my-5 hover:bg-[#007AAF]">
              BUY NOW
            </button>
          </Link>
        </div>
      </div>
      <div className="my-10 mx-[10%] flex gap-7">
        <div className="w-1/2 rounded-xl border-[#B9B9B9] border-[1px] py-5 px-8">
          <h2 className="text-[1.2rem] font-medium mb-3">Seller</h2>
          <ul className="font-normal ml-4 flex flex-col gap-2">
            <li>
              <b className="font-medium">Name:</b>{" "}
              {productData ? productData.Sellers.name : "Seller name"}
            </li>
            <li>
              <b className="font-medium">Location:</b>{" "}
              {productData ? productData.Sellers.based : "Seller based"}
            </li>
            <li className="text-[0.9rem]">
              <b className="text-[1rem] font-medium">Address:</b>{" "}
              {productData ? productData.Sellers.account : "Seller based"}
            </li>
          </ul>
        </div>
        <div className="w-1/2 rounded-xl border-[#B9B9B9] border-[1px] py-5 px-8">
          <h2 className="text-[1.2rem] font-medium mb-3">Shipper</h2>
          <ul className="ml-4 flex flex-col gap-2 font-normal">
            <li className="cursor-pointer hover:text-[#919191]">DHL </li>
            <li className="cursor-pointer hover:text-[#919191]">DTDC</li>
            <li className="cursor-pointer hover:text-[#919191]">Blue Dart</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;
