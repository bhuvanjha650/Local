import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinned, ArrowLeft } from "lucide-react";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState("identifier");
  const [method, setMethod] = useState("email");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleContinue(event) {
    event.preventDefault();
    setError("");

    const value = identifier.trim();

    if (!value) {
      setError("Enter your email address or phone number.");
      return;
    }

    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const looksLikePhone = /^\+?[\d\s()-]{7,20}$/.test(value);

    if (looksLikeEmail) {
      setMethod("email");
      setStep("password");
    } else if (looksLikePhone && /\d/.test(value)) {
      setMethod("phone");
      setStep("otp");
    } else {
      setError("Enter a valid email address or phone number.");
    }
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError(
      "Frontend demo only. Password verification will be added with the backend."
    );
  }

  function handleOtpSubmit(event) {
    event.preventDefault();
    setError("OTP verification will be added with the backend.");
  }

  function goBack() {
    setError("");
    setPassword("");
    setStep("identifier");
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="flex h-20 items-center px-6 sm:px-10">
        <Link to="/" aria-label="LOCAL home" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
            <MapPinned size={23} className="text-green-500" />
          </div>

          <span className="text-2xl font-extrabold tracking-tight">
            LO<span className="text-green-600">CAL</span>
          </span>
        </Link>
      </header>

      {/* Authentication form */}
      <section className="mx-auto w-full max-w-[460px] px-6 pb-12 pt-12 sm:pt-16">
        {step !== "identifier" && (
          <button
            type="button"
            onClick={goBack}
            className="mb-8 flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}

        {step === "identifier" && (
          <>
            <h1 className="mb-7 text-3xl font-semibold leading-tight sm:text-4xl">
              What's your phone number or email?
            </h1>

            <form onSubmit={handleContinue} className="space-y-5">
              <label htmlFor="identifier" className="sr-only">
                Phone number or email
              </label>

              <input
                id="identifier"
                type="text"
                autoComplete="username"
                autoFocus
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  setError("");
                }}
                placeholder="Enter phone number or email"
                className="w-full rounded-xl border-2 border-black bg-gray-50 px-5 py-4 text-base outline-none transition focus:bg-white"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
              >
                Continue
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-sm text-gray-600">or</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  setError("Google sign-in will be integrated later.")
                }
                className="w-full rounded-xl bg-gray-100 py-4 font-medium transition hover:bg-gray-200"
              >
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() =>
                  setError("Apple sign-in will be integrated later.")
                }
                className="w-full rounded-xl bg-gray-100 py-4 font-medium transition hover:bg-gray-200"
              >
                Continue with Apple
              </button>
            </div>

            <p className="mt-8 text-xs leading-5 text-gray-500">
              By continuing, you agree to LOCAL's Terms of Service and
              acknowledge our Privacy Policy.
            </p>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="mb-3 text-3xl font-semibold sm:text-4xl">
              Welcome back
            </h1>

            <p className="mb-7 break-all text-sm text-gray-600">
              {identifier}
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                className="w-full rounded-xl border-2 border-black px-5 py-4 text-base outline-none"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-black py-4 font-semibold text-white hover:bg-gray-800"
              >
                Log in
              </button>
            </form>

            <button
              type="button"
              onClick={() =>
                setError("Password recovery will be implemented later.")
              }
              className="mt-5 text-sm font-medium underline"
            >
              Forgot password?
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="mb-3 text-3xl font-semibold sm:text-4xl">
              Verify your number
            </h1>

            <p className="mb-7 text-sm leading-6 text-gray-600">
              A verification code would be sent to{" "}
              <span className="font-semibold text-black">{identifier}</span>.
              Actual SMS delivery will be connected later.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <label htmlFor="otp" className="block text-sm font-medium">
                Verification code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border-2 border-black px-5 py-4 text-base outline-none"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-black py-4 font-semibold text-white hover:bg-gray-800"
              >
                Verify
              </button>
            </form>
          </>
        )}

        {error && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-gray-100 px-4 py-3 text-sm leading-5 text-gray-700"
          >
            {error}
          </p>
        )}

        <p className="mt-10 text-center text-sm text-gray-600">
          New to LOCAL?{" "}
          <Link
            to="/signup"
            className="font-semibold text-black underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
