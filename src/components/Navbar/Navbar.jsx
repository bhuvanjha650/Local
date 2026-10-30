import { MapPinned } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-8">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <MapPinned className="text-green-500" size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              LO<span className="text-green-600">CAL</span>
            </h1>

            <p className="text-[10px] uppercase tracking-[5px] text-gray-400">
              Ride Smarter
            </p>
          </div>

        </div>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10 text-[16px] font-medium text-gray-700">

          <li>
            <a href="#" className="hover:text-black transition">
              Home
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-black transition">
              Book Ride
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-black transition">
              Become Driver
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-black transition">
              Safety
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-black transition">
              Contact
            </a>
          </li>

        </ul>

       
{/* Buttons */}
<div className="flex items-center gap-4">
  <Link
    to="/login"
    className="px-6 py-2.5 rounded-xl font-medium border border-gray-300 hover:bg-gray-100 transition"
  >
    Login
  </Link>

  <Link
    to="/signup"
    className="px-6 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
  >
    Sign Up
  </Link>
</div>


      </div>
    </nav>
  );
}

export default Navbar;