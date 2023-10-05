import ProductsModel from "../models/Products.js";

export async function BasketAddController(req, res) {
  const { product_id } = req.params;

  try {
    const product = await ProductsModel.findById(product_id)
    if (!product) {
      return res.status(404).send(`<h1>Produit non trouvé</h1>`)
    }

    req.session.user.basket.push(product)
    res.redirect('/basket')
  }
  catch (err) {
    res.status(500).send(`<h1>Erreur</h1><p>${err.message}</p>`)
  }
}

export function BasketController(req, res) {
  const basketItems = req.session.user.basket;
  res.render('basket', { basketItems })
}

export function BasketRemoveController(req, res) {
  const { product_id } = req.params;

  req.session.user.basket = req.session.user.basket.filter(item => {
    return item._id !== product_id
  });

  res.redirect('/basket')
}