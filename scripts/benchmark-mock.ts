import { NextRequest } from 'next/server';

// Mock Prisma with 50ms latency for each operation
const mockPrisma = {
  postLike: {
    count: async () => {
      await new Promise(r => setTimeout(r, 50));
      return 10;
    },
    findFirst: async () => {
      await new Promise(r => setTimeout(r, 50));
      return { id: 1 };
    },
  },
};

async function runSequential() {
  const start = performance.now();
  const likeCount = await mockPrisma.postLike.count();
  const userHasLiked = await mockPrisma.postLike.findFirst();
  const end = performance.now();
  return end - start;
}

async function runConcurrent() {
  const start = performance.now();
  const [likeCount, userHasLiked] = await Promise.all([
    mockPrisma.postLike.count(),
    mockPrisma.postLike.findFirst(),
  ]);
  const end = performance.now();
  return end - start;
}

async function benchmark() {
  console.log('Running benchmark (simulated 50ms DB latency)...');

  // Warmup
  await runSequential();
  await runConcurrent();

  let seqTotal = 0;
  let conTotal = 0;
  const iterations = 10;

  for (let i = 0; i < iterations; i++) {
    seqTotal += await runSequential();
    conTotal += await runConcurrent();
  }

  console.log(`Sequential average: ${(seqTotal / iterations).toFixed(2)}ms`);
  console.log(`Concurrent average: ${(conTotal / iterations).toFixed(2)}ms`);
  console.log(`Improvement: ${(((seqTotal - conTotal) / seqTotal) * 100).toFixed(2)}%`);
}

benchmark().catch(console.error);
