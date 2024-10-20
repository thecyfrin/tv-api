const bcrypt = require('bcrypt');

module.exports = {
     hashData: async (data, saltRounds = 15) => {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    },
    
    compareHashData : async (first, second) => {
        const isSame = await bcrypt.compare(first, second);
        return isSame;
    }
}