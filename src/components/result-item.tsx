import { DnsServer } from '@/constants/dnsServers';

interface ResultItemProps {
  dnsServer: DnsServer;
  children: React.ReactNode;
}

export function ResultItem({ dnsServer, children }: ResultItemProps) {
  return (
    <div key={dnsServer.ip} className="rounded-md border border-gray-200 bg-white px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-md font-medium text-gray-700">{dnsServer.name}</h2>
          <p className="text-gray-500 text-xs">
            {dnsServer.city && <span>{dnsServer.city}, </span>}
            {dnsServer.country}
          </p>
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
}
