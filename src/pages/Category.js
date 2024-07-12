import React from "react";
import { ArrowRight } from "../assets";
import { CategoryCard, Footer, Header, Slider } from "../components";

const cardData = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
];

const Category = () => {
  return (
    <div>
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
        <Slider />
        <div className="CategorySection mx-[5%] my-10">
          <div className="headingContent w-[100%]">
            <div className="flex justify-between">
              <p className="text-[#666666] font-semibold text-[1.2rem]">
                Category
              </p>
              <div className="flex items-center gap-2 font-medium cursor-pointer hover:text-[#666666]">
                View All
                <ArrowRight className="" />
              </div>
            </div>
            <div className="w-full h-[2px] bg-[#EDEDED] mt-2">
              <div className="w-[110px] h-[2px] bg-primaryColor"></div>
            </div>
          </div>
          <div className="cardContainer w-[100%] flex flex-wrap justify-center gap-12 my-5 mt-7">
            {cardData.map(({ id }) => {
              return <CategoryCard key={id} />;
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
