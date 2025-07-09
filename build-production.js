// Simple production build script that doesn't rely on vite/esbuild being in devDependencies
import { spawn } from 'child_process';
import { existsSync } from 'fs';

console.log('Starting production build...');

// Function to run command and wait for completion
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: 'inherit',
      shell: true 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

try {
  // First try to install all dependencies (including dev)
  await runCommand('npm', ['install']);
  
  // Build frontend
  await runCommand('npx', ['vite', 'build']);
  
  // Build backend
  await runCommand('npx', ['esbuild', 'server/index.ts', '--platform=node', '--packages=external', '--bundle', '--format=esm', '--outdir=dist']);
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}