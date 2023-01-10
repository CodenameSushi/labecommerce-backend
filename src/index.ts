import {
  users,
  products,
  purchases,
  createUser,
  getAllUsers,
  createProduct,
  getAllProducts,
  getProductById,
  queryProductsByName,
  createPurchase,
  getAllPurchasesFromUserId,
} from "./database";

createUser("09", "fulano@gmail.com", "senha123");

createPurchase("1", "1", 2, 18000);

console.log(getAllUsers(), products, purchases);

console.log(getAllPurchasesFromUserId('1'));
