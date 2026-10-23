// Google Analytics 4, property getopora.app (560500559). Consent defaults must reach dataLayer before gtag.js loads.
(() => {
  const id = 'G-NTGSD0VF4K'; // web stream "Opora" 16186458370
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };

  // No ad cookies anywhere. Europe gets cookieless pings until a visitor consents, which the site never asks for.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted',
  });
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    region: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
      'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'],
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('js', new Date());
  gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });

  if (!id.endsWith('XXXXXXXXXX')) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(s);
  }

  window.oporaTrack = (name, params) => gtag('event', name, params);

  // Every App Store link carries ct=<placement>, the same label App Store Connect attributes installs to.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="apps.apple.com"]');
    if (link) oporaTrack('app_store_click', { placement: new URL(link.href).searchParams.get('ct') || 'untagged' });
  });
})();
