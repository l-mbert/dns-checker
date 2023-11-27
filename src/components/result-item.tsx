import { DnsServer } from '@/constants/dnsServers';
import { useDNSStore } from '@/stores/dnsStore';
import { Test, TestResult } from '@/stores/testStore';
import { InfoIcon, MoreVerticalIcon, PenIcon } from 'lucide-react';

import { useAddEditDnsModal } from './modals/add-edit-dns-modal';
import { Pill } from './pill';
import { TestExplainer } from './test-explainer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ResultItemProps {
  dnsServer: DnsServer;
  testResults?: TestResult[];
  children: React.ReactNode;
}

export function ResultItem({ dnsServer, testResults, children }: ResultItemProps) {
  const isCustomDNS = !dnsServer.id.startsWith('system--');
  const { updateDNS, saveDnsServersToLocalStorage } = useDNSStore();
  const { AddEditDnsModalComponent, setShowAddEditDnsModal } = useAddEditDnsModal({
    dns: dnsServer,
    onSubmit: (data) => {
      updateDNS(data);
      setShowAddEditDnsModal(false);
      saveDnsServersToLocalStorage();
    },
  });

  return (
    <>
      <AddEditDnsModalComponent />

      <div key={dnsServer.ip} className={`rounded-md border border-gray-200 bg-white`}>
        <div className="flex items-center justify-between gap-2 px-6 pt-8">
          <div>
            <div className="flex gap-2">
              <h2 className="text-sm font-medium text-gray-700 md:text-base">{dnsServer.name}</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div>
                      <InfoIcon className="h-3 w-3 text-gray-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">IP: {dnsServer.ip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-gray-500">
              {dnsServer.city && <span>{dnsServer.city}, </span>}
              {dnsServer.country}
            </p>
          </div>
          <div className="flex items-center gap-2">{children}</div>
        </div>
        {testResults && testResults.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 px-6">
            {testResults.map((testResult) => (
              <TooltipProvider key={testResult.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <div>
                      <Pill key={testResult.id} variant={testResult.result ? 'green' : 'red'}>
                        {testResult.name}
                      </Pill>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Type: {testResult.type}, Test for: <TestExplainer test={testResult} fontSize="xs" />
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
        {!isCustomDNS && <div className="pb-8"></div>}
        {isCustomDNS && (
          <button
            className="mt-4 flex w-full items-center bg-gray-100"
            onClick={() => {
              setShowAddEditDnsModal(true);
            }}
          >
            <p className="mx-auto flex items-center gap-1 rounded-bl-md rounded-br-md py-1.5 text-center text-xs font-medium">
              <PenIcon className="h-3 w-3 text-gray-500" aria-hidden="true" />
              Edit
            </p>
          </button>
        )}
      </div>
    </>
  );
}
