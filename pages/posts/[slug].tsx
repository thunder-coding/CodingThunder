import fs from 'fs';
import matter from 'gray-matter';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';
import styles from '../../styles/Blog.module.scss';
//@ts-ignore
import mapBox from '@mapbox/rehype-prism';
import FrontMatter from '../../types/FrontMatter';

interface Props {
  mdxSource: MDXRemoteSerializeResult;
  frontMatter: FrontMatter;
}

interface PostParams {
  params: {
    slug: string;
  };
}
interface GetStaticProps {
  props: Props;
}

function validateFrontmatter({
  title,
  ogImage,
  description,
  publishedDate,
  modifiedDate,
  tags,
}: FrontMatter) {
  const _publishedDate =
    new Date(publishedDate).getTimezoneOffset() - new Date().getTimezoneOffset()
      ? new Date(publishedDate)
      : new Date(`${publishedDate} Z+5:30`);
  const _modifiedDate =
    typeof modifiedDate != 'undefined' &&
    new Date(modifiedDate).getTimezoneOffset() - new Date().getTimezoneOffset()
      ? new Date(modifiedDate)
      : new Date(`${modifiedDate} Z+5:30`);
  switch (true) {
    case typeof title != 'string':
      throw new Error('Title should be string');
    case title.length > 60:
      throw new Error('Title too long');
    case title.split(' ').some((word) => word.length > 10):
      throw new Error('One of the word in title too long');
    case typeof description != 'string':
      throw new Error('Description should be of type string');
    case description.length > 100:
      throw new Error('Description too long');
    case !Array.isArray(tags):
      throw new Error('tags should be an array of strings');
    case tags.length > 8:
      throw new Error("Spamming tags isn't good, use atmost 8");
    case typeof ogImage === 'string' &&
      !fs.existsSync(path.join(process.cwd(), 'public', ogImage as string)):
      throw new Error("OG Image doesn't exist");
    case isNaN(_publishedDate.getTime()):
      throw new Error('Published date should be a valid date');
    case !isNaN(_modifiedDate.getTime()) && isNaN(_modifiedDate.getTime()):
      throw new Error('Modified date should be a valid date');
    case _modifiedDate.getTime() < new Date(publishedDate).getTime():
      throw new Error('Modified date should be after published date');
  }
}

export default function BlogPost({ mdxSource, frontMatter }: Props) {
  const components = {
    a: Link,
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const publishedDate =
    new Date(frontMatter.publishedDate).getTimezoneOffset() -
    new Date().getTimezoneOffset()
      ? new Date(frontMatter.publishedDate)
      : new Date(`${frontMatter.publishedDate} Z+5:30`);
  const modifiedDate =
    typeof frontMatter.modifiedDate != 'undefined' &&
    new Date(frontMatter.modifiedDate).getTimezoneOffset() -
      new Date().getTimezoneOffset()
      ? new Date(frontMatter.modifiedDate)
      : new Date(`${frontMatter.modifiedDate} Z+5:30`);
  return (
    <>
      <Head>
        <meta name="description" content={frontMatter.description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={frontMatter.title} />
        <meta property="og:description" content={frontMatter.description} />
        {frontMatter.ogImage && (
          <meta property="og:image" content={frontMatter.ogImage} />
        )}
        <meta
          property="article:published_time"
          content={publishedDate.toISOString()}
        />
        {frontMatter.modifiedDate && (
          <meta
            property="article:modified_time"
            content={modifiedDate.toISOString()}
          />
        )}
        <title>{frontMatter.title}</title>
      </Head>
      <h1 className={styles.blogHeading}>{frontMatter.title}</h1>
      <p className={styles.blogDescription}>{frontMatter.description}</p>
      <main>
        <MDXRemote {...mdxSource} components={components} />
      </main>
      <p className={styles.Date}>
        Published on {months[publishedDate.getUTCMonth()]}{' '}
        {publishedDate.getUTCDate()}, {publishedDate.getUTCFullYear()}
      </p>
      {frontMatter.modifiedDate && (
        <p className={styles.Date}>
          Published on {months[modifiedDate.getUTCMonth()]}{' '}
          {modifiedDate.getUTCDate()}, {modifiedDate.getUTCFullYear()}
        </p>
      )}
      {frontMatter.tags.map((keyword, index) => (
        <span key={index} className={styles.keyword}>
          {keyword}
        </span>
      ))}
    </>
  );
}

export const getStaticProps = async ({ params }: PostParams) => {
  const POSTS_PATH = path.join(process.cwd(), 'posts');
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);
  const { content, data } = matter(source);
  validateFrontmatter(data as FrontMatter);
  const mdxSource = (await serialize(content, {
    mdxOptions: { remarkPlugins: [], rehypePlugins: [mapBox] },
    scope: data,
  })) as MDXRemoteSerializeResult;

  return {
    props: { mdxSource: mdxSource, frontMatter: data },
  } as GetStaticProps;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const POSTS_PATH = path.join(process.cwd(), 'posts');
  const postFilePaths = fs
    .readdirSync(POSTS_PATH)
    .filter((path) => /\.mdx?$/.test(path));
  const paths = postFilePaths
    .map((path) => path.replace(/\.mdx$/, ''))
    .map((slug) => ({ params: { slug } }));
  return {
    paths,
    fallback: false,
  };
};
