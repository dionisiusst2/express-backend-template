const dotenv = require('dotenv').config({ path: './config/config.env' });
const connectDB = require('./utils/db');
const fs = require('fs');
const colors = require('colors');

// Load model
const Product = require('./models/Product');

// Read JSON File
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);

connectDB();

const insertData = async () => {
  try {
    await Product.create(products);
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const clearData = async () => {
  try {
    await Product.deleteMany();
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const params = process.argv[2];

if (params === '-i') {
  insertData();

  console.log(`Data Inserted`.green.underline.bold);
} else if (params === '-d') {
  clearData();

  console.log(`Data Cleared`.red.underline.bold);
} else {
  console.log(`Command not valid.. [-i|-d]`.red.underline.bold);
  process.exit();
}
