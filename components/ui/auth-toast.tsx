'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from "sonner";

export function AuthToast() {
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'unauthorized') {
            toast.error("Authentication Required", {
                description: "Please login to access that page",
                duration: 4000,
            });
        }
    }, [searchParams]);

    return null;
}
