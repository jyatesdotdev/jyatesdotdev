export interface LibraryItem {
  title: string
  description: string
  url: string
  category: string
  dateAdded: string
}

export const libraryItems: LibraryItem[] = [
  {
    title: "The Pragmatic Programmer",
    description: "A comprehensive guide to software development that covers everything from personal responsibility to practical coding techniques.",
    url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    category: "books",
    dateAdded: "2024-03-23"
  },
  {
    title: "React Server Components",
    description: "An in-depth look at React's new Server Components architecture and how it changes the way we build web applications.",
    url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
    category: "web-development",
    dateAdded: "2024-03-23"
  },
  {
    title: "TypeScript Deep Dive",
    description: "A comprehensive guide to TypeScript, covering advanced types, compiler options, and best practices.",
    url: "https://basarat.gitbook.io/typescript/",
    category: "programming",
    dateAdded: "2024-03-23"
  }
] 