const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    //render the pug file to the browser. view has already been declared in the app.js file
    Product.find()
        .populate('userId')
        .then((products) => {
            console.log(products);
            res.render('shop/product-list', {
                path: '/products',
                pageTitle: 'All products',
                prods: products,
                // hasProducts: products.length > 0,
                activeShop: true,
                productsCss: true,
                //isAuthenticated: req.session.loggedIn
            });
        }).catch((err) => {
            console.log(err);
        });
    //like props in vue
    //console.log(products.products);
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products',
            //isAuthenticated: req.session.loggedIn
        })
    }).catch((err) => {
        console.log(err);
    })
}

exports.getIndex = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/index', {
            path: '/',
            pageTitle: 'Shop',
            prods: products,
            //isAuthenticated: req.session.loggedIn,
            //csrfToken: req.csrfToken()
        });
    }).catch((err) => {
        console.log(err);
    })
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            console.log(products)
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                //isAuthenticated: req.session.loggedIn
            });
        })
        .catch(err => console.log(err));
};
// Cart.getCart(cart => {
//     Product.fetchAll(products => {
//         const cartProducts = [];
//         if(cart !== null){
//             console.log(cart);
//             for(product of products){
//                 const cartData = cart.products.find(prod => prod.id === product.id);
//                 if(cartData){
//                     cartProducts.push({productData: product, qty: cartData.qty});
//                 }
//             }
//         }
//    
//     })
// })

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                //isAuthenticated: req.session.loggedIn
            });
        })
        .catch(err => console.log(err));
};