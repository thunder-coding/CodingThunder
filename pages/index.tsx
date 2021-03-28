import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <div className={styles.imageContainer}>
        <div className={styles.imageRing}>
          <Image
            className={styles.image}
            height="300px"
            width="300px"
            src="/myimage.jpg"
            alt="Yaksh Bariya's photo"
          />
        </div>
      </div>
      <div className={styles.introduction}>
        <h1>
          Hey There <span className={styles.wavyHand}>👋</span>,
        </h1>
        <p>
          I am Yaksh Bariya, a 14 year old programmer who loves to code and
          explore the world of programming
        </p>
      </div>
    </>
  );
}
