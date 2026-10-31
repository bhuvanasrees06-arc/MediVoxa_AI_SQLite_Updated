
import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin, onRegister }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!showOtp) {
      setShowOtp(true);
      setError("Enter your OTP to continue. Connect an OTP service to send a real OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }

    // Connect this callback to the backend login API.
    if (onLogin) {
      onLogin({ mobile, password, otp });
    } else {
      setError("Login API is not connected yet.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">✚</div>
        <h1>MediVoxa AI</h1>
        <p className="login-subtitle">
          Your personal AI healthcare assistant
        </p>

        <h2>Welcome Back</h2>
        <p className="login-description">
          Sign in to access your healthcare dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="mobile">Mobile Number</label>
          <div className="mobile-field">
            <span>+91</span>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {showOtp && (
            <>
              <label htmlFor="otp">6-Digit OTP</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
              />
            </>
          )}

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="login-button" type="submit">
            {showOtp ? "Verify & Login" : "Continue"}
          </button>
        </form>

        <p className="register-text">
          New patient?{" "}
          <button
            type="button"
            className="register-link"
            onClick={onRegister}
          >
            Create an account
          </button>
        </p>

        <p className="login-footer">
          Your health matters. Your information should stay secure.
        </p>
      </section>
    </main>
  );
}
