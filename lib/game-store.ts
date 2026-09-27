"use client";

import { create } from "zustand";
import type { Province } from "@/lib/types";

interface GameState {
  selectedProvinceId: string | null;
  gameMinutes: number;
  selectProvince: (id: string | null) => void;
  advanceTime: (minutes: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  selectedProvinceId: null,
  gameMinutes: 0,
  selectProvince: (id) => set({ selectedProvinceId: id }),
  advanceTime: (minutes) => set((state) => ({ gameMinutes: state.gameMinutes + minutes })),
}));