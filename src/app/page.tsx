'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dnsServers } from '@/constants/dnsServers';
import { RecordTypes, type RecordType } from '@/constants/recordType';
import { usePreviouslyCheckedStore } from '@/stores/previouslyCheckedStore';
import { LoaderIcon } from 'lucide-react';

import { useQueryString } from '@/hooks/queryString';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { PreviousDomainsList } from '@/components/previous-domains-list';
import { ResultItem } from '@/components/result-item';
import { SearchForm } from '@/components/search-form';

export default function Home() {
  const router = useRouter();
  const { searchParams, createQueryString } = useQueryString();
  const { addPreviouslyChecked } = usePreviouslyCheckedStore();

  const [loading, setLoading] = useState(false);

  const [refreshIntervalTime, setRefreshIntervalTime] = useState<number>();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState<number>(0);

  const [resolvedAddresses, setResolvedAddresses] = useState<
    Record<
      string,
      {
        value: string;
        time: number;
      }
    >
  >({});

  const url = searchParams.get('url') || '';

  const checkDomain = async (domain: string, recordType: RecordType) => {
    setLoading(true);
    const res = await fetch(`/api/check/${domain}/${recordType || 'A'}`);
    const { addresses } = await res.json();

    addPreviouslyChecked(domain);

    setResolvedAddresses(addresses);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    let _interval: NodeJS.Timeout;
    let _uiInterval: NodeJS.Timeout;
    if (refreshIntervalTime) {
      _interval = setInterval(() => {
        checkDomain(url, RecordTypes[0]);
      }, refreshIntervalTime * 1000);

      // Update UI counter every second
      _uiInterval = setInterval(() => {
        if (refreshIntervalTime === 0) {
          setSecondsUntilNextRefresh(0);
          return;
        }

        const calculatedSecondsUntilNextRefresh = Math.round(
          (refreshIntervalTime * 1000 - (new Date().getTime() - lastRefresh.getTime())) / 1000
        );
        // Fix off by one error
        if (secondsUntilNextRefresh === 0) {
          setLastRefresh(new Date());
          setSecondsUntilNextRefresh(refreshIntervalTime);
          return;
        }
        setSecondsUntilNextRefresh(calculatedSecondsUntilNextRefresh);
      }, 1000);
    }

    return () => {
      if (_interval) clearInterval(_interval);
      if (_uiInterval) clearInterval(_uiInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshIntervalTime, lastRefresh, url]);

  useEffect(() => {
    if (url.length > 0) {
      checkDomain(url, RecordTypes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Header>
        {refreshIntervalTime && (
          <div>
            <p className="flex items-center mt-2 text-gray-500">
              Refreshing in{' '}
              <span className="mx-1.5 px-2 py-1 bg-gray-100 tabular-nums rounded-sm leading-0 w-[37px] text-right font-mono">
                {secondsUntilNextRefresh}
              </span>{' '}
              second(s)
            </p>
          </div>
        )}
      </Header>
      <div className="mx-auto flex flex-col items-start w-full max-w-6xl gap-4 mt-10 flex-1 pb-14 px-4 lg:px-0 lg:flex-row">
        <div className="w-full space-y-6 lg:max-w-md mb-8 lg:mb-0">
          <SearchForm
            onSubmit={(data) => {
              if (data.refresh && data.refresh !== '0') {
                setRefreshIntervalTime(parseInt(data.refresh, 10));
              } else {
                setRefreshIntervalTime(undefined);
              }
              router.push(`/?${createQueryString('url', data.url)}`);
              checkDomain(data.url, data.recordType);
            }}
          />
          <PreviousDomainsList />
        </div>
        <div className="flex-1 w-full">
          <h2 className="block lg:hidden font-heading text-3xl mb-4">Results</h2>
          <div className="space-y-2">
            {dnsServers.map((dnsServer) => {
              const result = resolvedAddresses[dnsServer.name];

              return (
                <ResultItem key={dnsServer.ip} dnsServer={dnsServer}>
                  {loading ? (
                    <div className="animate-spin duration-[2000ms]">
                      <LoaderIcon />
                    </div>
                  ) : result && result.value !== '' ? (
                    <div className="flex flex-col items-end">
                      <span className="text-green-500 font-mono tracking-tight tabular-nums">{result.value}</span>
                      <span className="text-gray-400 text-xs">{result.time}ms</span>
                    </div>
                  ) : url.length > 0 ? (
                    <span className="text-red-500">Not found</span>
                  ) : (
                    <></>
                  )}
                </ResultItem>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
