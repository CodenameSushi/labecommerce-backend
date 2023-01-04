import { TUser, TProduct, TPurchase } from "./types";

export const users:  TUser[] = [{id:'1', email:'teste@gmail.com', password:'123'}, {id:'2', email:'teste2@gmail.com', password:'12345'}]

export const products: TProduct[] = [{id:'1', name:'Iphone 13', price:5000, category:'celulares'}, {id:'2', name:'Iphone 14', price:7000, category:'celulares'}]

export const purchases: TPurchase[] = [{userId:'1', productId:'2', quantity:2, totalPrice:14000}, {userId:'2', productId:'1', quantity:1, totalPrice:5000} ]