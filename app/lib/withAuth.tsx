"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to access this page");
        router.replace('/teacher/login');
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return <div className='flex items-center justify-center h-screen'>Loading...</div>; 
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
