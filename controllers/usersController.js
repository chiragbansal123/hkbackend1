const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Stock = require("../models/Stock");
const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const EndCustomer = require("../models/EndCustomer");

module.exports.signUp = async function (req, res) {
  const { email, password, worksAt } = req.body;
  try {
    const oldCustomer = await Customer.findOne({ email });
    console.log("oldCustomer", oldCustomer);
    if (oldCustomer)
      return res.status(404).json({ message: "Customer already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const data = await Customer.create({
      email,
      password: hashedPassword,
      worksAt,
    });
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

module.exports.signIn = async function (req, res) {
  const { email, password } = req.body;
  const customer = await Customer.findOne({ email });
  if (!customer) {
    return res.status(400).json({ message: "User doesn't exist" });
  }
  const isMatch = await bcrypt.compare(password, customer.password);
  console.log(isMatch);
  if (!isMatch) {
    console.log("password incorrect");
    return res.status(400).json({ message: "Entered wrong password" });
  }
  if (customer.isLoggedIn) {
    console.log("logged in already");
    return res.status(400).json({ message: "Already Logged In" });
  }

  customer.isLoggedIn = true;
  await customer.save();
  // console.log(customer);

  const token = jwt.sign(
    { id: customer.id },
    "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5NDYxMjQ0MSwiaWF0IjoxNjk0NjEyNDQxfQ.mwBASH4P62kXmAhivpz5JVAK4JRnVvysRg-nwm-h8qM"
  );
  const data = {
    id: customer._id,
    email: customer.email,
    worksAt: customer.worksAt,
  };
  return res.status(201).json({ data, token });
};

module.exports.logOut = async function (req, res) {
  const { email } = req.body;
  // console.log("line 53 -> ", email);
  const customer = await Customer.findOne({ email });
  customer.isLoggedIn = false;
  customer.save();
  return res.status(201).json({ message: "logged out successfully!" });
};

module.exports.createStock = async function (req, res) {
  const {
    name,
    salt,
    quantity,
    costPrice,
    price,
    expiry,
    shelf,
    customer,
    worksAt,
  } = req.body;
  console.log("84 -> ", req.body);
  const stock = await Stock.create({
    name: name,
    salt: salt,
    quantity: quantity,
    costPrice: costPrice,
    price: price,
    expiry: expiry,
    shelf: shelf,
    customer: customer,
    businessName: worksAt,
  });
  console.log("->>>", stock);
  const businessStock = await Stock.findOne({ businessName: worksAt });
  // console.log(businessName);
  if (businessStock) {
    return res.json({ stock, data: { message: "stock created Successfully" } });
  }
};

module.exports.getStock = async function (req, res) {
  const client = req.params.id;
  const data = await Stock.find({ businessName: { $in: client } }).sort({[expiry]:-1});
  return res.status(200).json(data);
};

module.exports.updateStock = async function (req, res) {
  const id = req.params.id;
  const data = await Stock.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(200).json(data);
};

module.exports.updateStockAfterBill = async function (req, res) {
  const { id, cartUnit } = req.body;

  const data = await Stock.find({ _id: { $in: id } });

  const newData = await Stock.findByIdAndUpdate(
    id,
    {
      quantity: data[0].quantity - cartUnit,
    },
    { new: true }
  );
  return res.status(200).json(newData);
};

module.exports.outOfStock = async function (req, res) {
  const { id, name, salt, quantity, price, shelf, customer, inStock, worksAt } =
    req.body;

  const data = await Stock.findByIdAndUpdate(req.body, { new: true });
  return res.status(200).json(data);
};

module.exports.createInvoice = async function (req, res) {
  const {
    // id,
    cart,
    name,
    mobile,
    email,
    // createdAt,
    billAmount,
    billProfit,
    invoiceDate,
    businessName,
  } = req.body;

  const invoice = await Invoice.find({ businessName: businessName });
  var newInvoiceNo;
  if (invoice.length == 0) {
    newInvoiceNo = 100;
  } else {
    newInvoiceNo = invoice[invoice.length - 1].invoiceNo + 1;
  }
  console.log("-------------->>>>>", cart);
  console.log(
    "-------------->>>>> ----->",
    // id,
    " ",
    name,
    " ",
    mobile,
    " ",
    email,
    " ",
    cart,
    " ",
    billAmount,
    " ",
    businessName
  );
  const newInvoice = await Invoice.create({
    // id: id,
    invoiceNo: newInvoiceNo,
    cart: cart,
    name: name,
    mobile: mobile,
    email: email,
    // createdAt: Date(),
    billAmount: billAmount,
    billProfit: billProfit,
    invoiceDate: Date(),
    businessName: businessName,
  });

  console.log("--->", newInvoiceNo);

  const isCxExists = await EndCustomer.findOne({
    mobile: mobile,
    shoppedFrom: businessName,
  });
  console.log("--->", isCxExists);
  var endCustomer;
  if (isCxExists == null) {
    endCustomer = await EndCustomer.create({
      name: name,
      mobile: mobile,
      shoppedFrom: businessName,
    });
  }

  return res.status(200).json(newInvoice);
};

module.exports.getInvoice = async function (req, res) {
  console.log(req.query);
  const invoiceNo = req.query.id;
  const businessName = req.query.businessName;
  console.log(invoiceNo);
  const allInvoices = await Invoice.find({ businessName: businessName });
  const invoice = await allInvoices.filter(
    (item) => item.invoiceNo == invoiceNo
  );
  console.log("->>> ", invoice[0].cart);

  return res.status(200).json(invoice);
};

module.exports.getAllInvoice = async function (req, res) {
  const businessName = req.params.id;
  const allInvoices = await Invoice.find({ businessName: businessName });
  return res.status(200).json(allInvoices);
};

module.exports.getEndCustomers = async function (req, res) {
  const businessName = req.params.id;
  console.log(businessName);
  const phone = req.params.phone;
  const allEndCustomers = await EndCustomer.find({
    shoppedFrom: businessName,
  });
  console.log(allEndCustomers);
  return res.status(200).json(allEndCustomers);
};

module.exports.getEndCxAllInvoice = async function (req, res) {
  const mob = req.query.mobile;
  // console.log(mob);
  const businessName = req.query.businessName;
  // console.log(businessName, "->", businessName);
  const allInvoices = await Invoice.find({
    mobile: mob,
    businessName: businessName,
  });
  // console.log(allInvoices);
  return res.status(200).json(allInvoices);
};

module.exports.getTodaySales = async function (req, res) {
  const businessName = req.params.id;
  // console.log(businessName, "->", businessName);
  const TodayActualDate = new Date();

  // Date().substring(0, 15);
  console.log("259 -->", TodayActualDate);
  const allInvoices = await Invoice.find({
    businessName: businessName,
  });
  const todayInvoices = allInvoices.filter(
    (item) =>
      item.createdAt.getFullYear() == TodayActualDate.getFullYear() &&
      item.createdAt.getMonth() == TodayActualDate.getMonth() &&
      item.createdAt.getDate() == TodayActualDate.getDate()

    // (item) => item.invoiceDate?.substring(0, 15) == TodayActualDate
  );

  var todaySales = 0;
  todayInvoices?.map((item) => (todaySales += item.billAmount));

  // var todayRevenue = todaySales;
  // if (todaySales >= 1000 && todaySales < 100000) {
  //   const rounded = Math.round(todaySales / 100) / 10;
  //   todayRevenue = `${rounded}k`;
  // } else if (todaySales >= 100000 && todaySales < 10000000) {
  //   const rounded = Math.round(todaySales / 1000) / 100;
  //   todayRevenue = `${rounded}L`;
  // } else if (todaySales >= 10000000) {
  //   const rounded = Math.round(todaySales / 1000) / 100;
  //   todayRevenue = `${rounded}Cr.`;
  // }

  // console.log(todaySales);
  return res.status(200).json(todaySales);
};

module.exports.getThisMonthSales = async function (req, res) {
  const businessName = req.params.id;
  const allInvoices = await Invoice.find({
    businessName: businessName,
  });

  const todayDate = new Date();

  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();

  const thisMonthInvoices = allInvoices.filter(
    (item) =>
      item.createdAt.getFullYear() == currentYear &&
      item.createdAt.getMonth() == currentMonth
  );

  var thisMonthSales = 0;
  thisMonthInvoices?.map((item) => (thisMonthSales += item.billAmount));

  // console.log("Line 273", thisMonthSales);

  return res.status(200).json(thisMonthSales);
};

module.exports.getCustomers = async function (req, res) {
  const businessName = req.params.id;
  // console.log(businessName);
  const phone = req.params.phone;
  const allEndCustomers = await EndCustomer.find({
    shoppedFrom: businessName,
  });
  // console.log(allEndCustomers);
  return res.status(200).json(allEndCustomers.length);
};

module.exports.getTodaysAllInvoice = async function (req, res) {
  const businessName = req.params.id;
  // const date = req.query.date;
  const TodayActualDate = new Date();
  const allInvoices = await Invoice.find({ businessName: businessName });
  const todaysInvoice = allInvoices.filter(
    (item) =>
      item.createdAt.getFullYear() == TodayActualDate.getFullYear() &&
      item.createdAt.getMonth() == TodayActualDate.getMonth() &&
      item.createdAt.getDate() == TodayActualDate.getDate()
  );

  // console.log(todaysInvoice);
  return res.status(200).json(todaysInvoice);
};

module.exports.getThisMonthInvoice = async function (req, res) {
  const businessName = req.params.id;
  const allInvoices = await Invoice.find({
    businessName: businessName,
  });

  const todayDate = new Date();

  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();

  const thisMonthInvoices = allInvoices.filter(
    (item) =>
      item.createdAt.getFullYear() == currentYear &&
      item.createdAt.getMonth() == currentMonth
  );

  return res.status(200).json(thisMonthInvoices);
};

module.exports.getLastMonthInvoice = async function (req, res) {
  const currentDate = new Date();

  // Calculate the month and year of the previous month
  let previousMonth = currentDate.getMonth() - 1;
  let previousYear = currentDate.getFullYear();

  if (previousMonth == 0) {
    // If the previous month is negative, subtract 1 from the year and set the month to 11 (December)
    previousMonth = 11;
    previousYear -= 1;
  }

  // Create a new Date object for the first day of the previous month
  const previousMonthDate = new Date(previousYear, previousMonth, 1);
  // previousMonth = previousMonthDate.toLocaleString("default", {
  //   month: "long",
  // });

  previousMonth = previousMonthDate.getMonth();

  const businessName = req.params.id;
  const allInvoices = await Invoice.find({
    businessName: businessName,
  });

  const lastMonthInvoices = allInvoices.filter(
    (item) =>
      item.createdAt.getMonth() == previousMonth &&
      item.createdAt.getFullYear() == previousYear
  );

  return res.status(200).json(lastMonthInvoices);
};

module.exports.getLastMonthSales = async function (req, res) {
  const currentDate = new Date();

  // Calculate the month and year of the previous month
  let previousMonth = currentDate.getMonth() - 1;
  let previousYear = currentDate.getFullYear();

  if (previousMonth == 0) {
    // If the previous month is negative, subtract 1 from the year and set the month to 11 (December)
    previousMonth = 11;
    previousYear -= 1;
  }

  // Create a new Date object for the first day of the previous month
  const previousMonthDate = new Date(previousYear, previousMonth, 1);
  // previousMonth = previousMonthDate.toLocaleString("default", {
  //   month: "long",
  // });

  previousMonth = previousMonthDate.getMonth();

  const businessName = req.params.id;
  const allInvoices = await Invoice.find({
    businessName: businessName,
  });

  const lastMonthInvoices = allInvoices.filter(
    (item) =>
      item.createdAt.getMonth() == previousMonth &&
      item.createdAt.getFullYear() == previousYear
  );

  var lastMonthSales = 0;
  lastMonthInvoices?.map((item) => (lastMonthSales += item.billAmount));

  return res.status(200).json(lastMonthSales);
};

module.exports.getRangeInvoices = async function (req, res) {

  const startDate = req.query.start; // invoiceByRReplace with your start date
  const endDate = req.query.end; // Replace with your end dated
  const newEndDay = parseInt(endDate.substring(8, 10)) + 1; // coz $lte in following try block is not taking today date
  const newEndDate = endDate.substring(0, 8) + newEndDay;

  const businessName = req.query.businessName;
  console.log(startDate, newEndDate);
  // Execute the query to find records in the date range
  try {
    var invoiceByRange = await Invoice.find({
      businessName: businessName,
      createdAt: {
        $gte: startDate,
        $lte: newEndDate,
      },
    });
    console.log(invoiceByRange.length);
    return res.status(200).json(invoiceByRange);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Not Found" });
  }
};

module.exports.ordersSortAsc = async function (req, res) {
  const businessName = req.params.id;
  const allInvoices = await Invoice.find({
    businessName: businessName,
    // check for today/thismonth/lastmonth/alltime req
  }).sort({ createdAt: 1 });
  console.log("asc");
  // const sorted = await allInvoices.find()
  return res.status(200).json(allInvoices);
};

module.exports.ordersSortDsc = async function (req, res) {
  const businessName = req.params.id;
  const allInvoices = await Invoice.find({
    businessName: businessName,
    // check for today/thismonth/lastmonth/alltime req
  }).sort({ createdAt: -1 });
  console.log("dsc");
  // const sorted = await allInvoices.find()
  return res.status(200).json(allInvoices);
};

module.exports.bulkUpload = async function (req, res) {
  const dataArray = req.body.data;
  const client = req.body.client;
  const stock = await Stock.find({ businessName: { $in: client } });
  dataArray.forEach((row) => {
    const item = stock.filter((item) => item.name == row.name);
    if (item.length == 0) {
      Stock.create(row);
}});

  return res.status(201).json({ message: "Data received successfully" });
};

module.exports.changePassword = async function (req, res) {
  const email = req.query.email;
  const newPwd = req.query.newPwd;
  const oldPwd = req.query.oldPwd;

  console.log(email, " -> ", newPwd);

  const user = await Customer.findOne({ email });

  const isMatch = await bcrypt.compare(oldPwd, user.password);
  console.log(isMatch);
  if (!isMatch) {
    console.log("Incorrect old password");
    console.log(oldPwd);
    return res.status(400).json({ message: "Entered wrong old password" });
  }
  const hashedPassword = await bcrypt.hash(newPwd, 12);

  user.password = hashedPassword;
  user.save();
  return res.status(200).json({ message: "Password changed" });
};
