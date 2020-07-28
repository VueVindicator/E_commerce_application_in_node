const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}
userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};
// userSchema.methods.getCart = function() {
//     const productsId = this.cart.items.map(i => {
//         return i.productId;
//     });
//     return this.find({ _id: { $in: productsId } }).toArray()
//         .then(products => {
//             return products.map(p => {
//                 return {
//                     ...p,
//                     quantity: this.cart.items.find(item => {
//                         return item.productId.toString() === p._id.toString();
//                     }).quantity
//                 }
//             })
//         })
// }
module.exports = mongoose.model('User', userSchema);
// const mongoDb = require('mongodb');
// const obId = mongoDb.ObjectId;
// const getDb = require('../utils/database').getDb;
// class User{
//     constructor(username, email, cart, id){
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//     static save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//         .then(user => {
//             console.log('User created');
//             return user;
//         })
//         .catch(err => {
//             console.log(err);
//         }) 
//     }
//     addToCart(product){
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if(cartProductIndex >= 0){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         }else{
//             updatedCartItems.push({
//                 productId: new obId(product._id), quantity: newQuantity
//             });
//         }
//         const updatedCart = {
//             items: updatedCartItems
//         };
//         const db = getDb();
//         db.collection('users').updateOne({_id: new obId(this._id)}, {
//             $set: {cart: updatedCart}
//         });
//     }
//     getCart(){
//         const db = getDb();
//         const productsId = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db.collection('products').find({_id: {$in: productsId}}).toArray()
//         .then(products => {
//             return products.map(p => {
//                 return {
//                     ...p, quantity: this.cart.items.find(item => {
//                         return item.productId.toString() === p._id.toString();
//                     }).quantity
//                 }
//             })
//         })
//     }
//     deleteItemFromCart(prodId){
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== prodId.toString();
//         })
//         const db = getDb();
//         return db.collection('users').updateOne({_id: new obId(this._id)}, {
//             $set: {cart: {items: updatedCartItems}}
//         });
//     }
//     addOrder(){
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new obId(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             }
//             return db.collection('orders').insertOne(order);
//         })
//         .then(result => {
//             this.cart = {items: []};
//             return db.collection('users').updateOne(
//                 {_id: new obId(this._id)},
//                 {$set: {
//                     cart: {items: []}
//                 }}
//             )
//         })
//     }
//     getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id': new obId(this._id)}).toArray();
//     }
//     static findById(userId){
//         const db = getDb();
//         return db.collection('users').findOne({_id: new obId(userId)})
//         .then(user => user)
//     }
// }

// module.exports = User;