import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        <Link href="/codepen">
          <img src="codepen.svg" alt="CodePen Logo" />
        </Link>
        <Link href="/github">
          <img src="github.svg" alt="GitHub Logo" />
        </Link>
        <Link href="/twitter">
          <img src="twitter.svg" alt="Twitter Logo" />
        </Link>
        <Link href="/discord">
          <img src="discord.svg" alt="Discord Logo" />
        </Link>
        <Link href="/linkedin">
          <img src="linkedin.svg" alt="LinkedIn Logo" />
        </Link>
      </div>
      <p className={styles.p}>© {year} Yaksh Bariya</p>
    </footer>
  );
}
