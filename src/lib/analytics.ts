// Skeleton wrappers for third-party analytics trackers (e.g., Google Analytics, Vercel Analytics, Posthog)

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (process.env.NODE_ENV === "production") {
    // Implement production analytics tracking (e.g., window.gtag('event', ...))
    console.log("Tracking event in prod:", eventName, properties);
  } else {
    console.log("Tracking event (dev):", eventName, properties);
  }
};

export const pageview = (url: string) => {
  if (process.env.NODE_ENV === "production") {
    // Implement production page view tracking
    console.log("Tracking pageview in prod for:", url);
  } else {
    console.log("Tracking pageview (dev) for:", url);
  }
};
