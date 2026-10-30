
import { useEffect, useState } from "react";
import { MapPin, LoaderCircle } from "lucide-react";

function LocationSearch({
  label,
  placeholder,
  selectedLocation,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedLocation || query.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          q: query.trim(),
          format: "jsonv2",
          addressdetails: "1",
          limit: "5",
          countrycodes: "in",
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Location search is currently unavailable.");
        }

        const data = await response.json();

        setSuggestions(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to search locations. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 1100);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedLocation]);

  function handleChange(event) {
    setQuery(event.target.value);
    setSuggestions([]);
    setError("");

    if (selectedLocation) {
      onSelect(null);
    }
  }

  function handleSelect(place) {
    const location = {
      name: place.display_name,
      lat: Number(place.lat),
      lng: Number(place.lon),
      placeId: place.place_id,
    };

    setQuery(place.display_name);
    setSuggestions([]);
    onSelect(location);
  }

  return (
    <div className="relative rounded-xl border px-4 py-3 focus-within:border-green-500">
      <label className="block text-xs text-gray-400">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          className="mt-1 w-full bg-transparent font-medium outline-none"
        />

        {loading && (
          <LoaderCircle
            size={18}
            className="animate-spin text-green-600"
          />
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-[1000] mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {suggestions.map((place) => (
            <button
              key={place.place_id}
              type="button"
              onClick={() => handleSelect(place)}
              className="flex w-full items-start gap-3 border-b border-gray-100 p-4 text-left last:border-0 hover:bg-green-50"
            >
              <MapPin
                size={18}
                className="mt-1 shrink-0 text-green-600"
              />

              <span className="text-sm leading-5 text-gray-700">
                {place.display_name}
              </span>
            </button>
          ))}
        </div>
      )}

      {!loading &&
        query.trim().length >= 3 &&
        suggestions.length === 0 &&
        !selectedLocation &&
        !error && (
          <p className="mt-2 text-xs text-gray-400">
            No matching locations found.
          </p>
        )}

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default LocationSearch;
