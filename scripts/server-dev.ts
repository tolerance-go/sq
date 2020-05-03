import { spawn } from 'child_process';

const watch = spawn('chokidar', ['docs/**/*.service.ts', '-c', 'yarn build:server:apidoc']);

watch.stdout.on('data', (data) => {
  console.log(`watch:stdout: ${data}`);
});

watch.stderr.on('data', (data) => {
  console.error(`watch:stderr: ${data}`);
});

watch.on('close', (code, signal) => {
  console.log(`watch: 子进程退出，退出信号 ${signal}`);
});

const dev = spawn('yarn', ['dev:server']);

dev.stdout.on('data', (data) => {
  console.log(`dev:stdout: ${data}`);
});

dev.stderr.on('data', (data) => {
  console.error(`dev:stderr: ${data}`);
});

dev.on('close', (code, signal) => {
  console.log(`dev: 子进程退出，退出信号 ${signal}`);
});

process.on('SIGINT', () => {
  watch.kill('SIGINT');
  dev.kill('SIGINT');
});
