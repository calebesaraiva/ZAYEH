const fs = require('node:fs');
const path = require('node:path');

const sourceDir = path.join(__dirname, '..', 'src', 'generated', 'prisma');
const targetDir = path.join(__dirname, '..', 'dist', 'generated', 'prisma');

fs.mkdirSync(path.dirname(targetDir), { recursive: true });

try {
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
} catch (error) {
  const canReuseExistingClient =
    (error.code === 'EPIPE' || error.code === 'EPERM' || error.code === 'EBUSY') &&
    fs.existsSync(targetDir);

  if (!canReuseExistingClient) {
    throw error;
  }

  console.warn(`Prisma client already exists at ${targetDir} and is locked by another process. Reusing it for this build.`);
}

console.log(`Copied Prisma client to ${targetDir}`);
