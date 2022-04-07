import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        <Link href="/codepen" passHref>
          <div className={styles.imgContainer}>
            <img src="/codepen.svg" alt="CodePen Link" />
          </div>
        </Link>
        <Link href="/github" passHref>
          <div className={styles.imgContainer}>
            <img src="/github.svg" alt="GitHub Account" />
          </div>
        </Link>
        <Link href="/twitter" passHref>
          <div className={styles.imgContainer}>
            <img src="/twitter.svg" alt="Twitter Handle" />
          </div>
        </Link>
        <Link href="/discord" passHref>
          <div className={styles.imgContainer}>
            <img src="/discord.svg" alt="Discord Link" />
          </div>
        </Link>
        <Link href="/linkedin" passHref>
          <div className={styles.imgContainer}>
            <img src="/linkedin.svg" alt="LinkedIn Profile" />
          </div>
        </Link>
      </div>
      <p className={styles.p}>© {year} Yaksh Bariya</p>
      <Link href="/yaksh.key" passHref>
        <p className={styles.p}>GPG Public Key</p>
      </Link>
    </footer>
  );
}
