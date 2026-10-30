
import { MapContainer, TileLayer, useMapEvents, CircleMarker, Popup } from "react-leaflet";

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onLocationSelect({
        lat,
        lng,
      });
    },
  });

  return null;
}

function MapPicker({ position, onLocationSelect }) {
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-2xl border border-gray-200">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onLocationSelect={onLocationSelect} />

        {position && (
          <CircleMarker
            center={[position.lat, position.lng]}
            radius={9}
            pathOptions={{
              color: "#15803d",
              fillColor: "#22c55e",
              fillOpacity: 1,
            }}
          >
            <Popup>Selected location</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}

export default MapPicker;
