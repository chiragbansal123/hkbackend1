const { default: mongoose } = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    batchNo:{
      type:Number,
      required:true,
    },
    name: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    shelf: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    businessName: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
