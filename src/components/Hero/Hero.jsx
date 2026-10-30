import { useState } from "react";
import { Bike, CarFront, MapPin } from "lucide-react";
import MapPicker from "../Map/MapPicker";
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
  const [selectedVehicle, setSelectedVehicle] = useState("bike");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);
  const [mapPosition, setMapPosition] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Temporary demo distance for vehicle cards and fare preview.
  const demoDistance = 5;

  const selectedRide = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicle,
  );

  const estimatedFare =
    selectedRide.baseFare + selectedRide.perKm * demoDistance;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setBooking(null);

    if (!pickupLocation || !destinationLocation) {
      setMessage("Please select both pickup and destination from suggestions.");
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

      const url = `https://router.project-osrm.org/route/v1/driving/${pickupLocation.lng},${pickupLocation.lat};${destinationLocation.lng},${destinationLocation.lat}?overview=false`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to calculate route.");
      }

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes?.length) {
        throw new Error("No route found between these locations.");
      }

      // Convert metres into kilometres.
      const distance = Number((data.routes[0].distance / 1000).toFixed(2));

      const fare = Math.round(
        selectedRide.baseFare + selectedRide.perKm * distance,
      );

      setBooking({
        pickup: pickupLocation.name,
        destination: destinationLocation.name,
        vehicle: selectedRide.name,
        fare,
        distance,
      });
    } catch (error) {
      setMessage(
        error.message || "Something went wrong while calculating the route.",
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
            <h3 className="text-xl font-bold text-gray-900">Book your ride</h3>

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

                        <p className="text-sm font-semibold">{vehicle.name}</p>

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

                  {pickupLocation && destinationLocation ? (
                    <>
                      <p className="text-xl font-bold">₹{estimatedFare}</p>
                      <p className="text-xs text-gray-400">
                        Demo estimate · {demoDistance} km
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-gray-400">
                      Enter pickup and destination
                    </p>
                  )}
                </div>

                {pickupLocation && destinationLocation && (
                  <p className="text-sm font-semibold text-green-600">
                    {selectedRide.arrival} away
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCalculating ? "Calculating route..." : "Review Booking →"}
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
                  <h4 className="font-bold text-green-900">Booking Summary</h4>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={17} className="shrink-0 text-green-700" />
                    <div>
                      <p className="text-gray-500">Pickup</p>
                      <p className="font-medium">{booking.pickup}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={17} className="shrink-0 text-green-700" />
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
        {/* Show Map only after successful booking estimate */}
        {booking && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-900">Your Route</h3>

            <MapPicker
              position={mapPosition}
              onLocationSelect={setMapPosition}
            />

            {mapPosition && (
              <p className="text-sm text-green-700">
                Selected coordinates: {mapPosition.lat.toFixed(5)},{" "}
                {mapPosition.lng.toFixed(5)}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
