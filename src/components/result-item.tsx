import { DnsServer } from '@/constants/dnsServers';
import { Test, TestResult } from '@/stores/testStore';
import { InfoIcon } from 'lucide-react';

import { Pill } from './pill';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ResultItemProps {
  dnsServer: DnsServer;
  testResults?: TestResult[];
  children: React.ReactNode;
}

export function ResultItem({ dnsServer, testResults, children }: ResultItemProps) {
  return (
    <div key={dnsServer.ip} className="rounded-md border border-gray-200 bg-white px-6 py-8">
      <div className="flex items-center justify-between gap-2">
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
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
          {testResults.map((testResult) => (
            <Pill key={testResult.id} variant={testResult.result ? 'green' : 'red'}>
              {testResult.name}
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}
