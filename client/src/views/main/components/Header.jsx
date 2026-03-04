import React from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "sonner";
import {
  CloseIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  UserRequestIcon,
} from "../../../svg/svgs";
import { logout } from "../../../services/auth.service";

function Header() {
  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res.success) return toast.error(res.message);

      return (window.location.href = "/sign");
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

  return (
    <header>
      <Link to="/" className="logo">
        <h1>Chat.me</h1>
      </Link>

      <button className="responsive-item">
        <MenuIcon />
      </button>

      <div className="menu-container">
        <div className="menu">
          <button className="responsive-item">
            <CloseIcon />
          </button>

          <div className="mini-menu">
            <ul className="options">
              <li>
                <NavLink to={"/account"}>
                  <UserIcon />
                  <p>Account</p>
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
