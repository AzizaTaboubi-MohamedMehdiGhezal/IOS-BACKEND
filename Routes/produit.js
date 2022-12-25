import express from 'express'
const router = express.Router()

import * as productController from '../Controllers/productController.js'


router.post('/add_prod', productController.addNewProduct)
router.get('/produits',productController.getAll)
router.post('/update_prod',productController.UpdateProduct)
router.post('/delete_prod',productController.deletee)
router.get('/getByUserID/:userID',productController.getByUserID)
router.post('/serch_prod',productController.rechercherProduit)
export default router
