import mongoose from "mongoose";

const currenciesSchema = new mongoose.Schema(
  {
    amount: Number,
    base: String,
    date: String,
    rates: [
      {
        currency: String,
        name: String,
        rate: Number,
        symbol: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Currencies =
  mongoose.models.Currencies || mongoose.model("Currencies", currenciesSchema);
export default Currencies;
