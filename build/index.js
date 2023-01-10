"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
(0, database_1.createUser)("09", "fulano@gmail.com", "senha123");
(0, database_1.createPurchase)("1", "1", 2, 18000);
console.log((0, database_1.getAllUsers)(), database_1.products, database_1.purchases);
console.log((0, database_1.getAllPurchasesFromUserId)('1'));
//# sourceMappingURL=index.js.map