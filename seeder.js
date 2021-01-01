const dotenv = require('dotenv').config({ path: './config/config.env' });
const connectDB = require('./utils/db');
const fs = require('fs');
const colors = require('colors');

// Load model
const Product = require('./models/Product');
const User = require('./models/User');

// Connect to database

connectDB();

// Read JSON File
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const insertData = async () => {
  try {
    await Product.create(products);
    await User.create(users);

    console.log(`Data Inserted`.green.underline.bold);
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const clearData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log(`Data Cleared`.red.underline.bold);
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const params = process.argv[2];

if (params === '-i') {
  insertData();
} else if (params === '-d') {
  clearData();
} else {
  console.log(`Command not valid.. [-i|-d]`.red.underline.bold);
  process.exit();
}
