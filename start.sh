pm2 start src/ --name "Jobdesk API";
pm2 start src/jobs/auto-absent.js --name "Auto Absent";
pm2 start src/jobs/notifier.js --name "Notifier Script";
pm2 save