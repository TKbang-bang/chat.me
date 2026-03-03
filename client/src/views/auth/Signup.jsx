import React, { useState } from "react";
import "./.css";
import { toast } from "sonner";
import { signup } from "../../services/auth.service";

function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    )
      return toast.error("All fields are required");

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const response = await signup({
        firstname,
        lastname,
        username,
        email,
        password,
      });
      if (!response.success) return toast.error(response.message);

      return (
        toast.success(response.message),
        (window.location.href = "/verify")
      );
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3 className="superior">Chat.me</h3>
        <h1>Sign up</h1>

        <input
          type="text"
          placeholder="First name"
          value={firstname}
          onChange={(e) =>
            setFirstname(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
            )
          }
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastname}
          onChange={(e) =>
            setLastname(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
            )
          }
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
          onChange={(e) => setUsername(e.target.value)}
        />

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
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Sign up</button>

        <p className="out-account">
          Already have an account? <a href="/signin">Sign in</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
