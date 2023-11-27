import { dnsServers } from '@/constants/dnsServers';
import { z } from 'zod';
import { create } from 'zustand';

import { dnsSchema } from '@/components/modals/add-edit-dns-modal';

export type DNS = {
  id: string;
  name: string;
  ip: string;
  city?: string;
  country?: string;
  keepInLocalStorage?: boolean;
};

type DNSStore = {
  dns: DNS[];
  addDNS: (dns: DNS) => void;
  removeDNS: (id: string) => void;
  updateDNS: (dns: Partial<DNS>) => void;
  clearDNS: () => void;
  saveDnsServersToLocalStorage: () => void;
  loadDnsServersFromLocalStorage: () => void;
};

export const useDNSStore = create<DNSStore>()((set, state) => ({
  dns: dnsServers,
  addDNS: (dns) => {
    set((state) => ({
      dns: [...state.dns, dns],
    }));
  },
  removeDNS: (id) => {
    set((state) => ({
      dns: state.dns.filter((item) => item.id !== id),
    }));
  },
  updateDNS: (dns) => {
    set((state) => ({
      dns: state.dns.map((item) => {
        if (item.id === dns.id) {
          return {
            ...item,
            ...dns,
          };
        }
        return item;
      }),
    }));
  },
  clearDNS: () => {
    set((state) => ({
      dns: [],
    }));
  },
  saveDnsServersToLocalStorage: () => {
    if (typeof window === 'undefined') {
      return;
    }

    // Save to localStorage and filter out system DNS servers and if keepInLocalStorage is false and dedpulicate without zod parsing
    const dnsListDeduplicated = state()
      .dns.filter((item) => {
        const index = state().dns.findIndex((dns) => dns.id === item.id);
        return index === state().dns.indexOf(item);
      })
      .filter((item) => !item.id.startsWith('system--') && item.keepInLocalStorage !== false);

    localStorage.setItem('dns', JSON.stringify(dnsListDeduplicated));
  },
  loadDnsServersFromLocalStorage: () => {
    if (typeof window === 'undefined') {
      return;
    }

    const dns = localStorage.getItem('dns');
    const dnsSchemaArray = z.array(dnsSchema);
    const parseResult = dnsSchemaArray.safeParse(JSON.parse(dns || '[]'));
    if (parseResult.success) {
      // Make sure not to load the same DNS servers twice
      const newDns = parseResult.data.filter((item) => !state().dns.find((dns) => dns.id === item.id));
      set((state) => ({
        dns: [...newDns, ...state.dns],
      }));
    }
  },
}));
