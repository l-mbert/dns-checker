interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col justify-between space-y-4 px-4 py-14 lg:flex-row lg:items-center">
        <div>
          <h1 className="font-heading text-3xl">Domain Checker</h1>
          <p className="mt-2 text-gray-500">Check if your domain is pointing to the right IP address.</p>
        </div>
        {children}
      </div>
    </header>
  );
}
