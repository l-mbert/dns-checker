import { Resolver } from 'dns';
import { NextRequest, NextResponse } from 'next/server';
import { dnsServers } from '@/constants/dnsServers';
import { RecordType, RecordTypes } from '@/constants/recordType';
import { DNS } from '@/stores/dnsStore';

import { ratelimit } from '@/lib/redis';

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { domain: string; recordType: RecordType };
  }
) => {
  let remoteDnsServer: DNS[] = [];
  try {
    const res = await req.json();
    if (res.dnsServers) {
      remoteDnsServer = res.dnsServers;
    }
  } catch (error) {
    console.error(error);
  }

  const { domain, recordType } = params;

  if (!domain) {
    return new Response('Bad request', { status: 400 });
  }

  if (!RecordTypes.includes(recordType)) {
    return new Response('Bad request', { status: 400 });
  }

  const isRatelimiterActive = process.env.ACTIVATE_RATE_LIMITER === 'true';
  if (isRatelimiterActive) {
    const ip = req.ip || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success, limit, reset } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          limit,
          reset,
        },
        { status: 429 }
      );
    }
  }

  let dnsServersToUse = remoteDnsServer.length > 0 ? remoteDnsServer : dnsServers;

  const addressesResults = await Promise.allSettled(
    dnsServersToUse.map((server: { id: string; ip: string; name: string }) => {
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
                [server.id]: { value: '', time: end - start },
              });
            }

            switch (recordType) {
              case 'A':
              case 'AAAA':
                return resolve({
                  [server.id]: { value: (item as string[])[0] || '', time: end - start },
                });
              case 'MX':
                return resolve({
                  [server.id]: { value: (item as { exchange: string }[])[0]?.exchange || '', time: end - start },
                });
              case 'NS':
                return resolve({
                  [server.id]: { value: (item as string[])[0] || '', time: end - start },
                });
              case 'PTR':
                return resolve({
                  [server.id]: { value: (item as string[])[0] || '', time: end - start },
                });
              case 'TXT':
                return resolve({
                  [server.id]: { value: (item as string[])[0] || '', time: end - start },
                });
              default:
                return resolve({});
            }
          }
        });
      });
    })
  );

  const addresses = addressesResults
    .map((result) => {
      if (result.status === 'fulfilled') return result.value;
      return {};
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  return NextResponse.json({
    addresses: addresses,
  });
};
