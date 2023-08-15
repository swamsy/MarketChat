const cron = require('node-cron');
const populateDatabase = require('./utilities/populateDatabase');

// Run populateDatabase() every day at 2:00 AM
console.log('Scheduling populateDatabase() to run every day at 2:00 AM');
cron.schedule('0 2 * * *', populateDatabase, {
    timezone: 'America/New_York'
});