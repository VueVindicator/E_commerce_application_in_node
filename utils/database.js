const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    const uri = "mongodb+srv://davetech:0JcSyzCDJFTrtqWl@cluster0-aq6mn.mongodb.net/test?retryWrites=true&w=majority";
    mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err)
    });
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;