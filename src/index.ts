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
  res.status(200).send(getAllUsers())
})

app.get("/users/:id/purchases", (req:Request, res:Response) => {
  const id = req.params.id
  const result = purchases.filter((purchase) => {
    return purchase.userId === id
  })
  res.status(200).send(result)
})

app.get("/products", (req:Request, res:Response) => {
  res.status(200).send(getAllProducts())
})

app.get("/products/search", (req:Request, res:Response) => {
  const q = req.query.q as string 
  // const result = products.filter((product) => {
  //   return product.name.toLowerCase().includes(q)
  // })
  res.status(200).send(queryProductsByName(q))
})

app.get("/products/:id", (req:Request, res:Response) => {
  const id = req.params.id
  const result = products.find((product) => {
    return product.id === id
  }) 
res.status(200).send(result)

})

app.get("/purchases", (req:Request, res:Response) => {
  res.status(200).send(getAllPurchases())
})


app.post("/users", (req:Request, res:Response) => {
  const {id, email, password} = req.body as TUser
  createUser(id, email, password)
  res.status(201).send("Cadastro realizado com sucesso!")
})

app.post("/products", (req:Request, res:Response) => {
  const {id, name, price, category} = req.body as TProduct
  createProduct(id, name, price, category)
  res.status(201).send("Produto cadastrado com sucesso!")
})

app.post("/purchases", (req:Request, res:Response) => {
  const {userId, productId, quantity, totalPrice} = req.body as TPurchase
  createPurchase(userId, productId, quantity, totalPrice)
  res.status(201).send("Compra realizada com sucesso!")
})

app.delete("/users/:id", (req:Request, res:Response) => {
  const id = req.params.id
  const userIndex = users.findIndex((user) => {
    return user.id === id
  })
  if(userIndex >= 0){
    users.splice(userIndex,1)
    res.status(200).send("Usuario deletado com sucesso!")
  }else{
    res.status(404).send("Usuario nao encontrado!")
  }
})

app.delete("/products/:id", (req:Request, res:Response) => {
  const id = req.params.id
  const productIndex = products.findIndex((product)=>{
    return product.id === id
  })
  if(productIndex >= 0){
    products.splice(productIndex,1)
    res.status(200).send("Produto apagado com sucesso!")
  }else{
    res.status(404).send("Produto nao encontrado!")
  }
})

app.put("/users/:id", (req:Request, res:Response) => {
  const id = req.params.id

  const newEmail = req.body.email as string | undefined
  const newPassword = req.body.password as string | undefined

  const user = users.find((user) => {
    return user.id === id
  })

  if(user){
    user.email = newEmail || user.email
    user.password = newPassword || user.password
    res.status(200).send("Usuario editado com sucesso!")
  }else{
    res.status(404).send("Usuario nao encontrado")
  }

})

app.put("/products/:id", (req:Request, res:Response) => {
  const id = req.params.id
  const newName = req.body.name as string | undefined
  const newPrice = req.body.price as number | undefined
  const newCategory = req.body.category as PRODUCT_TYPE | undefined

  const product = products.find((product) => {
    return product.id === id
  })
  if(product){
    product.name = newName || product.name
    product.price = newPrice || product.price
    product.category = newCategory || product.category
    res.status(200).send("Produto editado com sucesso!")
  }else{
    res.status(404).send("Produto nao encontrado!")
  }
})





createUser("09", "fulano@gmail.com", "senha123");

createPurchase("1", "1", 2, 18000);

console.log(getAllUsers(), products, purchases);

console.log(queryProductsByName('i9'));
