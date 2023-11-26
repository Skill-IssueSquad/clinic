const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payTransitSchema = new Schema({
  totalPrice: {
    type: Number,
    required: true,
  },
  items: [
    {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
    },
  ],
  payload: {
    type: JSON,
    required: true,
  },
  postURL: {
    type: String,
    required: true,
  },
});

const payTransitModel = mongoose.model("PaymentTransit", payTransitSchema);
module.exports = payTransitModel;
