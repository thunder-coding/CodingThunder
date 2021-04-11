import Head from 'next/head';
import styles from '../styles/404.module.css';

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
      </div>{' '}
    </>
  );
}
