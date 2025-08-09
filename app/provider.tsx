"use client";
import { ProgressProvider } from '@bprogress/next/app';
import { ThemeProvider } from "next-themes";

export function Providers({children}:{
    children:React.ReactNode
}) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ProgressProvider 
      height="4px"
      color="#61C7CA"
      options={{ showSpinner: false }}
    //   shallowRouting
    >
      {children}
    </ProgressProvider>

        </ThemeProvider>
    )
}
