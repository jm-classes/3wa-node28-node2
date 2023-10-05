import ProductsModel from '../models/Products.js'

export default async function home(req, res) {
  try {
    const products = await ProductsModel.find({}).sort({ _id: -1 }).limit(3)
    res.render('home', { products });
  }
  catch (err) {
    res.status(500).send(`<h1>Erreur 500</h1><p>${err.message}</p>`)
  }
}
