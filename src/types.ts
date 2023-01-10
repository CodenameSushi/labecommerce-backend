export enum PRODUCT_TYPE {
    ELECTRONICS = "Electronics",
    PERIPHERALS = "Peripherals",
    HARDWARE = "Hardware"
}


export type TUser = {id:string, email:string, password:string}

export type TProduct = {id:string, name:string, price:number, category:PRODUCT_TYPE}

export type TPurchase = {userId:string, productId:string, quantity:number, totalPrice:number}