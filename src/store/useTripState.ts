import { create } from "zustand";
import { CurrentTripInfoState } from "../types";

export const useTripState = create<CurrentTripInfoState>((set) => ({
  places: [],
  setPlaces: (fetchedPlaces) => set({ places: fetchedPlaces }),

  selectedLocations: [],
  addLocation: (newLocation) =>
    set((state) => ({
      selectedLocations: [...state.selectedLocations, newLocation],
    })),

  removeLocation: (removableId) =>
    set((state) => ({
      selectedLocations: state.selectedLocations.filter(
        (item) => item.id !== removableId,
      ),
    })),
}));
