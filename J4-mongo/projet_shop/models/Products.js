import mongoose from 'mongoose'

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

export default ProductsModel