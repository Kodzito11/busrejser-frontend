import type { MunicipalityWorldState } from "./worldState";

export type TerritoryVisuals = {
    borderColor: string;
    fillColor: string;
    fillOpacity: number;
    weight: number;
    dashArray?: string;
};

export function getTerritoryVisuals(options: {
    state: MunicipalityWorldState | null;
    selected: boolean;
}): TerritoryVisuals {
    const { state, selected } = options;

    if (selected) {
        return {
            borderColor: "#facc15",
            fillColor: "#fde047",
            fillOpacity: 0.78,
            weight: 4,
        };
    }

    if (!state) {
        return {
            borderColor: "#020617",
            fillColor: "#020617",
            fillOpacity: 0.96,
            weight: 1,
            dashArray: "3",
        };
    }

    if (state.mastered) {
        return {
            borderColor: "#22c55e",
            fillColor: "#4ade80",
            fillOpacity: 0.7,
            weight: 3,
        };
    }

    if (state.unlocked) {
        return {
            borderColor: "#16a34a",
            fillColor: "#22c55e",
            fillOpacity: 0.34,
            weight: 2,
        };
    }

    return {
        borderColor: "#334155",
        fillColor: "#0f172a",
        fillOpacity: 0.45,
        weight: 1,
        dashArray: "4",
    };
}