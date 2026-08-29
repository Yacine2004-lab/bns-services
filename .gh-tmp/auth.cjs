#!/usr/bin/env node
/**
 * GitHub Auth Login Script
 * Opens browser for authentication
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(process.cwd(), '.gh-tmp', 'auth.log');
const tmpDir = path.join(process.cwd(), '.gh-tmp');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Kill any existing gh auth processes
try {
  spawn('taskkill', ['/F', '/IM', 'gh.exe'], { stdio: 'ignore' });
} catch {}

// Start gh auth login
const logStream = fs.openSync(LOG_FILE, 'w');
const child = spawn('gh', ['auth', 'login', '--web', '--hostname', 'github.com', '--git-protocol', 'https'], {
  detached: true,
  stdio: ['ignore', logStream, logStream],
  shell: true,
  env: {
    ...process.env,
    Path: [process.env.Path, process.env.USERPROFILE + '\\AppData\\Local\\Programs\\Git\\cmd'].filter(Boolean).join(';')
  }
});

child.unref();

console.log('Authentication process started (PID: ' + child.pid + ')');
console.log('Log file: ' + LOG_FILE);

// Wait for URL to appear
setTimeout(() => {
  try {
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    const urlMatch = content.match(/https:\/\/github\.com\/login\/device[^\s]*/);
    if (urlMatch) {
      console.log('\n========================================');
      console.log('Authorization URL:');
      console.log(urlMatch[0]);
      console.log('========================================\n');
      
      // Open browser
      const url = urlMatch[0];
      spawn('powershell', ['-Command', 'Start-Process \'' + url + '\''], { 
        stdio: 'ignore', 
        windowsHide: true 
      });
      console.log('Browser opened automatically');
    } else {
      console.log('Log content:');
      console.log(content);
    }
  } catch (e) {
    console.log('Error reading log: ' + e.message);
  }
}, 3000);
