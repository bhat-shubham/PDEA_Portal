"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-white text-gray-800">
      <h1 className="text-9xl font-bold tracking-widest">404</h1>
      <div className="absolute rotate-12 rounded bg-yellow-400 px-2 text-sm text-black shadow-lg">
        Page Not Found
      </div>
      <p className="mt-6 text-lg text-gray-600">
        Oops! Looks like you’re lost.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-2xl border border-gray-800 px-6 py-2 text-sm font-semibold transition hover:bg-gray-800 hover:text-white"
      >
        Go Home
      </Link>
    </main>
  );
}
