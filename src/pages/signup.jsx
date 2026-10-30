import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinned, Eye, EyeOff, ArrowRight } from "lucide-react";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\+?[\d\s()-]{10,20}$/.test(form.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    setSuccess(true);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="flex h-20 items-center px-6 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
            <MapPinned size={23} className="text-green-500" />
          </div>

          <span className="text-2xl font-extrabold tracking-tight">
            LO<span className="text-green-600">CAL</span>
          </span>
        </Link>
      </header>

      {/* Signup form */}
      <section className="mx-auto w-full max-w-[460px] px-6 pb-12 pt-8 sm:pt-12">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Create your LOCAL account
        </h1>

        <p className="mb-8 mt-3 text-sm leading-6 text-gray-600">
          Sign up to get started with your next ride.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3.5 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3.5 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium"
            >
              Phone number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3.5 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Create password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border-2 border-gray-300 px-4 py-3.5 pr-12 outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Use at least 8 characters.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              Frontend validation passed! Account creation will be connected
              when we build the backend.
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-black underline underline-offset-4"
          >
            Log in
          </Link>
        </p>

        <p className="mt-8 text-xs leading-5 text-gray-500">
          By creating an account, you agree to LOCAL's Terms of Service and
          Privacy Policy.
        </p>
      </section>
    </main>
  );
}

export default Signup;
