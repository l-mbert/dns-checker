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
      return new Promise<
        Record<
          string,
          {
            value: string;
            time: number;
          }
        >
      >((resolve, reject) => {
        // Make sure the resolve is not taking too long
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 2000);

        // Measure the time it takes to resolve
        const start = Date.now();
        resolver.resolve(domain, recordType, (err, addresses) => {
          if (err && err.code !== 'ENODATA') {
            clearTimeout(timeout);
            console.error(err);
            reject(err);
          } else {
            clearTimeout(timeout);
            const end = Date.now();

            const item = addresses;
            if (!item) {
              return resolve({
                [server.name]: { value: '', time: end - start },
              });
            }

            switch (recordType) {
              case 'A':
              case 'AAAA':
                return resolve({
                  [server.name]: { value: (item as string[])[0] || '', time: end - start },
                });
              case 'MX':
                return resolve({
                  [server.name]: { value: (item as { exchange: string }[])[0]?.exchange || '', time: end - start },
                });
              case 'NS':
                return resolve({
                  [server.name]: { value: (item as string[])[0] || '', time: end - start },
                });
              case 'PTR':
                return resolve({
                  [server.name]: { value: (item as string[])[0] || '', time: end - start },
                });
              case 'TXT':
                return resolve({
                  [server.name]: { value: (item as string[])[0] || '', time: end - start },
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
