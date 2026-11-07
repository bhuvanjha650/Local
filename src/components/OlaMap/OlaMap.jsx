
import { useEffect, useRef, useState } from "react";
import { OlaMaps } from "olamaps-web-sdk";
import polyline from "@mapbox/polyline";

function OlaMap({ routePolyline }) {
  const mapContainerId = "local-ola-map";
  const mapInstance = useRef(null);
  const routeRef = useRef(routePolyline);
  const [error, setError] = useState("");

  useEffect(() => {
    routeRef.current = routePolyline;
  }, [routePolyline]);

  const drawRoute = (map, encodedRoute) => {
    try {
      const decoded = polyline.decode(encodedRoute);
      const coordinates = decoded.map(([lat, lng]) => [lng, lat]);

      if (coordinates.length < 2) {
        throw new Error("Invalid route coordinates");
      }

      const routeData = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
        },
      };

      const pointsData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { label: "Pickup" },
            geometry: {
              type: "Point",
              coordinates: coordinates[0],
            },
          },
          {
            type: "Feature",
            properties: { label: "Destination" },
            geometry: {
              type: "Point",
              coordinates: coordinates[coordinates.length - 1],
            },
          },
        ],
      };

      // Route line source
      if (map.getSource("local-route")) {
        map.getSource("local-route").setData(routeData);
      } else {
        map.addSource("local-route", {
          type: "geojson",
          data: routeData,
        });
      }

      // Route line layer
      if (!map.getLayer("local-route-line")) {
        map.addLayer({
          id: "local-route-line",
          type: "line",
          source: "local-route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#00A650",
            "line-width": 6,
          },
        });
      }

      // Pickup and destination source
      if (map.getSource("local-points")) {
        map.getSource("local-points").setData(pointsData);
      } else {
        map.addSource("local-points", {
          type: "geojson",
          data: pointsData,
        });
      }

      // Marker circles
      if (!map.getLayer("local-points-circle")) {
        map.addLayer({
          id: "local-points-circle",
          type: "circle",
          source: "local-points",
          paint: {
            "circle-radius": 9,
            "circle-color": [
              "match",
              ["get", "label"],
              "Pickup",
              "#16A34A",
              "Destination",
              "#DC2626",
              "#111827",
            ],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#FFFFFF",
          },
        });
      }

      // Marker labels
      if (!map.getLayer("local-points-label")) {
        map.addLayer({
          id: "local-points-label",
          type: "symbol",
          source: "local-points",
          layout: {
            "text-field": ["get", "label"],
            "text-size": 13,
            "text-offset": [0, 1.7],
            "text-anchor": "top",
            "text-font": ["Open Sans Bold"],
          },
          paint: {
            "text-color": "#111827",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 2,
          },
        });
      }

      // Calculate correct southwest and northeast bounds.
      const lngs = coordinates.map(([lng]) => lng);
      const lats = coordinates.map(([, lat]) => lat);

      const southwest = [
        Math.min(...lngs),
        Math.min(...lats),
      ];

      const northeast = [
        Math.max(...lngs),
        Math.max(...lats),
      ];

      // Zoom to show the entire route.
      map.fitBounds([southwest, northeast], {
        padding: {
          top: 70,
          bottom: 70,
          left: 70,
          right: 70,
        },
        duration: 1200,
        maxZoom: 15,
      });

      setError("");
    } catch (err) {
      console.error("Route drawing error:", err);
      setError("Unable to display route. Check browser console.");
    }
  };

  // Initialize Ola Maps.
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;

    if (!apiKey) {
      setError("Ola Maps API key is missing.");
      return;
    }

    let cancelled = false;

    async function initializeMap() {
      try {
        const olaMaps = new OlaMaps({ apiKey });

        const map = await olaMaps.init({
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: mapContainerId,
          center: [77.209, 28.6139],
          zoom: 5,
        });

        if (cancelled) {
          map.remove();
          return;
        }

        mapInstance.current = map;

        map.once("load", () => {
          if (!cancelled && routeRef.current) {
            drawRoute(map, routeRef.current);
          }
        });
      } catch (err) {
        console.error("Ola Maps initialization error:", err);
        setError("Unable to load Ola Maps. Check your API key.");
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update map whenever a new route is calculated.
  useEffect(() => {
    const map = mapInstance.current;

    if (!map || !routePolyline) return;

    if (map.isStyleLoaded()) {
      drawRoute(map, routePolyline);
    } else {
      map.once("load", () => {
        if (mapInstance.current === map) {
          drawRoute(map, routePolyline);
        }
      });
    }
  }, [routePolyline]);

  return (
    <div className="w-full">
      {error && (
        <p className="mb-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div
        id={mapContainerId}
        className="h-[400px] w-full overflow-hidden rounded-2xl border border-gray-200"
      />
    </div>
  );
}

export default OlaMap;
