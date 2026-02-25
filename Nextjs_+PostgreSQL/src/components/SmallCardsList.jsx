import { useRef, useState, useEffect } from "react";
import Card1 from "./Card1";
export default function SmallCardsList({
  productList,
  className,
  card1_className,
}) {
  return (
    <div className={className}>
      {productList.map((item, index) => (
        <Card1
          key={index}
          id={index}
          productObj={item}
          className={card1_className}
        />
      ))}
    </div>
  );
}
