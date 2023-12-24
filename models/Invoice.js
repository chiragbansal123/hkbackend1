// const { default: mongoose } = require("mongoose");
// // const moment = require("moment-timezone");

// const invoiceSchema = new mongoose.Schema(
//   {
//     createdAt: {
//       type: Date,
//       default: function () {
//         const currentDate = new Date();
//         const offsetMilliseconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
//         return new Date(currentDate.getTime() + offsetMilliseconds);
//       },
//     },
//     id: {
//       type: String,
//     },
//     invoiceNo: {
//       type: Number,
//       required: true,
//     },
//     cart: [
//       {
//         _id: false,
//         id: {
//           type: String,
//         },
//         name: {
//           type: String,
//           required: true,
//         },
//         salt: {
//           type: String,
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         cartUnit: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//         shelf: {
//           type: String,
//           required: true,
//         },
//         customer: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     name: {
//       type: String,
//       required: true,
//     },
//     mobile: {
//       type: Number,
//       required: true,
//     },
//     billAmount: {
//       type: Number,
//       required: true,
//     },
//     email: {
//       type: String,
//     },
//     businessName: {
//       type: String,
//       required: true,
//     },
//     invoiceDate: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Invoice = mongoose.model("Invoice", invoiceSchema);
// module.exports = Invoice;

const { default: mongoose } = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: function () {
        const currentDate = new Date();
        const offsetMilliseconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours and 30 minutes in milliseconds

        return new Date(currentDate.getTime() + offsetMilliseconds);
      },
    },
    id: {
      type: String,
    },
    invoiceNo: {
      type: Number,
      required: true,
    },
    cart: [
      {
        _id: false,
        id: {
          type: String,
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
        cartUnit: {
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
          type: String,
          required: true,
        },
        discount: {
          type: Number,
        },
        discountedPrice: {
          type: Number,
        },
        shelf: {
          type: String,
          required: true,
        },
        customer: {
          type: String,
          required: true,
        },
      },
    ],
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    billAmount: {
      type: Number,
      required: true,
    },
    billProfit: {
      type: Number,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
