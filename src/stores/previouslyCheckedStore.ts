import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PreviouslyCheckedItem = {
  value: string;
  timestamp: number;
};

type PreviouslyCheckedStore = {
  previouslyCheckedList: PreviouslyCheckedItem[];
  addPreviouslyChecked: (previouslyChecked: string) => void;
  removePreviouslyChecked: (previouslyChecked: string) => void;
  clearPreviouslyChecked: () => void;
};

export const usePreviouslyCheckedStore = create<PreviouslyCheckedStore>()(
  persist(
    (set, state) => ({
      previouslyCheckedList: [],
      addPreviouslyChecked: (previouslyChecked) => {
        if (state().previouslyCheckedList.find((item) => item.value === previouslyChecked)) {
          return;
        }

        const now = Date.now();
        set((state) => ({
          previouslyCheckedList: [
            ...state.previouslyCheckedList,
            {
              value: previouslyChecked,
              timestamp: now,
            },
          ],
        }));
      },
      removePreviouslyChecked: (previouslyChecked) => {
        set((state) => ({
          previouslyCheckedList: state.previouslyCheckedList.filter((item) => item.value !== previouslyChecked),
        }));
      },
      clearPreviouslyChecked: () => {
        set((state) => ({
          previouslyCheckedList: [],
        }));
      },
    }),
    {
      name: 'previously-checked',
    }
  )
);
