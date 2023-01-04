"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchases = exports.products = exports.users = void 0;
exports.users = [{ id: '1', email: 'teste@gmail.com', password: '123' }, { id: '2', email: 'teste2@gmail.com', password: '12345' }];
exports.products = [{ id: '1', name: 'Iphone 13', price: 5000, category: 'celulares' }, { id: '2', name: 'Iphone 14', price: 7000, category: 'celulares' }];
exports.purchases = [{ userId: '1', productId: '2', quantity: 2, totalPrice: 14000 }, { userId: '2', productId: '1', quantity: 1, totalPrice: 5000 }];
//# sourceMappingURL=database.js.map