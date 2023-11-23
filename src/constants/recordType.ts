export const RecordTypes = {
  A: 'A',
  AAAA: 'AAAA',
  MX: 'MX',
  NS: 'NS',
  PTR: 'PTR',
  TXT: 'TXT',
} as const;

export type RecordType = (typeof RecordTypes)[keyof typeof RecordTypes];
