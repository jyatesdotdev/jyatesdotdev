export interface LibraryItem {
  title: string;
  description: string;
  url: string;
  category: string;
  dateAdded: string;
}

export const libraryItems: LibraryItem[] = [
  {
    title: 'The Pragmatic Programmer',
    description:
      'A comprehensive guide to software development that covers everything from personal responsibility to practical coding techniques.',
    url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/',
    category: 'books',
    dateAdded: '2025-04-20',
  },
  {
    title: 'TypeScript Deep Dive',
    description:
      'A comprehensive guide to TypeScript, covering advanced types, compiler options, and best practices.',
    url: 'https://basarat.gitbook.io/typescript/',
    category: 'programming',
    dateAdded: '2025-04-20',
  },
  {
    title: 'Designing Data-Driven Application',
    description:
      'An absolutely excellent book that is worth a read for any software engineer that touches distributed systems!',
    url: 'https://dataintensive.net',
    category: 'books',
    dateAdded: '2025-05-04',
  }
];
