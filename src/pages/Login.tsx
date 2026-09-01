import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { Mail, ShieldCheck, ArrowRight, Sparkles, Flame, RefreshCw, Edit2, Lock } from "lucide-react";
import { ENV } from "../config/env";
import { getImageUrl } from "../utils/imageHelper";

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const { sendOTP, verifyOTP, googleLogin, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [logoError, setLogoError] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  // Focus first OTP input box when entering step 2
  useEffect(() => {
    if (step === "otp") {
      const timerId = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, [step]);

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

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    const success = await sendOTP(email);
    setLoading(false);

    if (success) {
      setStep("otp");
      setOtpDigits(Array(6).fill(""));
      setTimer(60); // 60 seconds cooldown
    }
  };

  const triggerVerify = async (otpCode: string) => {
    if (!otpCode || otpCode.length < 6) return;

    setLoading(true);
    const success = await verifyOTP(email, otpCode);
    setLoading(false);

    if (success) {
      navigate(redirectPath);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    triggerVerify(fullOtp);
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const newDigits = [...otpDigits];
    const char = cleaned.slice(-1);
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto move focus to next box
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (char && index === 5 && newDigits.every((d) => d !== "")) {
      triggerVerify(newDigits.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otpDigits[index] === "" && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = "";
        setOtpDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = Array(6).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);

    const targetIndex = Math.min(pastedData.length, 5);
    inputRefs.current[targetIndex]?.focus();

    if (pastedData.length === 6) {
      triggerVerify(pastedData);
    }
  };

  const logoUrl = settings?.logo ? getImageUrl(settings.logo, "logos") : null;

  return (
    <div className="login-container">
      {/* Background glowing ambient elements */}
      <div className="login-bg-glow1" />
      <div className="login-bg-glow2" />

      <div className="login-card animate-fade-in">
        <div className="login-header">
          {/* Dynamic Logo Header */}
          <div className="login-logo-container">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={settings.project || "Logo"}
                className="login-brand-logo-img"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="login-logo-circle">
                <Flame className="logo-sparkle-icon" size={28} />
              </div>
            )}
          </div>

          <div className="login-step-badge">
            {step === "email" ? (
              <>
                <Sparkles size={13} />
                <span>Step 1 of 2 • Sign In</span>
              </>
            ) : (
              <>
                <ShieldCheck size={13} />
                <span>Step 2 of 2 • Verification</span>
              </>
            )}
          </div>

          <h1>
            {step === "email" ? (
              <>
                Welcome to <span className="brand-accent">{settings.project || "Crackers Siva"}</span>
              </>
            ) : (
              "Security Verification"
            )}
          </h1>
          <p>
            {step === "email"
              ? "Buy Sivakasi premium fireworks online at best rates."
              : "Enter the 6-digit one-time passkey sent to your email."}
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
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Sending Code...
                </>
              ) : (
                <>
                  Get OTP Code
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="login-form">
            {/* Target Email display badge with Edit button */}
            <div className="otp-email-badge">
              <div className="otp-email-info">
                <Mail size={16} className="otp-email-icon" />
                <span className="otp-email-text" title={email}>
                  {email}
                </span>
              </div>
              <button
                type="button"
                className="otp-edit-email-btn"
                onClick={() => {
                  setStep("email");
                  setOtpDigits(Array(6).fill(""));
                }}
                disabled={loading}
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="login-form">
              <div className="form-group">
                <label className="otp-label">Enter 6-Digit OTP</label>
                <div className="otp-inputs-grid" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`otp-box ${digit ? "filled" : ""}`}
                      disabled={loading}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading || otpDigits.join("").length < 6}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="resend-container">
                {timer > 0 ? (
                  <div className="timer-badge">
                    <RefreshCw size={13} className="animate-spin-slow" />
                    <span>
                      Resend code in <strong>{timer}s</strong>
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={() => handleSendOtp()}
                    disabled={loading}
                  >
                    <RefreshCw size={13} /> Resend OTP Code
                  </button>
                )}
              </div>

              <div className="otp-security-note">
                <Lock size={13} />
                <span>Code valid for 10 minutes. Check spam folder if unreceived.</span>
              </div>
            </form>
          </div>
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
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google Logo"
                  className="google-btn-icon"
                />
                Sign in with Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

