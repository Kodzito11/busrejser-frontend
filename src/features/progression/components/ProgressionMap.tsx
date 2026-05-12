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

import type { MapMunicipality } from "../map/mapMunicipalityAdapter";
import { findMapMunicipality } from "../map/mapMunicipalityAdapter";

import type { VisitedLocationMapItem } from "../model/progression.types";
import type { SelectedProgressionZoneKey } from "../model/progressionView.types";
import type { MapTerritory } from "../map/mapTerritoryAdapter";

import municipalitiesGeoJson from "../game/geojson/denmark-municipalities.json";
import { defaultMapCamera, getMapCameraForTerritory } from "../map/mapCamera";

type Props = {
  locations: VisitedLocationMapItem[];
  territories: MapTerritory[];
  municipalities: MapMunicipality[];
  selectedZoneKey: SelectedProgressionZoneKey;
  selectedMunicipalityName: string | null;
  onSelectZone: (key: SelectedProgressionZoneKey) => void;
  onSelectMunicipality: (municipalityName: string) => void;
};

function getTerritoryMapStyle(status: string) {
  if (status === "mastered") {
    return {
      color: "#ca8a04",
      fillColor: "#facc15",
      fillOpacity: 0.22,
      weight: 2,
    };
  }

  if (status === "unlocked") {
    return {
      color: "#16a34a",
      fillColor: "#22c55e",
      fillOpacity: 0.18,
      weight: 2,
    };
  }

  return {
    color: "#64748b",
    fillColor: "#94a3b8",
    fillOpacity: 0.08,
    weight: 2,
  };
}

function getTerritoryStatusIcon(status: string) {
  if (status === "mastered") return "🏆";
  if (status === "unlocked") return "🟢";

  return "🔒";
}

function getMunicipalityMapVisuals(
  municipality: MapMunicipality | null,
  selected: boolean
) {
  if (selected) {
    return {
      borderColor: "#facc15",
      fillColor: "#facc15",
      fillOpacity: 0.35,
      weight: 3,
      dashArray: undefined,
    };
  }

  if (municipality?.status === "mastered") {
    return {
      borderColor: "#ca8a04",
      fillColor: "#facc15",
      fillOpacity: 0.24,
      weight: 2,
      dashArray: undefined,
    };
  }

  if (municipality?.status === "unlocked") {
    return {
      borderColor: "#16a34a",
      fillColor: "#22c55e",
      fillOpacity: 0.2,
      weight: 2,
      dashArray: undefined,
    };
  }

  return {
    borderColor: "#1f2937",
    fillColor: "#020617",
    fillOpacity: 0.38,
    weight: 1,
    dashArray: "4",
  };
}

function getMunicipalityTooltipText(
  municipalityName: string,
  municipality: MapMunicipality | null
) {
  if (!municipality) {
    return `${municipalityName} · locked`;
  }

  return `${municipality.name} · ${municipality.status} · ${municipality.completionPercent}%`;
}

function ProgressionMapController({
  selectedZoneKey,
}: {
  selectedZoneKey: SelectedProgressionZoneKey;
}) {
  const map = useMap();

  useEffect(() => {
    const camera = getMapCameraForTerritory(selectedZoneKey);

    map.flyTo(camera.center, camera.zoom, { duration: 0.8 });
  }, [map, selectedZoneKey]);

  return null;
}

export default function ProgressionMap({
  locations,
  territories,
  municipalities,
  selectedZoneKey,
  selectedMunicipalityName,
  onSelectZone,
  onSelectMunicipality,
}: Props) {
  const points = locations.filter(
    (x) => x.hasCoordinates && x.latitude != null && x.longitude != null
  );

  const visibleTerritories = selectedZoneKey
    ? territories.filter((territory) => territory.key === selectedZoneKey)
    : territories;

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
          center={defaultMapCamera.center}
          zoom={defaultMapCamera.zoom}
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
                const selected = isMunicipalitySelected(municipalityName);

                const municipality = findMapMunicipality(
                  municipalities,
                  municipalityName
                );

                const visuals = getMunicipalityMapVisuals(
                  municipality,
                  selected
                );

                return {
                  color: visuals.borderColor,
                  fillColor: visuals.fillColor,
                  fillOpacity: visuals.fillOpacity,
                  weight: visuals.weight,
                  dashArray: visuals.dashArray,
                  className: "progression-map__municipality",
                };
              }}
              onEachFeature={(feature: any, layer) => {
                const municipalityName = feature?.properties?.label_dk ?? "";

                const municipality = findMapMunicipality(
                  municipalities,
                  municipalityName
                );

                layer.bindTooltip(
                  getMunicipalityTooltipText(municipalityName, municipality),
                  { sticky: true }
                );

                layer.on({
                  click: () => onSelectMunicipality(municipalityName),
                });
              }}
            />
          )}

          {visibleTerritories.map((territory) => {
            if (territory.geoJson) {
              return (
                <GeoJSON
                  key={`territory-geojson-${territory.key}`}
                  data={territory.geoJson}
                  eventHandlers={{
                    click: () => onSelectZone(territory.key),
                  }}
                  style={getTerritoryMapStyle(territory.status)}
                />
              );
            }

            if (!territory.polygon) return null;

            return (
              <Polygon
                key={`territory-polygon-${territory.key}`}
                positions={territory.polygon}
                eventHandlers={{
                  click: () => onSelectZone(territory.key),
                }}
                pathOptions={getTerritoryMapStyle(territory.status)}
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

          {visibleTerritories.map((territory) => (
            <Marker
              key={`territory-${territory.key}`}
              position={[territory.latitude, territory.longitude]}
            >
              <Popup>
                <strong>
                  {getTerritoryStatusIcon(territory.status)} {territory.name}
                </strong>
                <br />
                {territory.description}
                <br />
                <br />
                {territory.status === "locked" ? (
                  <>Ikke besøgt endnu</>
                ) : (
                  <>
                    {territory.status === "mastered"
                      ? "Territory mastered"
                      : "Zone unlocked"}
                    <br />
                    Besøgt {territory.visitCount} gange
                    <br />
                    Completion {territory.completionPercent}%

                  </>
                )}
                {!territory.hasMapMetadata && (
                  <>
                    <br />
                    <br />
                    <strong>Map shape mangler</strong>
                    <br />
                    <span>
                      Key "{territory.key}" findes i backend, men ikke i frontend map metadata.
                    </span>
                  </>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}