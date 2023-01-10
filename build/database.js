"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.queryProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchases = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [{ id: '1', email: 'teste@gmail.com', password: '123' }, { id: '2', email: 'teste2@gmail.com', password: '12345' }];
exports.products = [{ id: '1', name: 'i9-12900K', price: 9000, category: types_1.PRODUCT_TYPE.HARDWARE }, { id: '2', name: 'Iphone 14', price: 7000, category: types_1.PRODUCT_TYPE.ELECTRONICS }];
exports.purchases = [{ userId: '1', productId: '2', quantity: 2, totalPrice: 14000 }, { userId: '2', productId: '1', quantity: 1, totalPrice: 5000 }];
function createUser(userId, userEmail, userPassword) {
    const newUser = { id: userId, email: userEmail, password: userPassword };
    exports.users.push(newUser);
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(productId, productName, productPrice, productCategory) {
    const newProduct = { id: productId, name: productName, price: productPrice, category: productCategory };
    exports.products.push(newProduct);
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function getProductById(idToSearch) {
    return exports.products.filter((product) => product.id === idToSearch);
}
exports.getProductById = getProductById;
function queryProductsByName(q) {
    return exports.products.find((product) => product.name.toLowerCase() === q.toLowerCase());
}
exports.queryProductsByName = queryProductsByName;
function createPurchase(userId, productId, quantity, totalPrice) {
    const newPurchase = { userId: userId, productId: productId, quantity: quantity, totalPrice: totalPrice };
    exports.purchases.push(newPurchase);
}
exports.createPurchase = createPurchase;
function getAllPurchasesFromUserId(userIdToSearch) {
    return exports.purchases.filter((purchase) => purchase.userId === userIdToSearch);
}
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
//# sourceMappingURL=database.js.map