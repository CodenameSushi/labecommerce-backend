import e from "express";
import { TUser, TProduct, TPurchase, PRODUCT_TYPE} from "./types";

export const users:  TUser[] = [{id:'1', email:'teste@gmail.com', password:'123'}, {id:'2', email:'teste2@gmail.com', password:'12345'}]

export const products: TProduct[] = [{id:'1', name:'i9-12900K', price:9000, category:PRODUCT_TYPE.HARDWARE}, {id:'2', name:'Iphone 14', price:7000, category:PRODUCT_TYPE.ELECTRONICS}]

export const purchases: TPurchase[] = [{userId:'1', productId:'2', quantity:2, totalPrice:14000}, {userId:'2', productId:'1', quantity:1, totalPrice:5000} ]

export function createUser(userId:string, userEmail:string, userPassword:string){

    const newUser = {id:userId, email:userEmail, password:userPassword}

    users.push(newUser)
}

export function getAllUsers(){
    return users
}

export function createProduct(productId:string, productName:string, productPrice:number, productCategory:PRODUCT_TYPE ){
    const newProduct = {id:productId, name:productName, price:productPrice, category:productCategory}

    products.push(newProduct)
}

export function getAllProducts(){
    return products
}

export function getAllPurchases(){
    return purchases
}

export function getProductById(idToSearch:string){
   return products.filter((product)=> product.id === idToSearch)
}

export function queryProductsByName(q:string){
    const result = products.filter((product)=> {
        return product.name.toLowerCase().includes(q)
    })
    return result

}

export function createPurchase(userId:string, productId:string, quantity:number, totalPrice:number){
    const newPurchase = {userId:userId, productId:productId, quantity:quantity, totalPrice:totalPrice}
    purchases.push(newPurchase)
}

export function getAllPurchasesFromUserId(userIdToSearch:string){
    return purchases.filter((purchase)=> purchase.userId === userIdToSearch)
}





