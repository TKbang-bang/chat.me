import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sign from "./views/auth/Sign";
import Signup from "./views/auth/Signup";
import Signin from "./views/auth/Signin";
import Verify from "./views/auth/Verify";

function App() {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (status) return;

    if (
      window.location.pathname !== "/signin" &&
      window.location.pathname !== "/signup" &&
      window.location.pathname !== "/sign" &&
      window.location.pathname !== "/verify"
    )
      window.location.href = "/sign";
  }, []);

  return (
    <>
      <Routes>
        <Route path="/sign" element={<Sign />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </>
  );
}

export default App;
