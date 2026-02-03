// Google Ads & Analytics tracking utilities

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Track Google Ads purchase conversion
export const trackPurchaseConversion = (transactionId?: string, value: number = 1.0, currency: string = 'USD') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17027608656/rdtjCKipusEaENDgsrc_',
      'value': value,
      'currency': currency,
      'transaction_id': transactionId || '',
    });
  }
};

// Track custom events for Analytics
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};
