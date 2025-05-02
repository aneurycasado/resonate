// src/store/appStore.ts
import { create } from "zustand";
import { database } from "../database";

interface AppState {
  isDarkMode: boolean;
  isProcessingEntry: boolean;
  processingEntryId: string | null;
  setDarkMode: (isDark: boolean) => void;
  setProcessingEntry: (id: string | null) => void;
  resetDatabase: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: true,
  isProcessingEntry: false,
  processingEntryId: null,

  setDarkMode: (isDark: boolean) => set({ isDarkMode: isDark }),

  setProcessingEntry: (id: string | null) =>
    set({
      isProcessingEntry: !!id,
      processingEntryId: id,
    }),

  resetDatabase: async () => {
    await database.action(async () => {
      await database.unsafeResetDatabase();
    });
  },
}));
