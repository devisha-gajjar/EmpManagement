// src/components/GlobalLoader.tsx
import React from "react";
import "./GlobalLoader.css"; // You can create your custom CSS for the loader
import { useAppSelector } from "../../../app/hooks";

const GlobalLoader = () => {
  const { isLoading } = useAppSelector((state) => state.loader);
  console.log("loader value", isLoading);
  return isLoading ? (
    // <div className="loader-overlay">
    //   <div className="loader"></div>
    // </div>
    <div></div>
  ) : (
    <></>
  );
};

export default GlobalLoader;
