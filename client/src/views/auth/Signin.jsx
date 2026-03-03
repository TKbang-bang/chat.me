import React, { useState } from "react";
import "./.css";
import { toast } from "sonner";
import { signin } from "../../services/auth.service";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("All fields are required");

    try {
      const res = await signin(email, password);
      if (!res.success) return toast.error(res.message);

      return (window.location.href = "/");
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
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
