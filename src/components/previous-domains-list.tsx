'use client';

import { useRouter } from 'next/navigation';
import { usePreviouslyCheckedStore } from '@/stores/previouslyCheckedStore';

import { useQueryString } from '@/hooks/queryString';

// Default export because it's used as dynamic import without ssr
export default function PreviousDomainsList() {
  const router = useRouter();
  const { createQueryString } = useQueryString();
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
          {previouslyCheckedList.map((url) => (
            <li key={url}>
              <button
                onClick={() => {
                  router.push(`/?${createQueryString('url', url)}`);
                }}
                className="text-sm text-gray-500 underline underline-offset-2 hover:underline-offset-4"
              >
                {url}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-gray-500">You haven&apos;t checked any domains yet.</p>
      )}
    </div>
  );
}
