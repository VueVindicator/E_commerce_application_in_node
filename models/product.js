const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
module.exports = mongoose.model('Product', productSchema);

// const mongoDb = require('mongodb');
// const obId = mongoDb.ObjectId;
// const getDb = require('../utils/database').getDb;

// class Product {
//     constructor(title, price, description, imageUrl, id, userId){
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ?  new obId(id): null;
//         this.userId = userId;
//     }

//     save(){
//         const db = getDb();
//         let dbOp;
//         if(this._id){
//             dbOp = db.collection('products').updateOne({_id: this.id}, {$set: this})
//         }else{
//             dbOp = db.collection('products').insertOne(this)
//         }
//         return dbOp
//         .then(result => console.log(result))
//         .catch(err => console.log(err));

//     }

//     static fetchAll(){
//         const db = getDb();
//         return db.collection('products').find().toArray()
//         .then(products => {
//             console.log(products);
//             return products;
//         })
//         .catch(err => console.log(err));
//     }

//     static findById(prodId){
//         const db = getDb();
//         return db.collection('products').find({_id: new mongoDb.ObjectId(prodId)}).next()
//         .then(product => {
//             console.log(product);
//             return product;
//         })
//         .catch(err => console.log(err));
//     }

//     static deleteId(prodId){
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongoDb.ObjectId(prodId)})
//         .then(() => console.log('Deleted'))
//         .catch((err) => console.log(err));
//     }
// }

// // const Product = sequelize.define('product', {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     title: Sequelize.STRING,
// //     price: {
// //         type: Sequelize.DOUBLE,
// //         allowNull: false
// //     },
// //     imageUrl: {
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },
// //     description: {
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     }
// // });

// module.exports = Product;