const express = require('express');
const path = require('path');

const { check, body } = require('express-validator');

const adminController = require('../controllers/admin')

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct)

router.get('/products', isAuth, adminController.getProducts)

router.post('/add-product', [
        body('title')
        .isString()
        .isLength({ min: 3 })
        .trim()
        .withMessage('Title must be alphanumeric and not less that 3 characters'),

        body('price')
        .isFloat()
        .withMessage('Price must be in 2 decimal places'),

        body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
        .withMessage('Description should be at least 5 characters long')
    ],
    adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', [
        body('title')
        .isAlphanumeric()
        .isLength({ min: 3 })
        .trim()
        .withMessage('Title must be alphanumeric and not less that 3 characters'),

        body('imageUrl')
        .isURL()
        .withMessage('Please enter a valid url address'),

        body('price')
        .isFloat()
        .withMessage('Price must be in 2 decimal places'),

        body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
        .withMessage('Description should be at least 5 characters long')
    ],
    isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router;