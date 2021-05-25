import Head from 'next/head';
import styles from '../styles/Blog.module.css';

interface FrontMatter {
  title: string;
  ogImage?: string;
  description: string;
  tags: ReadonlyArray<string>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  frontMatter: FrontMatter;
}

export default function MDXPage({ children, frontMatter }: Props) {
  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
        <meta property="description" content={frontMatter.description} />
        <meta property="og:description" content={frontMatter.description} />
        <meta property="og:title" content={frontMatter.title} />
        {frontMatter.ogImage ? (
          <meta property="og:image" content={frontMatter.ogImage} />
        ) : (
          ''
        )}
      </Head>
      <main>
        <h1 className={styles.blogHeading}>{frontMatter.title}</h1>
        {frontMatter.ogImage ? (
          <img src={frontMatter.ogImage} width="100%" alt="" />
        ) : (
          ''
        )}
        <p className={styles.blogDescription}>{frontMatter.description}</p>
        {children}
      </main>
    </>
  );
}
