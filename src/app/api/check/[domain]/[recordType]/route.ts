import { Resolver } from 'dns';
import { NextResponse } from 'next/server';
import { dnsServers } from '@/constants/dnsServers';
import { RecordType, RecordTypes } from '@/constants/recordType';

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { domain: string; recordType: RecordType };
  }
) => {
  const { domain, recordType } = params;

  if (!domain) {
    return new Response('Bad request', { status: 400 });
  }

  const addresses = await Promise.all(
    dnsServers.map((server: { ip: string; name: string }) => {
      const resolver: Resolver = new Resolver();
      resolver.setServers([server.ip]);
      return new Promise<Record<string, string>>((resolve, reject) => {
        // Make sure the resolve is not taking too long
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 2000);

        resolver.resolve(domain, recordType, (err, addresses) => {
          if (err && err.code !== 'ENODATA') {
            clearTimeout(timeout);
            console.error(err);
            reject(err);
          } else {
            clearTimeout(timeout);
            const item = addresses;

            switch (recordType) {
              case RecordTypes.A:
              case RecordTypes.AAAA:
                return resolve({
                  [server.name]: (item as string[])[0] || '',
                });
              case RecordTypes.MX:
                return resolve({
                  [server.name]:
                    (item as { exchange: string }[])[0]?.exchange || '',
                });
              case RecordTypes.NS:
                return resolve({
                  [server.name]: (item as string[])[0] || '',
                });
              case RecordTypes.PTR:
                return resolve({
                  [server.name]: (item as string[])[0] || '',
                });
              case RecordTypes.TXT:
                return resolve({
                  [server.name]: (item as string[])[0] || '',
                });
              default:
                return resolve({});
            }
          }
        });
      });
    })
  );

  return NextResponse.json({
    addresses: addresses.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
  });
};
