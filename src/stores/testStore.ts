import { create } from 'zustand';

export type TestType = 'equals' | 'contains' | 'regex' | 'startsWith' | 'endsWith';

export type Test = {
  id: string;
  type: TestType;
  value: string;
  name: string;
  negated?: boolean;
};

export type TestResult = Test & {
  result: boolean;
};

type TestStore = {
  tests: Test[];
  addTest: (test: Test) => void;
  removeTest: (id: string) => void;
  updateTest: (test: Partial<Test>) => void;
  clearTests: () => void;
  runTests: (value: string) => (Test & {
    result: boolean;
  })[];
};

export const useTestStore = create<TestStore>((set, state) => ({
  tests: [],
  addTest: (test) => {
    set((state) => ({
      tests: [...state.tests, test],
    }));
  },
  removeTest: (id) => {
    set((state) => ({
      tests: state.tests.filter((item) => item.id !== id),
    }));
  },
  updateTest: (test) => {
    set((state) => ({
      tests: state.tests.map((item) => {
        if (item.id === test.id) {
          return {
            ...item,
            ...test,
          };
        }
        return item;
      }),
    }));
  },
  clearTests: () => {
    set((state) => ({
      tests: [],
    }));
  },
  runTests: (value) => {
    return state().tests.map((test) => {
      switch (test.type) {
        case 'equals':
          return {
            ...test,
            result: test.negated ? value !== test.value : value === test.value,
          };
        case 'contains':
          return {
            ...test,
            result: test.negated ? !value.includes(test.value) : value.includes(test.value),
          };
        case 'regex':
          const regex = new RegExp(test.value);
          return {
            ...test,
            result: test.negated ? !regex.test(value) : regex.test(value),
          };
        case 'startsWith':
          return {
            ...test,
            result: test.negated ? !value.startsWith(test.value) : value.startsWith(test.value),
          };
        case 'endsWith':
          return {
            ...test,
            result: test.negated ? !value.endsWith(test.value) : value.endsWith(test.value),
          };
      }
    });
  },
}));
