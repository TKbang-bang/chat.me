import React, { useEffect, useState } from "react";
import { RefreshIcon } from "../../svg/svgs";
import "./.css";
import { toast } from "sonner";
import { codeVerify, resendCode } from "../../services/auth.service";

function Verify() {
  const [code, setCode] = useState("");
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
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleResendCode = async () => {
    try {
      const res = await resendCode();
      if (!res.success) return toast.error(res.message);

      localStorage.setItem(
        "codeExpiresAt",
        (Date.now() + 5 * 60 * 1000).toString(),
      );
      setTimeLeft(300);
    } catch (error) {
      return toast.error(error.response.data.errror.message || error.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code) return toast.error("Code is required");

    try {
      const res = await codeVerify(code);
      if (!res.success) return toast.error(res.message);

      return (window.location.href = "/");
    } catch (error) {
      console.log(error);
      return toast.error(error.response.data.errror.message || error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleVerify}>
        <h3 className="superior">Chat.me</h3>
        <h1>Code Verification</h1>
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit">Verify</button>
        <button type="button" className="refresh" onClick={handleResendCode}>
          <RefreshIcon />
          Resend Code
        </button>

        <p>
          Expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      </form>
    </div>
  );
}

export default Verify;
