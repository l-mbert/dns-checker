export const dnsServers = [
  {
    name: 'OpenDNS',
    ip: '208.67.222.220',
    country: 'United States',
    city: 'San Francisco',
  },
  {
    name: 'Google',
    ip: '8.8.8.8',
    country: 'United States',
    city: 'Mountain View',
  },
  {
    name: 'Quad9',
    ip: '9.9.9.9',
    country: 'United States',
    city: 'Berkeley',
  },
  {
    name: 'Probe Networks',
    ip: '82.96.64.2',
    country: 'Germany',
    city: 'Saarland',
  },
  {
    name: '4D Data Centres Ltd',
    ip: '37.209.219.30',
    country: 'United Kingdom',
    city: 'Byfleet',
  },
  {
    name: 'Oskar Emmenegger',
    ip: '194.209.157.109',
    country: 'Switzerland',
    city: 'Zizers',
  },
  {
    name: 'nemox.net',
    ip: '83.137.41.9',
    country: 'Austria',
    city: 'Innsbruck',
  },
  {
    name: 'AT&T Services',
    ip: '12.121.117.201',
    country: 'United States',
    city: 'Miami',
  },
  {
    name: 'VeriSign Global Registry Services',
    ip: '64.6.64.6',
    country: 'United States',
    city: 'Virginia',
  },
  {
    name: 'Quad9',
    ip: '149.112.112.112',
    country: 'United States',
    city: 'San Francisco',
  },
  {
    name: 'CenturyLink',
    ip: '205.171.202.66',
    country: 'United States',
    city: '',
  },
  {
    name: 'Fortinet Inc',
    ip: '208.91.112.53',
    country: 'Canada',
    city: 'Burnaby',
  },
  {
    name: 'Skydns',
    ip: '195.46.39.39',
    country: 'Russia',
    city: 'Yekaterinburg',
  },
  {
    name: 'Liquid Telecommunications Ltd',
    ip: '5.11.11.5',
    country: 'South Africa',
    city: 'Cullinan',
  },
  {
    name: 'Pyton Communication Services B.V.',
    ip: '193.58.204.59',
    country: 'Netherlands',
    city: 'Weert',
  },
  {
    name: 'Association Gitoyen',
    ip: '80.67.169.40',
    country: 'France',
    city: 'Paris',
  },
  {
    name: 'Prioritytelecom Spain S.A.',
    ip: '212.230.255.1',
    country: 'Spain',
    city: 'Madrid',
  },
] as const;
export type DnsServer = (typeof dnsServers)[number];
