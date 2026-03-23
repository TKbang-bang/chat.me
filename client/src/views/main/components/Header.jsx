import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "sonner";
import {
  CloseIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  UserRequestIcon,
} from "../../../svg/svgs";
import { logout } from "../../../services/auth.service";
import "./.css";
import { IoContext } from "../../../contexts/io.context";

function Header() {
  const socket = useContext(IoContext);

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res.success) return toast.error(res.message);

      document.querySelector(".menu-container").classList.remove("active");
      socket.disconnect();
      return (window.location.href = "/sign");
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

  const handleMenuContainerClick = (e) => {
    if (e.target.classList.contains("menu-container")) {
      document.querySelector(".menu-container").classList.remove("active");
    }
  };

  document
    .querySelectorAll(".menu-container .menu .mini-menu .options li")
    .forEach((link) => {
      link.addEventListener("click", () => {
        document.querySelector(".menu-container").classList.remove("active");
      });
    });

  return (
    <header>
      <Link to="/chats" className="logo">
        <h1>Chat.me</h1>
      </Link>

      <button
        className="responsive-item menu-icon"
        onClick={() =>
          document.querySelector(".menu-container").classList.add("active")
        }
      >
        <MenuIcon />
      </button>

      <div className="menu-container" onClick={handleMenuContainerClick}>
        <div className="menu">
          <div className="close-icon-container">
            <button
              className="responsive-item close-icon"
              onClick={() =>
                document
                  .querySelector(".menu-container")
                  .classList.remove("active")
              }
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mini-menu">
            <ul className="options">
              <li>
                <NavLink to={"/chats"}>
                  <HomeIcon />
                  <p>Home</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/users"}>
                  <UserIcon />
                  <p>Users</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/requests"}>
                  <UserRequestIcon />
                  <p>Requests</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/search"}>
                  <SearchIcon />
                  <p>Search</p>
                </NavLink>
              </li>
            </ul>

            <button className="logout" onClick={handleLogout}>
              <LogoutIcon />
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
