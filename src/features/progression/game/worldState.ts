export type MunicipalityWorldState = {
  municipalityName: string;
  unlocked: boolean;
  mastered: boolean;
  fogOpacity: number;
  visitCount: number;
};

export type WorldState = {
  municipalities: MunicipalityWorldState[];
};
