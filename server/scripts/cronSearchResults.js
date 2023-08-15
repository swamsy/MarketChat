const cron = require('node-cron');
const { updateSearchResults } = require('../utilities/updateSearchResults');

// Run updateSearchResults() every day at 2:00 AM
cron.schedule('10 19 * * *', () => {
    console.log('Running updateSearchResults() at 2:00 AM EST');
    updateSearchResults();
  }, {
    timezone: 'America/New_York'
  });