import { ArrowRight, MapPin, Bike } from "lucide-react";
import scooter from "../../assets/scooter.png";

function Hero() {
  return (
    <section className="relative overflow-hidden w-full min-h-[90vh] bg-[radial-gradient(circle_at_top_left,#86efac_0%,#dcfce7_25%,white_65%,#bbf7d0_100%)]">
      <div className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left Side */}
        <div>
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            🚀 India's Local Ride Platform
          </span>

          <h1 className="mt-8 text-5xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Travel Smarter,
            <br />
            Ride <span className="text-green-600">LOCAL</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
            Book safe and affordable rides within your city or village. Fast
            pickup, verified drivers, transparent pricing, and a seamless
            experience.
          </p>

          <div className="flex gap-5 mt-10">
            <div className="mt-10 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900">
                Book your ride
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Fast pickup. Affordable fares.
              </p>

              <div className="mt-5 space-y-4">
                <div className="border rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400">Pickup</p>
                  <input
                    placeholder="Current Location"
                    className="outline-none w-full font-medium"
                  />
                </div>

                <div className="border rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400">Destination</p>
                  <input
                    placeholder="Where are you going?"
                    className="outline-none w-full font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="border rounded-xl py-3">🛵 Bike</button>

                  <button className="border rounded-xl py-3">Now</button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Estimated Fare</p>

                    <p className="font-bold text-xl">₹89</p>
                  </div>

                  <p className="text-green-600 font-semibold">8 min</p>
                </div>

                <button className="w-full bg-black hover:bg-gray-900 text-white rounded-xl py-4 font-semibold">
                  Book Ride →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex justify-center items-center">
          <img
            src={scooter}
            alt="Scooter"
            className="w-[500px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
