module.exports = {
  apps: [
    {
      name: 'Student Manager',
      script: 'dist/main.js',
      max_memory_restart: '1G',
      autorestart: true,
      cwd: __dirname,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      ref: 'origin/master',
      repo: 'git@github.com:vyvc-comartek/student-manager-mongo.git',
      'pre-deploy-local': 'pnpm run build',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
