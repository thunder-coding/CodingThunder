import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/404.module.scss';

export default function PageNotFound() {
  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.errorCodeContainer}>
          <div className={styles.errorCode}>404</div>
          <div className={styles.errorDescription}>Page Not Found</div>
        </div>
      </div>
      <Link href="/">
        <button className={styles.homeButton}>HOME</button>
      </Link>
    </>
  );
}
