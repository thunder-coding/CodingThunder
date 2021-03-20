import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p className={styles.p}>© {year} Yaksh Bariya</p>
    </footer>
  );
}
