import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PreviouslyCheckedStore = {
  previouslyCheckedList: string[];
  addPreviouslyChecked: (previouslyChecked: string) => void;
  removePreviouslyChecked: (previouslyChecked: string) => void;
  clearPreviouslyChecked: () => void;
};

export const usePreviouslyCheckedStore = create<PreviouslyCheckedStore>()(
  persist(
    (set, state) => ({
      previouslyCheckedList: [],
      addPreviouslyChecked: (previouslyChecked: string) => {
        if (state().previouslyCheckedList.includes(previouslyChecked)) {
          return;
        }
        set((state) => ({
          previouslyCheckedList: [previouslyChecked, ...state.previouslyCheckedList],
        }));
      },
      removePreviouslyChecked: (previouslyChecked: string) => {
        set((state) => ({
          previouslyCheckedList: state.previouslyCheckedList.filter((item) => item !== previouslyChecked),
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
