const SearchResult = require('../models/SearchResult');
const getLogo = require('./utilities/populateDatabase');

async function fillLogos() {
    try {
        const allResults = await SearchResult.find({ logo: { $exists: false } });
    
        let count = 0;
        console.log("Beginning to fill logos");
        for (const result of allResults) {
            const logoUrl = await getLogo(result.symbol);
            result.logo = logoUrl;
            await result.save();

            count++;
            if (count % 60 === 0) {
                console.log('Reached 60 API calls, waiting for 1 minute...');
                await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds
            }
        }

        console.log('Successfully filled logos for existing entries');
    } catch (err) {
        console.error(err);
    }
};

module.exports = fillLogos;