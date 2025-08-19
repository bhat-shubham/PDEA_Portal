'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast } from "sonner";

let hasShownToast = false;

export function AuthToast() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    
    useEffect(() => {
        const message = searchParams.get('message');
        
        if (message === 'unauthorized' && (pathname === '/' || pathname.includes('/login'))) {
            // console.log('AuthToast: Showing unauthorized message');
            
            if (!hasShownToast) {
                hasShownToast = true;
                
                const timer = setTimeout(() => {
                    toast.error('Authentication Required', {
                        description: 'Please log in to access this page',
                        duration: 5000,
                        dismissible:true,
                    });
                    
                    const newUrl = pathname;
                    router.replace(newUrl, { scroll: false });
                    
                    setTimeout(() => {
                        hasShownToast = false;
                    }, 1000);
                }, 100);
                
                return () => clearTimeout(timer);
            }
        }
    }, [searchParams, pathname, router]);

    return null;
}
