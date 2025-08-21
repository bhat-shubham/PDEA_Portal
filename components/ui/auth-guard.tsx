'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (pathname === '/') {
      const from = searchParams.get('from');
      if (from && !hasShownRef.current) {
        hasShownRef.current = true;
        toast.error('Authentication Required', {
          description: 'Please login to continue',
          duration: 4000,
          dismissible: true,
        });

        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('from');
          window.history.replaceState({}, '', url.toString());
        }, 0);
      }
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
