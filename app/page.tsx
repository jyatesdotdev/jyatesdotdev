import Image from 'next/image';
import { Timeline } from 'app/components/timeline';
import { Projects } from 'app/components/projects';
import { RecentBlogPosts } from 'app/components/recent-blog-posts';
import { getBlogPosts, formatDate } from 'app/blog/utils';

const careerTimeline = [
  {
    title: 'Senior Software Developer',
    company: 'INVIDI Technologies',
    startDate: 'June 2022',
    endDate: 'Present',
    location: 'Princeton, NJ | Hybrid',
    description: [
      'Managing multi-region Kubernetes clusters in AWS and GCP.',
      'Developed Java microservices for AWS and GCP deployments, collaborating with product owners for streamlined processes.',
      'Mentored new hires through onboarding and pair programming, reducing ramp-up time by 50%.',
      'Instituted real-time performance dashboards, significantly reducing outage response times.'
    ],
    logo: '/logos/invidi.svg',
  },
  {
    title: 'Software Developer',
    company: 'INVIDI Technologies',
    startDate: 'Jan 2017',
    endDate: 'June 2022',
    location: 'Newtown, PA | Hybrid',
    description: [
      'Engineered and deployed Java and C/C++ applications globally, reducing latency for end-users worldwide.',
      'Implemented new version control procedures, decreasing post-release issues and transitioning to an agile cloud framework.',
      'Presented learning sessions to promote knowledge sharing and to foster innovation within development teams.'
    ],
    logo: '/logos/invidi.svg',
  },
  {
    title: 'Associate Software Developer',
    company: 'INVIDI Technologies',
    startDate: 'Nov 2015',
    endDate: 'Dec 2016',
    location: 'Newtown, PA | On-site',
    description: [
      'Identified and fixed bugs in C/C++ codebases using GDB, reducing system crashes.',
      'Developed emulation tools for comprehensive testing, saving on hardware purchases.'
    ],
    logo: '/logos/invidi.svg',
  },
  // Add more career items as needed
];

export default async function Page() {
  // Fetch recent blog posts
  const allPosts = await getBlogPosts();

  // Pre-format dates on the server
  for (const post of allPosts) {
    post.metadata.formattedDate = await formatDate(post.metadata.publishedAt, false);
  }

  // Sort posts by date (newest first) and get the most recent 3
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 3);

  return (
    <section className="w-full">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10 mb-12">
        <div className="relative flex-shrink-1 aspect-square s:w-48 md:w-56 lg:w-64 xl:w-72">
          <Image
            src="/images/profile.jpeg"
            alt="Profile picture"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="flex-grow max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Jonathan Yates</h1>
          <p className="text-neutral-400 mb-4">Senior Software Developer</p>
          <h2>Meet Jonathan: The Infrastructure Alchemist</h2>
          <br />
          <p className="text-neutral-200 text-base">
            By day, he's a senior software engineer bending Java and Python to his will. By night,
            he's the mastermind of a meticulously crafted home lab—spinning up K3s clusters on
            Proxmox, conjuring dynamic DNS updates with BIND9 and DHCP, and orchestrating VLANs like
            a symphony conductor of packets. He's the kind of dev who doesn't just build — he
            automates, monitors, and refactors with surgical precision. Ad tech may pay the bills,
            but his real passion lies in clean architecture, elegant systems, and making his
            networks smarter than most startups. Powered by caffeine, curiosity, and just a touch of
            ADHD-fueled hyperfocus, Jonathan's not afraid of complexity — he invites it, then tames
            it with Terraform and YAML.
          </p>
        </div>
      </div>

      {/* Career Timeline */}
      <div className="mt-12 w-full">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">Career Timeline</h2>
        <Timeline items={careerTimeline} />
      </div>

      {/* Recent Blog Posts */}
      <div className="mt-12 w-full">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">Recent Blog Posts</h2>
        <RecentBlogPosts posts={recentPosts} />
        <div className="mt-6 text-right">
          <a href="/blog" className="text-neutral-400 hover:text-neutral-300 text-sm">
            View all posts →
          </a>
        </div>
      </div>
    </section>
  );
}
