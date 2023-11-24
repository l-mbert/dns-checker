interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex flex-col justify-between lg:items-center max-w-6xl mx-auto py-14 px-4 lg:px-0 lg:flex-row space-y-4">
        <div>
          <h1 className="font-heading text-3xl">Domain Checker</h1>
          <p className="mt-2 text-gray-500">Check if your domain is pointing to the right IP address.</p>
        </div>
        {children}
      </div>
    </header>
  );
}
