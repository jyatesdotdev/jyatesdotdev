const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const dir = path.join(process.cwd(), 'app', 'blog', 'posts');

// Setup dummy data
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < 100; i++) {
    fs.writeFileSync(
      path.join(dir, `post-${i}.mdx`),
      `---\ntitle: Post ${i}\n---\n` + 'Content '.repeat(1000)
    );
  }
}

// Synchronous version (Current)
function getMDXFilesSync(dir) {
  return fs.readdirSync(dir).filter(file => path.extname(file) === '.mdx');
}
function readMDXFileSync(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}
function getMDXDataSync(dir) {
  let mdxFiles = getMDXFilesSync(dir);
  return mdxFiles.map(file => {
    let content = readMDXFileSync(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));
    return { slug, content };
  });
}

// Asynchronous version (Proposed)
async function getMDXFilesAsync(dir) {
  const files = await fs.promises.readdir(dir);
  return files.filter(file => path.extname(file) === '.mdx');
}
async function readMDXFileAsync(filePath) {
  return await fs.promises.readFile(filePath, 'utf-8');
}
async function getMDXDataAsync(dir) {
  let mdxFiles = await getMDXFilesAsync(dir);
  return await Promise.all(
    mdxFiles.map(async file => {
      let content = await readMDXFileAsync(path.join(dir, file));
      let slug = path.basename(file, path.extname(file));
      return { slug, content };
    })
  );
}

function computePrimeSync(n) {
  let count = 0;
  for (let i = 2; count < n; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
}

async function measureThroughput(action, timeMs) {
  let reqs = 0;
  const start = performance.now();
  let end = start;

  // Create background task that increments a counter
  let backgroundTasksCompleted = 0;
  let keepRunning = true;

  (async function backgroundWork() {
    while (keepRunning) {
      await new Promise(r => setTimeout(r, 0));
      backgroundTasksCompleted++;
    }
  })();

  while (end - start < timeMs) {
    await action();
    reqs++;
    end = performance.now();
  }

  keepRunning = false;

  return { reqs, duration: end - start, backgroundTasksCompleted };
}

async function runBenchmark() {
  const durationMs = 2000;

  console.log(`Running benchmark measuring throughput over ${durationMs}ms...`);

  console.log('\nMeasuring Synchronous Implementation (Current Baseline)...');
  const syncResult = await measureThroughput(async () => {
    // Wrap in async to simulate Next.js route handler
    const data = getMDXDataSync(dir);
    return data;
  }, durationMs);

  console.log('\nMeasuring Asynchronous Implementation (Proposed)...');
  const asyncResult = await measureThroughput(async () => {
    const data = await getMDXDataAsync(dir);
    return data;
  }, durationMs);

  console.log(`\n--- Results ---`);
  console.log(
    `Sync (Current) - Reqs: ${syncResult.reqs}, Background Ticks: ${syncResult.backgroundTasksCompleted}`
  );
  console.log(
    `Async (Proposed) - Reqs: ${asyncResult.reqs}, Background Ticks: ${asyncResult.backgroundTasksCompleted}`
  );

  console.log(`\nAnalysis:`);
  console.log(
    `The synchronous version completed ${syncResult.reqs} requests, but the event loop was heavily blocked, only completing ${syncResult.backgroundTasksCompleted} background tasks.`
  );
  console.log(
    `The asynchronous version completed ${asyncResult.reqs} requests, and the event loop was unblocked, completing ${asyncResult.backgroundTasksCompleted} background tasks.`
  );
  console.log(`This demonstrates that the async approach avoids starving the Node.js event loop.`);
}

runBenchmark().catch(console.error);
