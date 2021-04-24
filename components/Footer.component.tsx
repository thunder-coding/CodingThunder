import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        <Link href="/codepen">
          <div className={styles.imgContainer}>
            <img src="/codepen.svg" alt="CodePen Logo" />
          </div>
        </Link>
        <Link href="/github">
          <div className={styles.imgContainer}>
            <img src="/github.svg" alt="GitHub Logo" />
          </div>
        </Link>
        <Link href="/twitter">
          <div className={styles.imgContainer}>
            <img src="/twitter.svg" alt="Twitter Logo" />
          </div>
        </Link>
        <Link href="/discord">
          <div className={styles.imgContainer}>
            <img src="/discord.svg" alt="Discord Logo" />
          </div>
        </Link>
        <Link href="/linkedin">
          <div className={styles.imgContainer}>
            <img src="/linkedin.svg" alt="LinkedIn Logo" />
          </div>
        </Link>
      </div>
      <p className={styles.p}>© {year} Yaksh Bariya</p>
    </footer>
  );
}
