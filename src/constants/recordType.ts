export const RecordTypes = ['A', 'AAAA', 'MX', 'NS', 'PTR', 'TXT'] as const;

export type RecordType = (typeof RecordTypes)[number];
