import { Resolver } from 'dns';
import { NextResponse } from 'next/server';
import { dnsServers } from '@/constants/dnsServers';

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { domain: string };
  }
) => {
  const { domain } = params;

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
        resolver.resolve4(domain, (err, addresses) => {
          if (err) {
            clearTimeout(timeout);
            reject(err);
          } else {
            clearTimeout(timeout);
            resolve({
              [server.name]: addresses[0],
            });
          }
        });
      });
    })
  );

  return NextResponse.json({
    addresses: addresses.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
  });
};
