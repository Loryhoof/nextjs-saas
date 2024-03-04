'use client';

import Script from 'next/script'

const GoogleAnalytics = () => {
    return (
        <>
            <Script strategy="afterInteractive" 
                src={`GOOGLE_ADS_TAG_URL`}/>
            <Script id='google-analytics' strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'GOOGLE_ADS_TAG', {
                    page_path: window.location.pathname,
                });
                `,
                }}
            />
        </>
        )}

export default GoogleAnalytics;