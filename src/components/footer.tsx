import { HeartFilledIcon } from '@radix-ui/react-icons';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto py-4 px-4 lg:px-0">
        <p className="mt-2 text-gray-500 text-xs">
          Made by{' '}
          <a
            href="https://twitter.com/_cqeal"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lambert Weller
          </a>{' '}
          with <HeartFilledIcon className="inline-block w-3 h-3 -mt-1" /> in{' '}
          <a
            href="https://nextjs.org/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>
          , hosted on{' '}
          <a
            href="https://vercel.com/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
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
