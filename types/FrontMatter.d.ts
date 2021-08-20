export default interface FrontMatter {
  title: string;
  ogImage?: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  tags: ReadonlyArray<string>;
}
