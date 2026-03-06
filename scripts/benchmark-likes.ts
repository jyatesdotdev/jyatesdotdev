import { prisma } from '../app/lib/prisma';
import { NextRequest } from 'next/server';
import { GET } from '../app/api/likes/route';

async function runBenchmark() {
  console.log('Setting up mock data...');
  // Add some mock data to database
  const slug = 'test-post-benchmark';

  // Clean up previous runs
  await prisma.postLike.deleteMany({
    where: { slug },
  });

  // Create 100 likes
  console.log('Creating mock likes...');
  const likesData = Array.from({ length: 100 }).map((_, i) => ({
    slug,
    ipAddress: `192.168.1.${i}`,
  }));

  await prisma.postLike.createMany({
    data: likesData,
  });

  console.log('Running benchmark...');
  const iterations = 50;

  // Mock request
  const req = new NextRequest(`http://localhost:3000/api/likes?slug=${slug}`, {
    headers: {
      'x-forwarded-for': '192.168.1.50',
    },
  });

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    await GET(req);
  }
  const end = performance.now();

  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(`\nBenchmark Results:`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average Time per request: ${avgTime.toFixed(2)}ms`);

  // Clean up
  await prisma.postLike.deleteMany({
    where: { slug },
  });

  // Prisma disconnect
  await prisma.$disconnect();
}

runBenchmark().catch(console.error);
