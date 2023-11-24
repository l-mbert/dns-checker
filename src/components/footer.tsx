import { HeartFilledIcon } from '@radix-ui/react-icons';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <p className="mt-2 text-xs text-gray-500">
          Made by{' '}
          <a href="https://twitter.com/_cqeal" className="underline" target="_blank" rel="noopener noreferrer">
            Lambert Weller
          </a>{' '}
          with <HeartFilledIcon className="-mt-1 inline-block h-3 w-3" /> in{' '}
          <a href="https://nextjs.org/" className="underline" target="_blank" rel="noopener noreferrer">
            Next.js
          </a>
          , hosted on{' '}
          <a href="https://vercel.com/" className="underline" target="_blank" rel="noopener noreferrer">
            Vercel
          </a>
          . Source code available on{' '}
          <a
            href="https://github.com/l-mbert/dns-checker"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
