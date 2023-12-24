const express = require("express");
const Stock = require("../models/Stock");
const router = express.Router();
const userController = require("../controllers/usersController");
router.get("/getdata", async function (req, res) {
  console.log("inside getdata");
  return res.json({ id: 1, message: "Successfully fetched" });
});
router.post("/register", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/logout", userController.logOut);
router.post("/createStock", userController.createStock);
router.get("/getStock/:id", userController.getStock);
router.post("/updateStock/:id", userController.updateStock);
router.post("/updateStockAfterBill", userController.updateStockAfterBill);
router.post("/outOfStock", userController.outOfStock);
router.post("/createInvoice", userController.createInvoice);
router.get("/getInvoice", userController.getInvoice);
router.get("/getAllInvoice/:id", userController.getAllInvoice);
router.get("/getEndCustomers/:id", userController.getEndCustomers);

router.post("/bulkUpload", userController.bulkUpload);
// router.get(
//   "/getEndCxAllInvoice/:businessName/:mobile",
//   userController.getEndCxAllInvoice
// );
router.get("/getEndCxAllInvoice", userController.getEndCxAllInvoice);
router.get("/getTodaySales/:id", userController.getTodaySales);
router.get("/getThisMonthSales/:id", userController.getThisMonthSales);
router.get("/getLastMonthSales/:id", userController.getLastMonthSales);

router.get("/getCustomers/:id", userController.getCustomers);
router.get("/getTodaysAllInvoice/:id", userController.getTodaysAllInvoice);
router.get("/getThisMonthInvoice/:id", userController.getThisMonthInvoice);
router.get("/getLastMonthInvoice/:id", userController.getLastMonthInvoice);

// router.get(
//   "/getThisMonthAvgOrderValue/:id",
//   userController.getThisMonthAvgOrderValue
// );

router.get("/getRangeInvoices", userController.getRangeInvoices);
router.get("/ordersSortAsc/:id", userController.ordersSortAsc);
router.get("/ordersSortDsc/:id", userController.ordersSortDsc);
router.post("/changePassword", userController.changePassword);

module.exports = router;
