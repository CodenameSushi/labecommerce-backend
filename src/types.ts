export enum PRODUCT_TYPE {
    ELECTRONICS = "Electronics",
    PERIPHERALS = "Peripherals",
    HARDWARE = "Hardware"
}


export type TUser = {id:string, name:string, email:string, password:string}

export type TProduct = {id:string, name:string, price:number, description:string, image_url:string, category:PRODUCT_TYPE}

export type TPurchase = {id:string, buyerId:string, total_price:number}