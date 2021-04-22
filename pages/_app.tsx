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
        <meta property="og:image" content="/ogimage.jpg" />
        <meta property="og:title" content="Yaksh Bariya" />
        <meta
          property="og:description"
          content="Personal website of Yaksh Bariya"
        />
        <title>Yaksh Bariya</title>
      </Head>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
