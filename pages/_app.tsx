import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Footer from '../components/Footer.component';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="Yaksh Bariya's website" />
        <meta
          name="keywords"
          content="Yaksh Bariya, CodingThunder, Coding Thunder, Yaksh Programmer"
        />
        <title>Yaksh Bariya</title>
      </Head>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
