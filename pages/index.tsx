import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Head from 'next/head';
export default function Home() {
  return (
    <>
      <Head>
        <meta name="description" content="Yaksh Bariya's website" />
        <meta
          name="keywords"
          content="Yaksh Bariya, CodingThunder, Coding Thunder, Yaksh Programmer"
        />{' '}
        <meta property="og:image" content="/ogimage.jpg" />
        <meta property="og:title" content="Yaksh Bariya" />
        <meta property="og:url" content="https://codingthunder.vercel.app" />
        <meta
          property="og:description"
          content="Personal website of Yaksh Bariya"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <title>Yaksh Bariya</title>
      </Head>
      <div className={styles.imageContainer}>
        <div className={styles.imageRing}>
          <Image
            className={styles.image}
            height="300px"
            width="300px"
            src="/myimage.jpg"
            alt="Yaksh Bariya's photo"
          />
        </div>
      </div>
      <div className={styles.introduction}>
        <h1>
          Hey There <span className={styles.wavyHand}>👋</span>,
        </h1>
        <p>
          I am Yaksh Bariya, a 14 year old programmer who loves to code and
          explore the world of programming
        </p>
      </div>
    </>
  );
}
