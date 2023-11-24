import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Test } from './testStore';

export type PreviouslyCheckedItem = {
  id: string;
  value: string;
  timestamp: number;
  tests?: Test[];
};

type PreviouslyCheckedStore = {
  previouslyCheckedList: PreviouslyCheckedItem[];
  addPreviouslyChecked: (previouslyChecked: string, tests?: Test[]) => void;
  updatePreviouslyChecked: (id: string, tests?: Test[]) => void;
  removePreviouslyChecked: (previouslyChecked: string) => void;
  clearPreviouslyChecked: () => void;
};

export const usePreviouslyCheckedStore = create<PreviouslyCheckedStore>()(
  persist(
    (set, state) => ({
      previouslyCheckedList: [],
      addPreviouslyChecked: (previouslyChecked, tests) => {
        if (state().previouslyCheckedList.find((item) => item.value === previouslyChecked)) {
          return;
        }

        const now = Date.now();
        set((state) => ({
          previouslyCheckedList: [
            {
              id: `${now}-${previouslyChecked}`,
              value: previouslyChecked,
              timestamp: now,
              tests,
            },
            ...state.previouslyCheckedList,
          ],
        }));
      },
      updatePreviouslyChecked: (id, tests) => {
        set((state) => ({
          previouslyCheckedList: state.previouslyCheckedList.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                timestamp: Date.now(),
                tests,
              };
            }

            return item;
          }),
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
