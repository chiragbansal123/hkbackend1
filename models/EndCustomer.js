const { default: mongoose } = require("mongoose");

const endCustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    shoppedFrom: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EndCustomer = mongoose.model("End Customer", endCustomerSchema);
module.exports = EndCustomer;
