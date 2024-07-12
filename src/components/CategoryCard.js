import React from "react";

const CategoryCard = () => {
  return (
    <div className="flex flex-col gap-3 font-semibold">
      <div className="w-[200px] h-[200px] rounded-full bg-[#F5F5F5] overflow-hidden border-[#EDEDED] border-2 cursor-pointer hover:border-primaryColor"></div>
      <p className="text-center">Electronics</p>
    </div>
  );
};

export default CategoryCard;
