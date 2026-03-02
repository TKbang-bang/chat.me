import React, { useEffect, useState } from "react";

function Verify() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => {
    const expiresAt = Number(localStorage.getItem("codeExpiresAt"));
    if (!expiresAt) return 0;

    const remaining = Math.floor((expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="auth-container">
      <form className="auth-form">
        <h3 className="superior">Chat.me</h3>
        <h1>Code Verification</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit">Verify</button>

        <p>
          Expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      </form>
    </div>
  );
}

export default Verify;
