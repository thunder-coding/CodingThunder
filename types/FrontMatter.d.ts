export default interface FrontMatter {
    title: string;
    ogImage?: string;
    description: string;
    publishedTime: string;
    modifiedTime?: string;
    tags: ReadonlyArray<string>;
  }