pm2 start src/ --name "Jobdesk API";
pm2 start src/jobs/auto-absent --name "Auto Absent";
pm2 start src/jobs/notifier --name "Notifier Script";
pm2 save