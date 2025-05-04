import Link from 'next/link';

interface NavItem {
  name: string;
  external?: boolean;
}

const navItems: Record<string, NavItem> = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
  '/career': {
    name: 'career',
  },
  '/projects': {
    name: 'projects',
  },
  '/library': {
    name: 'library',
  },
  '/contact': {
    name: 'contact',
  },
};

export function Navbar() {
  return (
    <aside className="mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row flex-wrap gap-2">
            {Object.entries(navItems).map(([path, { name, external }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
