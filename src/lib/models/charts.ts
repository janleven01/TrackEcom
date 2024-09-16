import { model, models, Schema } from "mongoose"

interface ChartDataDocument extends Document {
  username: string
  data: {
    date: string
    desktop: number
    mobile: number
  }[]
  stats: {
    label: string
    value: number
    growthRate: number
  }[]
}

const ChartDataSchema = new Schema({
  username: { type: String, required: true, unique: true },
  data: [
    {
      date: { type: String, required: true },
      desktop: { type: Number, required: true },
      mobile: { type: Number, required: true },
    },
  ],
  stats: [
    {
      label: { type: String, required: true, default: 0 },
      value: { type: Number, required: true, default: 0 },
      growthRate: { type: Number, required: true, default: 0 },
    },
  ],
})

const ChartData =
  models.ChartData || model<ChartDataDocument>("ChartData", ChartDataSchema)

export default ChartData
