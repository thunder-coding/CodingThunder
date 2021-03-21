import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function Home() {
  return (
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
  );
}
