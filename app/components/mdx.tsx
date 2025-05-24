import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { highlight } from 'sugar-high';
import React from 'react';
import remarkGfm from 'remark-gfm';

function CustomLink(props: any) {
  let href = props.href;

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props: any) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  return <code dangerouslySetInnerHTML={{ __html: highlight(children) }} {...props} />;
}

function BlockQuote({ children }) {
  return (
    <blockquote className="pl-4 border-l-4 border-gray-300 dark:border-gray-700 italic">
      {children}
    </blockquote>
  );
}

function TableHead({ children }) {
  return <thead className="bg-neutral-100 dark:bg-neutral-800">{children}</thead>;
}

function TableRow({ children }) {
  return (
    <tr className="border-b border-neutral-200 dark:border-neutral-700 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
      {children}
    </tr>
  );
}

function TableCell({ children }) {
  return (
    <td className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm">
      {children}
    </td>
  );
}

function TableHeader({ children }) {
  return (
    <th className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 font-medium text-neutral-800 dark:text-neutral-200">
      {children}
    </th>
  );
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  blockquote: BlockQuote,
  thead: TableHead,
  tr: TableRow,
  td: TableCell,
  th: TableHeader,
  tbody: TableBody,
};

export function CustomMDX(props: React.JSX.IntrinsicAttributes & MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  );
}
