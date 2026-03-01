import React from "react";
import "./.css";

function Sign() {
  return (
    <div className="big-container">
      <h3 className="superiror">chat.me</h3>
      <h1>Welcome to chat.me</h1>
      <p>Sign in or sign up to get started</p>
      <p>Send requests and join groups</p>
      <p>Chat with your friends</p>

      <div className="btns">
        <a href="/signin" className="in">
          Sign in
        </a>
        <p>or</p>
        <a href="/signup" className="up">
          Sign up
        </a>
      </div>
    </div>
  );
}

export default Sign;
