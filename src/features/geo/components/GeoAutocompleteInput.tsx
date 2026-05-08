import { useEffect, useRef, useState } from "react";
import { searchGeoPlaces } from "../api/geoApi";
import type { GeoPlace } from "../types/geo";

type Props = {
    value: string;
    onChange: (value: string) => void;
    onSelect: (place: GeoPlace) => void;
    placeholder?: string;
};

export default function GeoAutocompleteInput({
    value,
    onChange,
    onSelect,
    placeholder,
}: Props) {
    const [results, setResults] = useState<GeoPlace[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedGeoNameId, setSelectedGeoNameId] = useState<number | null>(null);

    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        if (value.trim().length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        if (selectedGeoNameId) {
            return;
        }

        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(async () => {
            try {
                setLoading(true);

                const data = await searchGeoPlaces(value);

                setResults(data);
                setOpen(true);
            } catch (err) {
                console.error(err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
            }
        };
    }, [value]);

    return (
        <div className="geoAutocomplete">
            <input
                className="input"
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    setSelectedGeoNameId(null);
                    onChange(e.target.value);
                }}
                autoComplete="off"
            />

            {loading && <div className="geoLoading">Søger...</div>}

            {open && results.length > 0 && (
                <div className="geoDropdown">
                    {results.map((place) => (
                        <button
                            key={place.geoNameId}
                            type="button"
                            className="geoOption"
                            onClick={() => {
                                setSelectedGeoNameId(place.geoNameId);
                                onSelect(place);
                                setOpen(false);
                            }}
                        >
                            <strong>{place.name}</strong>

                            <span className="geoOptionMeta">
                                {place.countryCode}
                                {place.admin1Code ? ` · ${place.admin1Code}` : ""}
                                {place.population > 0
                                    ? ` · ${place.population.toLocaleString("da-DK")} indb.`
                                    : ""}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}