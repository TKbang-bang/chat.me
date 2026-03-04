import React, { useEffect } from "react";
import { getAccessToken } from "../../services/token.service";
import { isUserLogged } from "../../services/auth.service";
import "./.css";
import {
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  UserRequestIcon,
} from "../../svg/svgs";
import Header from "./components/Header";

function Home() {
  const handleUserLogged = async () => {
    try {
      const res = await isUserLogged();
      if (!res.success) console.log(res.message);

      console.log({ accessToken: getAccessToken() });
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <main className="home-main">
      <Header />
      <h1>Home</h1>
      <button onClick={handleUserLogged}>access token</button>
    </main>
  );
}

export default Home;
