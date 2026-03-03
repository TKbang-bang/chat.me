import React, { useEffect } from "react";
import { getAccessToken } from "../../services/token.service";
import { isUserLogged } from "../../services/auth.service";

function Home() {
  const handleUserLogged = async () => {
    try {
      const res = await isUserLogged();
      if (!res.success) console.log(res.message);

      console.log({ accessToken: getAccessToken() });
    } catch (error) {}
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleUserLogged}>access token</button>
    </div>
  );
}

export default Home;
