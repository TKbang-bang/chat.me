import React from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Account from "./Account";
import Requests from "./Requests";
import Search from "./Search";
import io from "socket.io-client";
import { IoContextProvider } from "../../contexts/io.context";
import ChatViewer from "./ChatViewer";
import CreateGroup from "./CreateGroup";

const socket = io(import.meta.env.VITE_SERVER_URL);

function Home() {
  return (
    <IoContextProvider>
      <main className="home-main">
        <Header />

        <Routes>
          <Route path="*" element={<ChatViewer />} />
          <Route path="/account" element={<Account />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/search" element={<Search />} />
          <Route path="/groups/create" element={<CreateGroup />} />
        </Routes>
      </main>
    </IoContextProvider>
  );
}

export default Home;
