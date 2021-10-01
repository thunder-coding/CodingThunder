import { readdirSync } from 'fs';
import fs from 'fs';
import matter from 'gray-matter';
import FrontMatter from '../../types/FrontMatter';
import Link from 'next/link';
import styles from '../../styles/BlogHome.module.scss';

interface ExtendedFrontMatter extends FrontMatter {
  slug: string;
}

interface Props {
  posts: Array<ExtendedFrontMatter>;
}

interface GetStaticProps {
  props: Props;
}
export default function BlogHome(props: Props) {
  return (
    <div className={styles.blogContainer}>
      {props.posts.map((post) => {
        return (
          <Link href={`/posts/${post.slug.slice(0, post.slug.length - 4)}`}>
            <a
              className={styles.blogContainer}
              href={`/posts/${post.slug.slice(0, post.slug.length - 4)}`}
            >
              {post.ogImage && <img width="100%" src={`/${post.ogImage}`} />}

              <h1>{post.title}</h1>
              <p>{post.description}</p>
            </a>
          </Link>
        );
      })}
    </div>
  );
}

export async function getStaticProps(): Promise<GetStaticProps> {
  const posts = readdirSync('posts')
    .filter((file) => file!.match(/\.mdx$/))
    .map((slug) => {
      let { data } = matter(fs.readFileSync(`./posts/${slug}`)) as unknown as {
        data: FrontMatter;
      };
      return { ...data, slug } as ExtendedFrontMatter;
    })
    .sort(
      (a, b) =>
        new Date(a.publishedDate).getTime() -
        new Date(b.publishedDate).getTime()
    ) as Array<ExtendedFrontMatter>;
  return { props: { posts: posts } };
}
