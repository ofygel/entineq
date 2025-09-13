'use client';
import posthog from 'posthog-js';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function AnalyticsProvider(){
  useEffect(()=> {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || process.env.POSTHOG_HOST || 'https://eu.i.posthog.com';
    if (key && !posthog.__loaded) posthog.init(key, { api_host: host, capture_pageview: true, capture_pageleave: true });
    const dsn = process.env.SENTRY_DSN;
    if (dsn) Sentry.init({ dsn, tracesSampleRate: 0.15, replaysSessionSampleRate: 0.0 });
  }, []);
  return null;
}
