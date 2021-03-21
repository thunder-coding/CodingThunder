import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        <a href="https://codepen.io/thunder-coding">
          <img src="codepen.svg" />
        </a>
        <a href="https://github.com/thunder-coding">
          <img src="github.svg" />
        </a>
        <a href="https://twitter.com/CodingThunder">
          <img src="twitter.svg" />
        </a>
        <a href="https://discord.gg/YMhxGjzsJ8">
          <img src="discord.svg" />
        </a>
        <a href="https://linkedin.com/in/codingthunder">
          <img src="linkedin.svg" />
        </a>
      </div>
      <p className={styles.p}>© {year} Yaksh Bariya</p>
    </footer>
  );
}
