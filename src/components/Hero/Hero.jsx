import { useState } from "react";
import { Bike, CarFront, MapPin } from "lucide-react";
// import MapPicker from "../Map/MapPicker";
// import LocationSearch from "../LocationSearch/LocationSearch"; // replacing this with ola maps.
import OlaMap from "../OlaMap/OlaMap";
import LocationSearch from "../LocationSearch/LocationSearch";

const vehicles = [
  {
    id: "bike",
    name: "Bike",
    icon: Bike,
    baseFare: 20,
    perKm: 8,
    arrival: "3 min",
  },
  {
    id: "auto",
    name: "Auto",
    icon: CarFront,
    baseFare: 30,
    perKm: 12,
    arrival: "5 min",
  },
  {
    id: "car",
    name: "Car",
    icon: CarFront,
    baseFare: 60,
    perKm: 18,
    arrival: "7 min",
  },
];

function Hero() {
  const [routePolyline, setRoutePolyline] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("bike");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const demoDistance = 5;

  const selectedRide = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicle
  );

  const estimatedFare =
    selectedRide.baseFare + selectedRide.perKm * demoDistance;

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setBooking(null);
    setRoutePolyline(null);

    if (!pickupLocation || !destinationLocation) {
      setMessage(
        "Please select both pickup and destination from suggestions."
      );
      return;
    }

    if (
      pickupLocation.lat === destinationLocation.lat &&
      pickupLocation.lng === destinationLocation.lng
    ) {
      setMessage("Pickup and destination cannot be the same.");
      return;
    }

    try {
      setIsCalculating(true);

      const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;

      if (!apiKey) {
        throw new Error("Ola Maps API key is missing. Check your .env file.");
      }

      const params = new URLSearchParams({
        origin: `${pickupLocation.lat},${pickupLocation.lng}`,
        destination: `${destinationLocation.lat},${destinationLocation.lng}`,
        mode: "driving",
        api_key: apiKey,
      });

      const response = await fetch(
        `https://api.olamaps.io/routing/v1/directions?${params.toString()}`,
        {
          method: "POST",
          headers: {
            "X-Request-Id": `LOCAL-${Date.now()}`,
          },
        }
      );

      const data = await response.json();

      console.log("OLA DIRECTIONS RESPONSE:", data);

      if (!response.ok) {
        console.error("OLA API ERROR:", data);

        throw new Error(
          data.message || `Ola Directions API error: ${response.status}`
        );
      }

      if (!data.routes?.length) {
        console.error("Unexpected Ola response:", data);
        throw new Error("No route found. Check the browser console.");
      }

      const route = data.routes[0];
      const leg = route.legs?.[0];

      if (!leg || !route.overview_polyline) {
        console.error("Missing route details:", route);
        throw new Error("Ola response is missing route distance or geometry.");
      }

      const distance = Number((leg.distance / 1000).toFixed(2));
      const duration = Math.ceil(leg.duration / 60);

      setRoutePolyline(route.overview_polyline);

      const fare = Math.round(
        selectedRide.baseFare + selectedRide.perKm * distance
      );

      setBooking({
        pickup: pickupLocation.name,
        destination: destinationLocation.name,
        vehicle: selectedRide.name,
        fare,
        distance,
        duration,
      });
    } catch (error) {
      console.error("Route calculation failed:", error);

      setMessage(
        error.message || "Something went wrong while calculating the route."
      );
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-green-100 via-white to-green-200">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">
        {/* Left Side */}
        <div>
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            🚀 India's Local Ride Platform
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-gray-900">
            Travel Smarter,
            <br />
            Ride <span className="text-green-600">LOCAL</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Book safe and affordable rides within your city or village. Fast
            pickup, verified drivers, transparent pricing, and a seamless
            experience.
          </p>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900">
              Book your ride
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Fast pickup. Affordable fares.
            </p>

            <div className="mt-5 space-y-4">
              {/* Pickup */}
              <LocationSearch
                label="Pickup"
                placeholder="Enter pickup location"
                selectedLocation={pickupLocation}
                onSelect={setPickupLocation}
              />

              {/* Destination */}
              <LocationSearch
                label="Destination"
                placeholder="Where are you going?"
                selectedLocation={destinationLocation}
                onSelect={setDestinationLocation}
              />

              {/* Vehicle Selection */}
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Choose your ride
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {vehicles.map((vehicle) => {
                    const Icon = vehicle.icon;
                    const isSelected = selectedVehicle === vehicle.id;

                    const fare =
                      vehicle.baseFare + vehicle.perKm * demoDistance;

                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => {
                          setSelectedVehicle(vehicle.id);
                          setBooking(null);
                          setRoutePolyline(null);
                          setMessage("");
                        }}
                        className={`rounded-xl border p-3 text-center transition ${
                          isSelected
                            ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <Icon
                          size={25}
                          className="mx-auto mb-2 text-gray-800"
                        />

                        <p className="text-sm font-semibold">
                          {vehicle.name}
                        </p>

                        <p className="mt-1 text-sm font-bold text-green-700">
                          ₹{fare}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Fare */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Estimated Fare</p>

                  <p className="text-xl font-bold">
                    ₹{booking ? booking.fare : estimatedFare}
                  </p>

                  <p className="text-xs text-gray-400">
                    {booking
                      ? `Actual route estimate · ${booking.distance} km`
                      : `Demo estimate · ${demoDistance} km`}
                  </p>
                </div>

                {pickupLocation && destinationLocation && (
                  <p className="text-sm font-semibold text-green-600">
                    {booking
                      ? `${booking.duration} min`
                      : `${selectedRide.arrival} away`}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCalculating
                  ? "Calculating route..."
                  : "Review Booking →"}
              </button>

              {message && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {message}
                </p>
              )}

              {/* Booking Summary */}
              {booking && (
                <div className="space-y-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <h4 className="font-bold text-green-900">
                    Booking Summary
                  </h4>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin
                      size={17}
                      className="shrink-0 text-green-700"
                    />
                    <div>
                      <p className="text-gray-500">Pickup</p>
                      <p className="font-medium">{booking.pickup}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin
                      size={17}
                      className="shrink-0 text-green-700"
                    />
                    <div>
                      <p className="text-gray-500">Destination</p>
                      <p className="font-medium">{booking.destination}</p>
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-green-200 pt-3 text-sm">
                    <span>
                      {booking.vehicle} · {booking.distance} km
                    </span>

                    <span className="font-bold">₹{booking.fare}</span>
                  </div>

                  <p className="text-xs text-green-800">
                    Estimated fare only. No actual ride has been booked.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Side - Interactive Map */}
        {booking && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-900">
              Your Route
            </h3>

            <OlaMap routePolyline={routePolyline} />
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
