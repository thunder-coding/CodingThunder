import Link from 'next/link';
import styles from './Header.module.scss';
import { Component } from 'react';

export default function Header() {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="/">HOME</Link>
        <Link href="/posts">BLOGS</Link>
      </nav>
    </>
  );
}
