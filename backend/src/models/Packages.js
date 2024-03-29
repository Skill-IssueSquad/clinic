const mongoose = require("mongoose");

const packagesSchema = new mongoose.Schema({
  packageType: {
    type: String,
    required: true,
    unique: true,
  },
  price_per_year: {
    type: Number,
    required: true,
  },
  discountOnSession: {
    type: Number,
    required: true,
  },
  discountOnMedicinePurchase: {
    type: Number,
    required: true,
  },
  discountOnFamilySubscription: {
    type: Number,
    required: true,
  },
});

const Packages = mongoose.model("Packages", packagesSchema);
module.exports = Packages;
