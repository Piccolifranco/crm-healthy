"use client";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";


export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex-grow w-full py-12 bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <div className="w-[100%] justify-center flex">
          <Image
            src="/images/microscope.svg"
            alt="microscope"
            height={200}
            width={200}
          />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Administración de Historia Clínica
        </h1>
        {isLogin ? (
          <Login onRegisterClick={() => setIsLogin(false)} />
        ) : (
          <Register onLoginClick={() => setIsLogin(true)} />
        )}
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
}