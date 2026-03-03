import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CloseIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  UserRequestIcon,
} from "../../../svg/svgs";

function Header() {
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
                <NavLink to={"/"}>
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

            <button className="logout">
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
