'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const REFRESH_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export default function DashboardRefresher() {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [router]);

  return null;
}
