import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polygon,
  GeoJSON,
  useMap,
} from "react-leaflet";
import type { FeatureCollection, Geometry } from "geojson";

import type { WorldState } from "../game/worldState";
import {
  getMunicipalityFogOpacity,
  getMunicipalityWorldState,
} from "../game/worldStateSelectors";

import type { VisitedLocationMapItem } from "../model/progression.types";
import { buildProgressionZones } from "../game/progressionZones";
import municipalitiesGeoJson from "../game/geojson/denmark-municipalities.json";
import type { SelectedProgressionZoneKey } from "../model/progressionView.types";

type Props = {
  locations: VisitedLocationMapItem[];
  worldState: WorldState;
  selectedZoneKey: SelectedProgressionZoneKey;
  selectedMunicipalityName: string | null;
  onSelectZone: (key: SelectedProgressionZoneKey) => void;
  onSelectMunicipality: (municipalityName: string) => void;
};

function ProgressionMapController({
  selectedZoneKey,
}: {
  selectedZoneKey: SelectedProgressionZoneKey;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedZoneKey === "dk") {
      map.flyTo([56.2639, 9.5018], 7, { duration: 0.8 });
      return;
    }

    if (selectedZoneKey === "germany") {
      map.flyTo([51.1657, 10.4515], 6, { duration: 0.8 });
      return;
    }

    if (selectedZoneKey === "prague") {
      map.flyTo([50.0755, 14.4378], 10, { duration: 0.8 });
      return;
    }

    map.flyTo([55.6761, 12.5683], 5, { duration: 0.8 });
  }, [map, selectedZoneKey]);

  return null;
}

export default function ProgressionMap({
  locations,
  worldState,
  selectedZoneKey,
  selectedMunicipalityName,
  onSelectZone,
  onSelectMunicipality,
}: Props) {
  const points = locations.filter(
    (x) => x.hasCoordinates && x.latitude != null && x.longitude != null
  );

  const zones = buildProgressionZones(locations);

  const visibleZones = selectedZoneKey
    ? zones.filter((zone) => zone.key === selectedZoneKey)
    : zones;


  function isMunicipalitySelected(municipalityName: string) {
    return (
      selectedMunicipalityName?.toLowerCase() === municipalityName.toLowerCase()
    );
  }

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

          <ProgressionMapController selectedZoneKey={selectedZoneKey} />

          {selectedZoneKey === "dk" && (
            <GeoJSON
              key={`municipalities-${selectedMunicipalityName ?? "none"}`}
              data={municipalitiesGeoJson as FeatureCollection<Geometry>}
              style={(feature: any) => {
                const municipalityName = feature?.properties?.label_dk ?? "";

                const selected =
                  isMunicipalitySelected(municipalityName);

                const municipalityWorldState =
                  getMunicipalityWorldState(
                    worldState,
                    municipalityName
                  );

                const fogOpacity =
                  getMunicipalityFogOpacity(
                    worldState,
                    municipalityName
                  );

                const unlocked =
                  municipalityWorldState?.unlocked ?? false;

                const mastered =
                  municipalityWorldState?.mastered ?? false;

                return {
                  color: selected
                    ? "#facc15"
                    : mastered
                    ? "#22c55e"
                    : unlocked
                    ? "#16a34a"
                    : "#475569",

                  fillColor: selected
                    ? "#facc15"
                    : mastered
                    ? "#22c55e"
                    : unlocked
                    ? "#16a34a"
                    : "#0f172a",

                  fillOpacity: selected ? 0.6 : 1 - fogOpacity,

                  weight: selected ? 3 : mastered ? 3 : unlocked ? 2 : 1,
                };
              }}
              onEachFeature={(feature: any, layer) => {
                const municipalityName = feature?.properties?.label_dk ?? "";

                const municipalityWorldState =
                  getMunicipalityWorldState(
                    worldState,
                    municipalityName
                  );

                layer.bindTooltip(
                  `${municipalityName} · ${
                    municipalityWorldState?.state ?? "unknown"
                  }`,
                  { sticky: true }
                );

                layer.on({
                  click: () => onSelectMunicipality(municipalityName),
                });
              }}
            />
          )}

          {visibleZones.map((zone) => {
            if (zone.geoJson) {
              return (
                <GeoJSON
                  key={`zone-geojson-${zone.key}`}
                  data={zone.geoJson}
                  eventHandlers={{
                    click: () => onSelectZone(zone.key),
                  }}
                  style={{
                    color: zone.status === "unlocked" ? "#16a34a" : "#64748b",
                    fillColor:
                      zone.status === "unlocked" ? "#22c55e" : "#94a3b8",
                    fillOpacity: zone.status === "unlocked" ? 0.18 : 0.08,
                    weight: 2,
                  }}
                />
              );
            }

            if (!zone.polygon) return null;

            return (
              <Polygon
                key={`zone-polygon-${zone.key}`}
                positions={zone.polygon}
                eventHandlers={{
                  click: () => onSelectZone(zone.key),
                }}
                pathOptions={{
                  color: zone.status === "unlocked" ? "#16a34a" : "#64748b",
                  fillColor:
                    zone.status === "unlocked" ? "#22c55e" : "#94a3b8",
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

          {visibleZones.map((zone) => (
            <Marker
              key={`zone-${zone.key}`}
              position={[zone.latitude, zone.longitude]}
            >
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