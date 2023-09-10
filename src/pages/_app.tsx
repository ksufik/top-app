import { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';
import React from 'react';
import ym, {YMInitializer} from 'react-yandex-metrika';
import { Router } from 'next/router';

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
	Router.events.on('routeChangeComplete', (url:string)=>{
		if (typeof window !== 'undefined') {//если м на клиенте
			ym('hit',url);
		}
	})
  return (
    <>
      <Head>
        <title>MyTop - наш лучший топ</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
				<link rel="preconnect" href="https://mc.yandex.ru" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
				{/*property="og:..." используются для вставки превью в соц сетях и мессенджерах */}
        {/* мб только один на весь сайт */}
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_DOMAIN + router.asPath}
        />
				<meta
          property="og:locale"
          content="ru_RU"
        />
      </Head>
			<YMInitializer accounts={[]} options={{webvisor:true,defer:true}} version='2'/>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
