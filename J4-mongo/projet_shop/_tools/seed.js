import dotenv from 'dotenv'
import mongoose from 'mongoose'
import data from '../_data/products.json' assert { type: 'json' }
// @todo: Se connecter à Mongoose sur la BDD "nodeshop"

dotenv.config()

const { MONGO_STRING, MONGO_DB_NAME } = process.env

try {
  await mongoose.connect(`${MONGO_STRING}${MONGO_DB_NAME}`)
  console.log('✅ Connecté à la base MongoDB')
}
catch (err) {
  console.error('Erreur de connexion', err.message)
}

// @todo: Définir le schéma de la collection "products"
const ProductSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value >= 0,
        message: 'Price cannot be negative',
      },
    },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: {
      rate: { type: Number, required: true },
      count: { type: Number, required: true },
    },
  },
  { versionKey: false } // Supprime la propriété "__v" ajoutée automatiquement par Mongoose à chaque document
);

const collectionName = 'products'
const ProductsModel = mongoose.model('Products', ProductSchema, collectionName)

try {
  // @todo: Vider la collection "products"
  await ProductsModel.deleteMany({})
  console.log(`✅ Products collection cleaned`)

  // @todo: Remplir la collection "products" avec les données dans '_data/products.json'
  await ProductsModel.create(data)

  // @todo: Afficher un message de confirmation
  console.log(`✅ Database successfully seeded`)
}
catch (err) {
  console.log(`❌ Erreur d'insertion :`, err.message)
}

process.exit(0)