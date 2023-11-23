'use client';

import { useState } from 'react';
import { dnsServers } from '@/constants/dnsServers';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import { LoaderIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [url, setUrl] = useState('');
  const [previouslyChecked, setPreviouslyChecked] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const prevChecked = JSON.parse(localStorage.getItem('prevChecked') || '[]');
    return prevChecked;
  });
  const [loading, setLoading] = useState(false);
  const [resolvedAddresses, setResolvedAddresses] = useState<
    Record<string, string>
  >({});

  const checkDomain = async () => {
    if (!url) return;

    setLoading(true);
    const res = await fetch(`/api/check/${url}`);
    const { addresses } = await res.json();

    // Add domain to previously checked localStorage
    const prevChecked = JSON.parse(localStorage.getItem('prevChecked') || '[]');
    if (!prevChecked.includes(url)) {
      prevChecked.unshift(url);
      if (typeof window !== 'undefined') return;
      localStorage.setItem('prevChecked', JSON.stringify(prevChecked));
    }
    setPreviouslyChecked(prevChecked);

    setResolvedAddresses(addresses);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-14">
          <h1 className="font-heading text-3xl">Domain Checker</h1>
          <p className="mt-2 text-gray-500">
            Check if your domain is pointing to the right IP address.
          </p>
        </div>
      </div>
      <div className="mx-auto flex items-start w-full max-w-6xl gap-4 mt-10 flex-1 pb-14">
        <div className="max-w-md w-full space-y-6">
          <form
            className="rounded-md border border-gray-200 bg-white px-6 py-8"
            onSubmit={(e) => {
              e.preventDefault();
              checkDomain();
              return false;
            }}
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                Your domain
              </label>
            </div>
            <div className="relative mt-1 flex rounded-md shadow-sm">
              <Input
                type="text"
                name="url"
                id="url"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-4">
              Check my domain
            </Button>
          </form>

          {/* Previous URLs */}
          <div className="rounded-md border border-gray-200 bg-white px-6 py-8">
            <h2 className="text-md font-medium text-gray-700">
              Previously checked
            </h2>
            {previouslyChecked.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {previouslyChecked.map((url) => (
                  <li key={url}>
                    <button
                      onClick={() => setUrl(url)}
                      className="underline underline-offset-2 hover:underline-offset-4 text-sm text-gray-500"
                    >
                      {url}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-500 text-sm">
                You haven&apos;t checked any domains yet.
              </p>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            {dnsServers.map((dnsServer) => (
              <div
                key={dnsServer.name}
                className="rounded-md border border-gray-200 bg-white px-6 py-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-md font-medium text-gray-700">
                      {dnsServer.name}
                    </h2>
                    <p className="text-gray-500 text-xs">
                      {dnsServer.city}, {dnsServer.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <div className="animate-spin duration-[2000ms]">
                        <LoaderIcon />
                      </div>
                    ) : resolvedAddresses[dnsServer.name] ? (
                      <span className="text-green-500">
                        {resolvedAddresses[dnsServer.name]}
                      </span>
                    ) : url.length > 0 ? (
                      <span className="text-red-500">Not found</span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto py-4">
          <p className="mt-2 text-gray-500 text-xs flex items-center gap-1">
            Made by{' '}
            <a
              href="https://twitter.com/_cqeal"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lambert Weller
            </a>{' '}
            with <HeartFilledIcon className="inline-block w-3 h-3" /> in{' '}
            <a
              href="https://nextjs.org/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
