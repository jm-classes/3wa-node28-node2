import ProductsModel from '../models/Products.js'

export default async function products(req, res) {
  try {
    const products = await ProductsModel.find()
    res.render('products', { products });
  }
  catch (err) {
    res.status(500).send(`<h1>Erreur 500</h1><p>${err.message}</p>`)
  }
}
