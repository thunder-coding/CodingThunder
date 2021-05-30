import styles from './Footer.module.css';

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        <a href="/codepen">
          <div className={styles.imgContainer}>
            <img src="/codepen.svg" alt="CodePen Logo" />
          </div>
        </a>
        <a href="/github">
          <div className={styles.imgContainer}>
            <img src="/github.svg" alt="GitHub Logo" />
          </div>
        </a>
        <a href="/twitter">
          <div className={styles.imgContainer}>
            <img src="/twitter.svg" alt="Twitter Logo" />
          </div>
        </a>
        <a href="/discord">
          <div className={styles.imgContainer}>
            <img src="/discord.svg" alt="Discord Logo" />
          </div>
        </a>
        <a href="/linkedin">
          <div className={styles.imgContainer}>
            <img src="/linkedin.svg" alt="LinkedIn Logo" />
          </div>
        </a>
      </div>
      <p className={styles.p}>© {year} Yaksh Bariya</p>
    </footer>
  );
}
