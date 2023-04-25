import React from 'react';
import userLayout from '../user/userLayout';
import axios from "../api/axios";
import { toast } from "react-toastify";
import axiosApiInstance from "../context/interceptor";
import "../assets/css/home.css"
import "bootstrap/dist/css/bootstrap.css";


const HomePage = () => {
  return (
    <>
      <div
        className="container-fluid mx-auto"
        style={{ width: "95%", height: "95%" }}
      >
        <div
          style={{
            width: "30%",
            height: "100%",
            display: "inline-block",
          }}
        >
          <h1>30%</h1>
        </div>
        <div
          style={{
            width: "45%",
            height: "100%",
            display: "inline-block",
          }}
        >
          <h1>45%</h1>
        </div>
        <div style={{ width: "20%", height: "100%", display: "inline-block" }}>
          <h1>20%</h1>
        </div>
      </div>
    </>
  );
};

export default userLayout(HomePage);
