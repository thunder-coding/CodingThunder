import { readdirSync } from 'fs';
import type FrontMatter from '../../types/FrontMatter';

interface Props {
  posts: Array<FrontMatter | null> 
}

export default function BlogHome(props: Props) {
  return (
    <>
      {props.posts.map((post) => {
        if (post == null) return <></>;
        return (
          <>
            <h1>{post.title}</h1>
          </>
        );
      })}
    </>
  );
}

export async function getStaticProps(){
  const posts = readdirSync('pages/posts').map((slug) => {
    if (slug == 'index.tsx') return null;
    let { frontMatter} = require(`./${slug}/index.mdx`) as { frontMatter: FrontMatter };
    return frontMatter;
  });
  return { props: { posts: posts } };
}
