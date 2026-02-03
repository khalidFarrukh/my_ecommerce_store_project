import { useRef, useState, useEffect } from "react";
import Card1 from "./Card1";
export default function SmallCardsList({ productList, className }) {
  return (
    <div
      className={`
        grid
        grid-cols-2
        lg:grid-cols-4
        mt-5
        gap-x-5
        gap-y-5
        w-full
        ${className}
      `}
    >
      {productList.map((item, index) => (
        <Card1
          key={item.route ?? index}
          id={index}
          productObj={item}
          className={"!min-h-[300px] !h-[15vw] !lg:h-[15vw]"}
        />
      ))}
    </div>
  );
}
