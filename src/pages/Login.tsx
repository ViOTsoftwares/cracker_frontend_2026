import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { ENV } from "../config/env";

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const { sendOTP, verifyOTP, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleGoogleLogin = () => {
    if (window.google?.accounts?.oauth2 && ENV.GOOGLE_CLIENT_ID) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: ENV.GOOGLE_CLIENT_ID,
        scope: "email profile",
        callback: async (response: any) => {
          if (response.access_token) {
            setLoading(true);
            const success = await googleLogin({ accessToken: response.access_token });
            setLoading(false);
            if (success) {
              navigate(redirectPath);
            }
          }
        },
      });
      client.requestAccessToken();
    } else {
      console.error("Google SDK not loaded properly");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    const success = await sendOTP(email);
    setLoading(false);

    if (success) {
      setStep("otp");
      setTimer(60); // 60 seconds cooldown
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;

    setLoading(true);
    const success = await verifyOTP(email, otp);
    setLoading(false);

    if (success) {
      navigate(redirectPath);
    }
  };

  return (
    <div className="login-container">
      {/* Background elements */}
      <div className="login-bg-glow1" />
      <div className="login-bg-glow2" />

      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo-circle">
            <Sparkles className="logo-sparkle-icon" size={28} />
          </div>
          <h1>{step === "email" ? "Welcome to CrackersSiva" : "Verify Your Account"}</h1>
          <p>
            {step === "email"
              ? "Buy Sivakasi premium fireworks online at best rates."
              : `Enter the 6-digit OTP code sent to ${email}`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Get OTP Code"}
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div className="form-group">
              <label htmlFor="otp">One-Time Password (OTP)</label>
              <div className="input-with-icon">
                <ShieldCheck className="input-icon" size={18} />
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
              <ArrowRight size={18} />
            </button>

            <div className="resend-container">
              {timer > 0 ? (
                <span className="resend-text">Resend OTP in {timer}s</span>
              ) : (
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP Code
                </button>
              )}
              <button
                type="button"
                className="change-email-btn"
                onClick={() => setStep("email")}
                disabled={loading}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* Google sign-in wrapper */}
        {step === "email" && (
          <div className="google-divider-section">
            <div className="divider-line-wrap">
              <span className="divider-line" />
              <span className="divider-text">or continue with</span>
              <span className="divider-line" />
            </div>

            <div className="google-btn-container">
              <button 
                type="button" 
                className="google-custom-btn" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="google-btn-icon" />
                Sign in with Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
