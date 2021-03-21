import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        <a href="https://codepen.io/thunder-coding">
          <img src="codepen.svg" alt="CodePen Logo" />
        </a>
        <a href="https://github.com/thunder-coding">
          <img src="github.svg" alt="GitHub Logo" />
        </a>
        <a href="https://twitter.com/CodingThunder">
          <img src="twitter.svg" alt="Twitter Logo" />
        </a>
        <a href="https://discord.gg/YMhxGjzsJ8">
          <img src="discord.svg" alt="Discord Logo" />
        </a>
        <a href="https://linkedin.com/in/codingthunder">
          <img src="linkedin.svg" alt="LinkedIn Logo" />
        </a>
      </div>
      <p className={styles.p}>© {year} Yaksh Bariya</p>
    </footer>
  );
}
