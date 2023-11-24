'use client';

import { useRouter } from 'next/navigation';
import { usePreviouslyCheckedStore } from '@/stores/previouslyCheckedStore';
import { useTestStore } from '@/stores/testStore';

import { getRelativeTimeString } from '@/lib/relativeTimeString';
import { useQueryString } from '@/hooks/queryString';

// Default export because it's used as dynamic import without ssr
export default function PreviousDomainsList() {
  const router = useRouter();
  const { createQueryString } = useQueryString();
  const { addTest, clearTests } = useTestStore();
  const { previouslyCheckedList, clearPreviouslyChecked } = usePreviouslyCheckedStore();

  return (
    <div className="rounded-md border border-gray-200 bg-white px-6 py-8">
      <div className="flex justify-between">
        <h2 className="text-base font-medium text-gray-700">Previously checked</h2>
        <button onClick={() => clearPreviouslyChecked()} className="text-xs text-gray-500">
          Clear
        </button>
      </div>
      {previouslyCheckedList.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {previouslyCheckedList.map((previouslyCheckedItem) => (
            <li key={previouslyCheckedItem.value} className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (previouslyCheckedItem.tests && previouslyCheckedItem.tests.length > 0) {
                    clearTests();
                    previouslyCheckedItem.tests.forEach((test) => addTest(test));
                  }
                  router.push(`/?${createQueryString('url', previouslyCheckedItem.value)}`);
                }}
                className="text-sm text-gray-500 underline underline-offset-2 hover:underline-offset-4"
              >
                {previouslyCheckedItem.value}
              </button>
              {previouslyCheckedItem.timestamp && (
                <div>
                  <time
                    className="text-xs text-gray-400"
                    dateTime={new Date(previouslyCheckedItem.timestamp).toISOString()}
                  >
                    {getRelativeTimeString(previouslyCheckedItem.timestamp)}
                  </time>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-gray-500">You haven&apos;t checked any domains yet.</p>
      )}
    </div>
  );
}
