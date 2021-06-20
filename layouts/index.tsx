import Head from 'next/head';
import styles from '../styles/Blog.module.scss';
import type FrontMatter from '../types/FrontMatter';

/**
 * This function will return an error if any problems are found inside front matter data.
 * In case of any wrong value or something that seems to be very wrong,
 * it will throw an error at build time so that this blogger won't mistakenly do some wrong thing
 */
// @prettier-ignore
function validateFrontmatter({
  title,
  ogImage,
  description,
  publishedTime,
  modifiedTime,
  tags,
}: FrontMatter) {
  if (typeof title != 'string')
    throw new Error('Blog title should be of type string');
  if (title.length <= 20)
    throw new Error('Title too short, consider having atleast 20 characters');
  if (typeof description != 'string')
    throw new Error('blog description should be of type string');
  if (description.length <= 30)
    throw new Error(
      'Description too short, consider having atleast 30 characters'
    );
  if (tags.length > 8)
    throw new Error(
      'Spamming keywords may cause the site not to be indexed by search engines'
    );
  if (typeof modifiedTime != 'undefined') {
    if (
      new Date(modifiedTime).valueOf() - new Date(publishedTime).valueOf() <=
      0
    )
      throw new Error('Modified time cannot be before published time');
  }
}

interface Props {
  children: JSX.Element | JSX.Element[];
  frontMatter: FrontMatter;
}

export default function MDXPage({ children, frontMatter }: Props) {
  validateFrontmatter(frontMatter);
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
