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
  publishedTime,
  modifiedTime,
  tags,
}: FrontMatter) {
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
    case Array.isArray(tags) && tags.length > 8:
      throw new Error("Spamming tags isn't good, use atmost 8");
    case typeof ogImage === 'string' &&
      !fs.existsSync(path.join(process.cwd(), 'public', ogImage as string)):
      throw new Error("OG Image doesn't exist");
  }
}

export default function BlogPost({ mdxSource, frontMatter }: Props) {
  const components = {
    a: Link,
  };
  return (
    <>
      <Head>
        <meta name="description" content={frontMatter.description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="artticle" />
        <meta property="og:title" content={frontMatter.title} />
        <meta property="og:description" content={frontMatter.description} />
        <title>{frontMatter.title}</title>
      </Head>
      <h1 className={styles.blogHeading}>{frontMatter.title}</h1>
      <p className={styles.blogDescription}>{frontMatter.description}</p>
      <main>
        <MDXRemote {...mdxSource} components={components} />
      </main>
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