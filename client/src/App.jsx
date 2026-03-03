import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Sign from "./views/auth/Sign";
import Signup from "./views/auth/Signup";
import Signin from "./views/auth/Signin";
import Verify from "./views/auth/Verify";
import Home from "./views/main/Home";
import { isUserLogged } from "./services/auth.service";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

function App() {
  const isUserAuthenticated = async () => {
    try {
      const res = await isUserLogged();
      if (!res.success) {
        if (
          window.location.pathname !== "/signin" &&
          window.location.pathname !== "/signup" &&
          window.location.pathname !== "/sign" &&
          window.location.pathname !== "/verify"
        )
          window.location.href = "/sign";
      }

      return;
      // console.log("You are logged in");
    } catch (error) {
      if (
        window.location.pathname !== "/signin" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/sign" &&
        window.location.pathname !== "/verify"
      )
        window.location.href = "/sign";
    }
  };

  useEffect(() => {
    isUserAuthenticated();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/sign" element={<Sign />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
