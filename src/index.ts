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
import { TUser, TProduct, TPurchase } from "./types";
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





createUser("09", "fulano@gmail.com", "senha123");

createPurchase("1", "1", 2, 18000);

console.log(getAllUsers(), products, purchases);

console.log(queryProductsByName('i9'));
