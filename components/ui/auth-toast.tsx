'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast } from "sonner";

let hasShownToast = false;

export function AuthToast() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    useEffect(() => {
        if (!isClient) return;
        
        const message = searchParams.get('message');
        const from = searchParams.get('from');

        const shouldShow = (
            (message === 'unauthorized' || !!from) &&
            (pathname === '/' || pathname.includes('/login'))
        );

        if (shouldShow) {
            // console.log('AuthToast: Showing unauthorized message');
            
            if (!hasShownToast) {
                hasShownToast = true;
                
                const timer = setTimeout(() => {
                    toast.error('Authentication Required', {
                        description: 'Please log in to access this page',
                        duration: 5000,
                        dismissible:true,
                    });
                    
                    const url = new URL(window.location.href);
                    url.searchParams.delete('message');
                    url.searchParams.delete('from');
                    window.history.replaceState({}, '', url.toString());
                    
                    setTimeout(() => {
                        hasShownToast = false;
                    }, 1000);
                }, 100);
                
                return () => clearTimeout(timer);
            }
        }
    }, [searchParams, pathname, router, isClient]);

    return null;
}
