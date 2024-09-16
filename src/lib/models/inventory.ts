import { model, models, Schema } from "mongoose"

const InventorySchema = new Schema({
  username: { type: String, required: true, unique: true },
  inventory: [
    {
      productName: { type: String, required: true },
      status: {
        type: String,
        enum: ["Active", "Draft", "Archived"],
        required: true,
      },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now, required: true },
    },
  ],
})

const Inventory = models.Inventory || model("Inventory", InventorySchema)

export default Inventory
