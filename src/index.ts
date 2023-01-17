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
  getAllPurchases
} from "./database";
import { TUser, TProduct, TPurchase, PRODUCT_TYPE } from "./types";
import express, {Request, Response} from "express";
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors())

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003")
})

app.get("/users", (req:Request, res:Response) => {
  try {
    res.status(200).send(getAllUsers())
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message)
  }
})

app.get("/users/:id/purchases", (req:Request, res:Response) => {
try {
    const id = req.params.id
    const result = purchases.filter((purchase) => purchase.userId === id)
    const idExist = users.find((user) => user.id === id)

    if(!idExist){
      res.status(400)
      throw new Error("'id' nao encontrado!");
      
    }


  res.status(200).send(result)
} catch (error:any) {
  console.log(error)
  if(res.statusCode === 200){
    res.status(500)
  }
  res.send(error.message)
}



})

app.get("/products", (req:Request, res:Response) => {
  try {
    res.status(200).send(getAllProducts())
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
  
  


})

app.get("/products/search", (req:Request, res:Response) => {
  try {
    const q = req.query.q as string 
    if(q.length < 1){
      res.status(400)
      throw new Error("'query params' deve possuir pelo menos um caractere.");
    }
    res.status(200).send(queryProductsByName(q))
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
    
  }
  
  
  
  
  // const result = products.filter((product) => {
  //   return product.name.toLowerCase().includes(q)
  // })
  
})

app.get("/products/:id", (req:Request, res:Response) => {
  try {
    const id = req.params.id
    const result = products.find((product) => product.id === id) 
    if(!result){
      res.status(400)
      throw new Error("'id' nao encontrado!");
    }
  res.status(200).send(result)
    
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
  


})

app.get("/purchases", (req:Request, res:Response) => {
  res.status(200).send(getAllPurchases())
})


app.post("/users", (req:Request, res:Response) => {
  try {
    const {id, email, password} = req.body as TUser
    const idExists = users.find((user) => user.id === id )
    const emailExists = users.find((user) => user.email === email)
    
    if(typeof id !== 'string'){
      res.status(400)
      throw new Error("'id' deve ser do tipo 'string'");
    }

    if(typeof email !== 'string'){
      res.status(400)
      throw new Error("'email' deve ser do tipo 'string'");
    }

    if(typeof password !== 'string'){
      res.status(400)
      throw new Error("'password' deve ser do tipo 'string'");
    }

    if(idExists){
      res.status(400)
      throw new Error("'id' ja cadastrado!");
    }

    if(emailExists){
      res.status(400)
      throw new Error("'email' ja cadastrado!");
    }

    createUser(id, email, password)
    res.status(201).send("Cadastro realizado com sucesso!")
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
  
 
})

app.post("/products", (req:Request, res:Response) => {
try {
  const {id, name, price, category} = req.body as TProduct
  const idExists = products.find((product) => product.id === id)

  if(typeof id !== 'string'){
    res.status(400)
    throw new Error("'id' deve ser do tipo 'string'.");
  }

  if(typeof name !== 'string'){
    res.status(400)
    throw new Error("'name' deve ser do tipo 'string'.");
  }

  if(typeof price !== 'number'){
    res.status(400)
    throw new Error("'price' deve ser do tipo 'number'.");
  }
  if(
    category !== PRODUCT_TYPE.ELECTRONICS &&
    category !== PRODUCT_TYPE.HARDWARE &&
    category !== PRODUCT_TYPE.PERIPHERALS
    ){
      res.status(400)
      throw new Error("'category' deve ser de um tipo valido: Electronics, Hardware ou Peripherals");
    }
    if(idExists){
      res.status(400)
      throw new Error("Esse 'id' ja existe!");
    }


  createProduct(id, name, price, category)
  res.status(201).send("Produto cadastrado com sucesso!")
} catch (error:any) {
  console.log(error)
  if(res.statusCode === 200){
    res.status(500)
  }
  res.send(error.message)
}




  
})

app.post("/purchases", (req:Request, res:Response) => {
  try {
    const {userId, productId, quantity, totalPrice} = req.body as TPurchase

    const userIdExist = users.find((user) => user.id === userId)
    const productIdExist = products.find((product) => product.id === productId)
    

    if(typeof userId !== 'string'){
      res.status(400)
      throw new Error("'userId' deve ser do tipo 'string'!");
    }

    if(typeof productId !== 'string'){
      res.status(400)
      throw new Error("'productId' deve ser do tipo 'string'!");
    }

    if(typeof quantity !== 'number'){
      res.status(400)
      throw new Error("'quantity' deve ser do tipo 'number'!");
    }

    if(typeof totalPrice !== 'number'){
      res.status(400)
      throw new Error("'totalPrice' deve ser do tipo 'number'!");
    }
    
    if(!userIdExist){
      res.status(400)
      throw new Error("'userId' nao encontrado!");
    }

    if(!productIdExist){
      res.status(400)
      throw new Error("'productId' nao encontrado!");
    }

    if(totalPrice !== productIdExist.price*quantity){
      res.status(400)
      throw new Error("O valor do 'totalPrice' esta incorreto!");
    }

    createPurchase(userId, productId, quantity, totalPrice)
    res.status(201).send("Compra realizada com sucesso!")
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
})

app.delete("/users/:id", (req:Request, res:Response) => {
  try {
    const id = req.params.id
  const userIndex = users.findIndex((user) => user.id === id)
  if(userIndex >= 0){
    users.splice(userIndex,1)
    res.status(200).send("Usuario deletado com sucesso!")
  }else{
    res.status(404)
    throw new Error("Usuario nao existe!");
    
  }
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }


  
})

app.delete("/products/:id", (req:Request, res:Response) => {

  try {
    const id = req.params.id
    const productIndex = products.findIndex((product)=> product.id === id)
    if(productIndex >= 0){
      products.splice(productIndex,1)
      res.status(200).send("Produto apagado com sucesso!")
    }else{
      res.status(404)
      throw new Error("Produto nao existe!");
    }
    } catch (error:any) {
      console.log(error)
      if(res.statusCode === 200){
        res.status(500)
      }
      res.send(error.message)
    }


  
})

app.put("/users/:id", (req:Request, res:Response) => {
  try {
    const id = req.params.i
    const newEmail = req.body.email 
    const newPassword = req.body.password 

    const user = users.find((user) => user.id === id)

    if(id !== undefined){
      if(typeof id !== 'string'){
      res.status(400)
      throw new Error("'id' deve ser do tipo 'string'!");
      }
   }

    if(newEmail !== undefined){
      if(typeof newEmail !== 'string'){
      res.status(400)
      throw new Error("'email' deve ser do tipo 'string'!");
     }
    }

    if(newPassword !== undefined){
      if(typeof newPassword !== 'string'){
        res.status(400)
        throw new Error("'password' deve ser do tipo 'string'!");
      }
    }

  if(user){
    user.email = newEmail || user.email
    user.password = newPassword || user.password
    res.status(200).send("Usuario editado com sucesso!")
  }else{
    res.status(404)
    throw new Error("Usuario nao existe!");
  }

  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }


  

})

app.put("/products/:id", (req:Request, res:Response) => {

  try {
    const id = req.params.id
    const newName = req.body.name
    const newPrice = req.body.price
    const newCategory = req.body.category
    const product = products.find((product) => product.id === id)

    if(id !== undefined){
      if(typeof id !== 'string'){
        res.status(400)
        throw new Error("'id' deve ser do tipo 'string'!");
      }
    }

    if(newName !== undefined){
      if(typeof newName !== 'string'){
        res.status(400)
        throw new Error("'name' deve ser do tipo 'string'!");
      }
    }

    if(newPrice !== undefined){
      if(typeof newPrice !== 'number'){
        res.status(400)
        throw new Error("'price' deve ser do tipo 'number'!");
      }
    }

    if(newCategory !== undefined){
      if(newCategory !== PRODUCT_TYPE.ELECTRONICS &&
        newCategory !== PRODUCT_TYPE.HARDWARE &&
        newCategory !== PRODUCT_TYPE.PERIPHERALS ){
        res.status(400)
        throw new Error("'category' deve ser do tipo: Electronics, Hardware ou Peripherals!");
      }
    }
  
    if(product){
    product.name = newName || product.name
    product.price = newPrice || product.price
    product.category = newCategory || product.category
    res.status(200).send("Produto editado com sucesso!")
  }else{
    res.status(404)
    throw new Error("Produto nao existe!");
    
  }
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }


  
})





createUser("09", "fulano@gmail.com", "senha123");

createPurchase("1", "1", 2, 18000);

console.log(getAllUsers(), products, purchases);

console.log(queryProductsByName('i9'));
