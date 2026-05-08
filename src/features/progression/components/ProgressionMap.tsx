import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, Polygon, GeoJSON } from "react-leaflet";
import type { VisitedLocationMapItem } from "../model/progression.types";
import { buildProgressionZones } from "../game/progressionZones";

type Props = {
  locations: VisitedLocationMapItem[];
};

export default function ProgressionMap({ locations }: Props) {
  const points = locations.filter(
    (x) => x.hasCoordinates && x.latitude != null && x.longitude != null
  );

  const zones = buildProgressionZones(locations);

  return (
    <>
      {points.length === 0 && (
        <div className="progression-map-empty">
          Ingen destinationer med koordinater endnu. Kortet vises som overblik.
        </div>
      )}

      <div className="progression-map">
        <MapContainer
          center={[55.6761, 12.5683]}
          zoom={5}
          scrollWheelZoom={false}
          className="progression-map__leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zones.map((zone) => {
            if (zone.geoJson) {
              return (
                <GeoJSON
                  key={`zone-geojson-${zone.key}`}
                  data={zone.geoJson}
                  style={{
                    color: zone.status === "unlocked" ? "#16a34a" : "#64748b",
                    fillColor: zone.status === "unlocked" ? "#22c55e" : "#94a3b8",
                    fillOpacity: zone.status === "unlocked" ? 0.18 : 0.08,
                    weight: 2,
                  }}
                />
              );
            }

            if (!zone.polygon) {
              return null;
            }

            return (
              <Polygon
                key={`zone-polygon-${zone.key}`}
                positions={zone.polygon}
                pathOptions={{
                  color: zone.status === "unlocked" ? "#16a34a" : "#64748b",
                  fillColor: zone.status === "unlocked" ? "#22c55e" : "#94a3b8",
                  fillOpacity: zone.status === "unlocked" ? 0.18 : 0.08,
                  weight: 2,
                }}
              />
            );
          })}

          {points.map((location) => (
            <Marker
              key={`location-${location.visitedLocationId}`}
              position={[location.latitude!, location.longitude!]}
            >
              <Popup>
                <strong>{location.name}</strong>
                <br />
                {location.country}
                <br />
                Besøgt{" "}
                {location.visitCount === 1
                  ? "1 gang"
                  : `${location.visitCount} gange`}
              </Popup>
            </Marker>
          ))}

          {zones.map((zone) => (
            <Marker key={`zone-${zone.key}`} position={[zone.latitude, zone.longitude]}>
              <Popup>
                <strong>
                  {zone.status === "unlocked" ? "🟢" : "🔒"} {zone.title}
                </strong>

                <br />
                {zone.description}
                <br />
                <br />

                {zone.status === "unlocked" ? (
                  <>
                    Zone unlocked
                    <br />
                    Besøgt {zone.visitCount} gange
                  </>
                ) : (
                  <>Ikke besøgt endnu</>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}