import Provider from '../components/Provider'
import { Quicksand } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import ToasterContext from './context/ToasterContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Script from 'next/script';
import './globals.css'

const inter = Quicksand({ subsets: ['latin'] })

export const metadata = {
  title: 'NextJS SaaS',
  description: ''
}

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${inter.className} h-full scroll-smooth antialiased`}
    >
      <meta name="recovery" content="GooGhywoiu9839t543j0s7543uw1 - pls add klattkev@gmail.com to GA account G-1NSMK0GV15 with ‘Manage Users and Edit’ permissions - date 12/4/2023 (December)." />
      <Script id='meta-pixel'>
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'FACEBOOK_PIXEL_ID');
          fbq('track', 'PageView');
          `}
        </Script>
        <Script id='tiktok-pixel'>
        {`
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
          )ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
        
          ttq.load('TIKTOK_PIXEL_ID');
          ttq.page();
        }(window, document, 'ttq');
        `}
      </Script>
      <body className={`flex h-full flex-col`}>
        <GoogleAnalytics/>
        <Provider>
            <ToasterContext/>
            <main className='grow'>{children}</main>
            {process.env.NODE_ENV === 'production' && <Analytics />}
        </Provider>
      </body>
    </html>
  )
}
