'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { dnsServers } from '@/constants/dnsServers';
import { RecordTypes, type RecordType } from '@/constants/recordType';
import { usePreviouslyCheckedStore } from '@/stores/previouslyCheckedStore';
import { TestResult, useTestStore } from '@/stores/testStore';
import { motion } from 'framer-motion';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useQueryString } from '@/hooks/queryString';
import { useObserveHeight } from '@/hooks/useObserveHeight';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ResultItem } from '@/components/result-item';
import { SearchForm } from '@/components/search-form';

const PreviousDomainsList = dynamic(() => import('@/components/previous-domains-list'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { searchParams, createQueryString } = useQueryString();
  const { tests, runTests } = useTestStore();
  const { previouslyCheckedList, addPreviouslyChecked, updatePreviouslyChecked } = usePreviouslyCheckedStore();

  const [loading, setLoading] = useState(false);

  const [refreshIntervalTime, setRefreshIntervalTime] = useState<number>();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState<number>(0);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

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

  const checkDomain = async (domain: string, recordType: RecordType, runBecauseUrlChange = false) => {
    setLoading(true);

    // Remove protocol from domain
    domain = domain.replace(/(^\w+:|^)\/\//, '');

    // Check if domain contains slashes and if so, remove everything after the first slash
    if (domain.includes('/')) {
      domain = domain.split('/')[0];
    }

    const res = await fetch(`/api/check/${domain}/${recordType || 'A'}`);
    if (res.status === 429) {
      const { limit, reset } = await res.json();
      toast.error(
        `You have reached the limit of ${limit} requests in 60 seconds. Please try again in ${Math.round(
          (reset - Date.now()) / 1000
        )} seconds.`
      );
      setResolvedAddresses({});
      setLoading(false);
      return;
    }
    const { addresses } = await res.json();

    const previouslyCheckedItem = previouslyCheckedList.find((item) => item.value === domain);
    if (previouslyCheckedItem && !runBecauseUrlChange) {
      updatePreviouslyChecked(previouslyCheckedItem.id, {
        ...previouslyCheckedItem,
        timestamp: Date.now(),
        value: domain,
        tests,
      });
    } else {
      addPreviouslyChecked(domain, tests);
    }

    setResolvedAddresses(addresses);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    let _interval: NodeJS.Timeout;
    let _uiInterval: NodeJS.Timeout;
    if (refreshIntervalTime) {
      _interval = setInterval(() => {
        checkDomain(url, RecordTypes[0], true);
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
  }, [refreshIntervalTime, lastRefresh, url]);

  useEffect(() => {
    if (url.length > 0) {
      checkDomain(url, RecordTypes[0], true);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <Header>
        {refreshIntervalTime && (
          <div>
            <p className="flex items-center text-gray-500 lg:mt-2">
              Refreshing in{' '}
              <span className="leading-0 mx-1.5 w-[37px] rounded-sm bg-gray-100 px-2 py-1 text-right font-mono tabular-nums">
                {secondsUntilNextRefresh}
              </span>{' '}
              second(s)
            </p>
          </div>
        )}
      </Header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start gap-4 px-4 pb-14 lg:mt-10 lg:flex-row">
        <div className="w-full space-y-6 md:sticky lg:top-10 lg:max-w-md">
          <SearchForm
            advancedOptionsOpen={advancedOptionsOpen}
            setAdvancedOptionsOpen={setAdvancedOptionsOpen}
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
        <div className="w-full flex-1">
          <h2 className=" block font-heading text-3xl lg:hidden">Results</h2>
          <div className={cn('space-y-2 lg:pb-0', advancedOptionsOpen ? 'pb-[400px]' : 'pb-24')}>
            {dnsServers.map((dnsServer) => {
              const result = resolvedAddresses[dnsServer.name];

              let testResults: TestResult[] = [];
              if (result && result.value !== '') {
                testResults = runTests(result.value);
              }

              return (
                <ResultItem key={dnsServer.ip} dnsServer={dnsServer} testResults={testResults}>
                  {loading ? (
                    <div className="duration-[2000ms] animate-spin">
                      <LoaderIcon />
                    </div>
                  ) : result && result.value !== '' ? (
                    <div className="flex flex-col items-end">
                      <span className="font-mono tabular-nums tracking-tight text-green-500">{result.value}</span>
                      <span className="text-xs text-gray-400">{result.time}ms</span>
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
