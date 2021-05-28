import Head from 'next/head';
import styles from '../styles/Blog.module.css';

interface FrontMatter {
  title: string;
  ogImage?: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
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
        <meta property="og:type" content="article" />
        <meta name="description" content={frontMatter.description} />
        <meta property="og:description" content={frontMatter.description} />
        <meta property="og:title" content={frontMatter.title} />
        {frontMatter.ogImage ? (
          <meta property="og:image" content={frontMatter.ogImage} />
        ) : (
          ''
        )}
        <meta
          property="article:published_time"
          content={new Date(
            frontMatter.publishedTime + ' Z+5:30'
          ).toISOString()}
        />
        {frontMatter.modifiedTime ? (
          <meta
            property="article:modified_time"
            content={new Date(
              frontMatter.modifiedTime + ' Z+5:30'
            ).toISOString()}
          />
        ) : (
          ''
        )}{' '}
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
