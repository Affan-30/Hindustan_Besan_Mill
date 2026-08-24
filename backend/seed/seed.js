import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { toBusinessDate } from "../utils/dateUtils.js";

import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Supplier from "../models/Supplier.js";
import Production from "../models/Production.js";
import WorkerPayment from "../models/WorkerPayment.js";
import OtherPayment from "../models/OtherPayment.js";
import RawMaterialPurchase from "../models/RawMaterialPurchase.js";
import BillPayment from "../models/BillPayment.js";

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toBusinessDate(d);
};

const run = async () => {
  await connectDB();
  // console.log("Clearing existing demo data...");
  // await Promise.all([
  //   User.deleteMany({}),
  //   Worker.deleteMany({}),
  //   Supplier.deleteMany({}),
  //   Production.deleteMany({}),
  //   WorkerPayment.deleteMany({}),
  //   OtherPayment.deleteMany({}),
  //   RawMaterialPurchase.deleteMany({}),
  //   BillPayment.deleteMany({}),
  // ]);

  console.log("Creating admin user...");
  await User.create({
    name: "Mill Owner",
    email: "admin@hindustanbesanmill.com",
    password: "admin123",
    role: "ADMIN",
  });

//   console.log("Creating workers...");
//   const workers = await Worker.insertMany([
//     { name: "Rahul Sharma", mobile: "9876500001", dailyWage: 700, joiningDate: daysAgo(300), status: "Active" },
//     { name: "Suresh Patil", mobile: "9876500002", dailyWage: 650, joiningDate: daysAgo(200), status: "Active" },
//     { name: "Anil Kumar", mobile: "9876500003", dailyWage: 800, joiningDate: daysAgo(150), status: "Active" },
//     { name: "Mahesh Yadav", mobile: "9876500004", dailyWage: 700, joiningDate: daysAgo(90), status: "Active" },
//     { name: "Ganesh Rao", mobile: "9876500005", dailyWage: 600, joiningDate: daysAgo(60), status: "Active" },
//   ]);

//   console.log("Creating suppliers...");
//   const suppliers = await Supplier.insertMany([
//     { name: "Narsinha Agrotech", mobile: "9822200001", address: "Latur, Maharashtra", materialsSupplied: "Chana Dal", status: "Active" },
//     { name: "Balaji Traders", mobile: "9822200002", address: "Solapur, Maharashtra", materialsSupplied: "Watana Dal", status: "Active" },
//     { name: "Shree Grains Co.", mobile: "9822200003", address: "Pune, Maharashtra", materialsSupplied: "Chana Dal, Watana Dal", status: "Active" },
//   ]);

//   console.log("Creating production, payments, purchases and bills for last 20 days...");
//   for (let i = 0; i < 20; i++) {
//     const date = daysAgo(i);

//     await Production.create({
//       date,
//       totalBesanKg: 750 + Math.round(Math.random() * 200),
//       jadaBesanKg: 90 + Math.round(Math.random() * 60),
//       chunniKg: 60 + Math.round(Math.random() * 30),
//       notes: i === 0 ? "Normal production day" : "",
//     });

//     const paidWorkers = workers.slice(0, 3 + (i % 3));
//     for (const w of paidWorkers) {
//       await WorkerPayment.create({
//         date,
//         workerId: w._id,
//         workerNameSnapshot: w.name,
//         amount: w.dailyWage,
//         paymentType: "Daily Wage",
//         paymentMethod: i % 2 === 0 ? "Cash" : "UPI",
//         description: "Daily wage",
//       });
//     }

//     await OtherPayment.create({
//       date,
//       category: "Diesel",
//       description: "Diesel for generator",
//       amount: 1500 + Math.round(Math.random() * 800),
//       paidTo: "Local Fuel Pump",
//       paymentMethod: "Cash",
//     });

//     if (i % 3 === 0) {
//       await OtherPayment.create({
//         date,
//         category: "Transport",
//         description: "Goods transport",
//         amount: 1000 + Math.round(Math.random() * 1000),
//         paidTo: "ABC Transport",
//         paymentMethod: "Cash",
//       });
//     }

//     if (i % 4 === 0) {
//       const supplier = suppliers[i % suppliers.length];
//       const quantity = 500 + Math.round(Math.random() * 700);
//       const rate = 75 + Math.round(Math.random() * 15);
//       const totalAmount = quantity * rate;
//       await RawMaterialPurchase.create({
//         date,
//         material: supplier.materialsSupplied.includes("Chana") ? "Chana Dal" : "Watana Dal",
//         supplierId: supplier._id,
//         supplierNameSnapshot: supplier.name,
//         quantity,
//         unit: "Kg",
//         rate,
//         totalAmount,
//         paymentStatus: "Paid",
//         paidAmount: totalAmount,
//         remainingAmount: 0,
//         paymentMethod: "Bank Transfer",
//         invoiceNumber: `INV-${1000 + i}`,
//       });
//     }

//     if (i % 7 === 0) {
//       await BillPayment.create({
//         date,
//         billType: "Electricity",
//         description: "Monthly electricity bill",
//         amount: 4800 + Math.round(Math.random() * 800),
//         billingPeriod: "August 2026",
//         paymentMethod: "Bank Transfer",
//       });
//     }
//     if (i === 0) {
//       await BillPayment.create({
//         date,
//         billType: "Rent",
//         description: "Mill premises rent",
//         amount: 20000,
//         billingPeriod: "August 2026",
//         paymentMethod: "Bank Transfer",
//       });
//     }
//   }

//   console.log("Seed data created successfully.");
//   console.log("Login with: admin@hindustanbesanmill.com / admin123");
//   await mongoose.disconnect();
//   process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
