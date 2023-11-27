'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { dnsServers } from '@/constants/dnsServers';
import { RecordTypes, type RecordType } from '@/constants/recordType';
import { useDNSStore } from '@/stores/dnsStore';
import { usePreviouslyCheckedStore } from '@/stores/previouslyCheckedStore';
import { TestResult, useTestStore } from '@/stores/testStore';
import { LoaderIcon, PlusCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

import { findLastIndex } from '@/lib/findLastIndex';
import { useQueryString } from '@/hooks/queryString';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { dnsSchemaArray, useAddEditDnsModal } from '@/components/modals/add-edit-dns-modal';
import { ResultItem } from '@/components/result-item';
import { SearchForm } from '@/components/search-form';

const PreviousDomainsList = dynamic(() => import('@/components/previous-domains-list'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { searchParams, createQueryString } = useQueryString();
  const { tests, runTests } = useTestStore();
  const { previouslyCheckedList, addPreviouslyChecked, updatePreviouslyChecked } = usePreviouslyCheckedStore();

  const { dns: dnsList, addDNS, saveDnsServersToLocalStorage, loadDnsServersFromLocalStorage } = useDNSStore();
  const { AddEditDnsModalComponent, setShowAddEditDnsModal } = useAddEditDnsModal({
    onSubmit: (data) => {
      addDNS(data);
      setShowAddEditDnsModal(false);
      saveDnsServersToLocalStorage();
    },
  });

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

  const checkDomain = async (domain: string, recordType: RecordType, runBecauseUrlChange = false) => {
    setLoading(true);

    // Remove protocol from domain
    domain = domain.replace(/(^\w+:|^)\/\//, '');

    // Check if domain contains slashes and if so, remove everything after the first slash
    if (domain.includes('/')) {
      domain = domain.split('/')[0];
    }

    const res = await fetch(`/api/check/${domain}/${recordType || 'A'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dnsServers: dnsList.map((dns) => ({
          id: dns.id,
          name: dns.name,
          ip: dns.ip,
        })),
      }),
    });
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
    try {
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
    } catch (e) {
      toast.error(`Something went wrong. Please try again later.`);
      setResolvedAddresses({});
      setLoading(false);
    }
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
    loadDnsServersFromLocalStorage();

    if (url.length > 0) {
      checkDomain(url, RecordTypes[0], true);
    }
  }, []);

  const lastCustomDNSIndex = findLastIndex(dnsList, (dns) => !dns.id.startsWith('system--'));

  return (
    <main className="flex min-h-screen flex-col">
      <AddEditDnsModalComponent />
      <Header>
        {refreshIntervalTime && (
          <div>
            <p className="mt-2 flex items-center text-gray-500">
              Refreshing in{' '}
              <span className="leading-0 mx-1.5 w-[37px] rounded-sm bg-gray-100 px-2 py-1 text-right font-mono tabular-nums">
                {secondsUntilNextRefresh}
              </span>{' '}
              second(s)
            </p>
          </div>
        )}
      </Header>
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-1 flex-col items-start gap-4 px-4 pb-14 lg:flex-row">
        <div className="top-10 mb-8 w-full space-y-6 lg:sticky lg:mb-0 lg:max-w-md">
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
        <div className="w-full flex-1">
          <h2 className="mb-4 block font-heading text-3xl lg:hidden">Results</h2>
          <div className="space-y-2">
            {dnsList.map((dnsServer, idx) => {
              const result = resolvedAddresses[dnsServer.id];

              let testResults: TestResult[] = [];
              if (result && result.value !== '') {
                testResults = runTests(result.value);
              }

              const isLastCustomDNS = lastCustomDNSIndex === idx;

              return (
                <React.Fragment key={dnsServer.id}>
                  <ResultItem dnsServer={dnsServer} testResults={testResults}>
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
                  {isLastCustomDNS && (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        className="w-full"
                        onClick={() => setShowAddEditDnsModal(true)}
                      >
                        <PlusCircleIcon className="mr-2" size={16} />
                        Add custom DNS server
                      </Button>
                      <hr className="!my-6 block border-gray-200" />
                    </>
                  )}
                </React.Fragment>
              );
            })}
            {lastCustomDNSIndex === -1 && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => setShowAddEditDnsModal(true)}
              >
                <PlusCircleIcon className="mr-2" size={16} />
                Add custom DNS server
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
