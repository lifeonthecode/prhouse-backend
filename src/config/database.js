const {mongoose} = require('mongoose');

const connectDatabase = async() => {
    try {

        
        let mongodb_uri = process.env.MONGODB_URI;
        await mongoose.connect(mongodb_uri);
        console.log('Database Connected')
        
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;