import React, { useState } from "react";
import "./.css";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-container">
      <form className="auth-form">
        <h3 className="superior">Chat.me</h3>
        <h1>Sign in</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign in</button>

        <p className="out-account">
          Already have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Signin;
