import { Suspense } from 'react';
import { GuardianSidebar } from '@/components/guardian/GuardianSidebar';
import { GuardianHeader } from '@/components/guardian/GuardianHeader';

function SidebarFallback() {
  return (
    <div className="w-[280px] h-screen flex-shrink-0 bg-[var(--bg-sidebar)] border-r border-[var(--border-sidebar)] hidden md:flex" />
  );
}

export default function GuardianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-sans">
      <Suspense fallback={<SidebarFallback />}>
        <GuardianSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <GuardianHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 text-[var(--brand-primary)] border-4 border-current border-t-transparent rounded-full" />
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
