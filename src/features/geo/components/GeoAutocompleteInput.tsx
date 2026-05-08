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
    placeholder
}: Props) {
    const [results, setResults] = useState<GeoPlace[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        if (value.trim().length < 2) {
            setResults([]);
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
            }
            catch (err) {
                console.error(err);
            }
            finally {
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
        <div style={{ position: "relative" }}>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                autoComplete="off"
            />

            {loading && (
                <div className="geo-loading">
                    Søger...
                </div>
            )}

            {open && results.length > 0 && (
                <div
                    className="geo-dropdown"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ccc",
                        zIndex: 1000,
                        maxHeight: "300px",
                        overflowY: "auto"
                    }}
                >
                    {results.map((place) => (
                        <button
                            key={place.geoNameId}
                            type="button"
                            onClick={() => {
                                onSelect(place);
                                onChange(place.name);
                                setOpen(false);
                            }}
                            style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "10px",
                                border: "none",
                                background: "white",
                                cursor: "pointer"
                            }}
                        >
                            <strong>{place.name}</strong>
                            {" "}
                            ({place.countryCode})

                            {place.admin1Code && (
                                <>
                                    {" "}
                                    - {place.admin1Code}
                                </>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}