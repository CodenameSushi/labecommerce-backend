import { TUser, TProduct, TPurchase } from "./types";

import express, {Request, Response} from "express";
import cors from 'cors';
import { db } from "./database/knex";

const app = express();
app.use(express.json())
app.use(cors())

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003")
})

app.get("/users", async (req:Request, res:Response) => {
  try {
    const result = await db.raw(`
      SELECT * FROM users;
    `)
    res.status(200).send(result)
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message)
  }
})

app.get("/users/:id/purchases", async (req:Request, res:Response) => {
try {
  const id = req.params.id

  const [ user ] = await db.raw(`
    SELECT * FROM users WHERE id = "${id}"
  `)

  if(!user){
    res.status(400)
    throw new Error("'id' nao encontrado!");
    
  }
    
  const result = await db.raw(`
    SELECT * FROM purchases 
    WHERE buyer_id = "${id}";
  `)


  res.status(200).send(result)
} catch (error:any) {
  console.log(error)
  if(res.statusCode === 200){
    res.status(500)
  }
  res.send(error.message)
}



})

app.get("/products", async (req:Request, res:Response) => {
  try {
    const result = await db.raw(`
      SELECT * FROM products;
    `)
    res.status(200).send(result)
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
  
  


})

app.get("/products/search", async (req:Request, res:Response) => {
  try {
    const q = req.query.q as string 
    if(q.length < 1){
      res.status(400)
      throw new Error("'query params' deve possuir pelo menos um caractere.");
    }
    const result = await db.raw(`
    SELECT * FROM products WHERE name LIKE "%${q}%";
    
    `)
    res.status(200).send(result)
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

app.get("/products/:id", async (req:Request, res:Response) => {
  try {
    const id = req.params.id

    const [ product ] = await db.raw(`
      SELECT * FROM products WHERE id = "${id}";
    `)

    if(!product){
      res.status(400)
      throw new Error("'id' nao encontrada!");
      
    }

  res.status(200).send(product)
    
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
  


})

app.get("/purchases", async (req:Request, res:Response) => {
  const result = await db.raw(`
    SELECT * FROM purchases;
  `)
  res.status(200).send(result)
})


app.post("/users", async (req:Request, res:Response) => {
  try {
    const {id, name, email, password} = req.body as TUser
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

    await db.raw(`
      INSERT INTO users(id,name, email,password)
      VALUES("${id}","${name}","${email}","${password}")
    `)
    res.status(201).send("Cadastro realizado com sucesso!")
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
  
 
})

app.post("/products", async (req:Request, res:Response) => {
try {
  const {id, name, price, description, image_url, category} = req.body as TProduct

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
  
  if(description !== 'string'){
    res.status(400)
    throw new Error("'description' deve ser do tipo 'string'");
    
  }
  if(image_url !== 'string'){
    res.status(400)
    throw new Error("'image_url' deve ser do tipo 'string'");
  }



  await db.raw(`
    INSERT INTO products(id,name,price,description,image_url,category)
    VALUES("${id}","${name}","${price}","${description}","${image_url}","${category})
  `)
  res.status(201).send("Produto cadastrado com sucesso!")
} catch (error:any) {
  console.log(error)
  if(res.statusCode === 200){
    res.status(500)
  }
  res.send(error.message)
}




  
})

app.post("/purchases", async (req:Request, res:Response) => {
  try {
    const {id, buyerId, total_price} = req.body as TPurchase

    

    if(typeof id !== 'string'){
      res.status(400)
      throw new Error("'userId' deve ser do tipo 'string'!");
    }

    if(typeof buyerId !== 'string'){
      res.status(400)
      throw new Error("'productId' deve ser do tipo 'string'!");
    }

    if(typeof total_price !== 'number'){
      res.status(400)
      throw new Error("'quantity' deve ser do tipo 'number'!");
    }

    

    await db.raw(`
      INSERT INTO purchases(id,buyerId,total_price)
      VALUES("${id}","${buyerId}","${total_price}")
    `)
    res.status(201).send("Compra realizada com sucesso!")
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
})

app.delete("/users/:id", async (req:Request, res:Response) => {
  try {
    const id = req.params.id
    const [ user ] = await db.raw(`
      SELECT * FROM users
      WHERE id = "${id}";
    `)

    if(!user){
      res.status(400)
      throw new Error("'id' nao encontrada!");
    }

    await db.raw(`
      DELETE FROM users 
      WHERE id = "${id}";
    `)
  
    res.status(200).send("Usuario deletado com sucesso!")
  
  } catch (error:any) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }


  
})

app.delete("/products/:id", async (req:Request, res:Response) => {

  try {
    const id = req.params.id
    const [ product ] = await db.raw(`
      SELECT * FROM products
      WHERE id = "${id}";
    `)
    if(!product){
      res.status(400)
      throw new Error("'id' nao encontrada");
    }
      await db.raw(`
        DELETE FROM products
        WHERE id = "${id}";
      `)
      res.status(200).send("Produto apagado com sucesso!")
  
    } catch (error:any) {
      console.log(error)
      if(res.statusCode === 200){
        res.status(500)
      }
      res.send(error.message)
    }


  
})

// app.put("/users/:id", (req:Request, res:Response) => {
//   try {
//     const id = req.params.i
//     const newEmail = req.body.email 
//     const newPassword = req.body.password 

//     const user = users.find((user) => user.id === id)

//     if(id !== undefined){
//       if(typeof id !== 'string'){
//       res.status(400)
//       throw new Error("'id' deve ser do tipo 'string'!");
//       }
//    }

//     if(newEmail !== undefined){
//       if(typeof newEmail !== 'string'){
//       res.status(400)
//       throw new Error("'email' deve ser do tipo 'string'!");
//      }
//     }

//     if(newPassword !== undefined){
//       if(typeof newPassword !== 'string'){
//         res.status(400)
//         throw new Error("'password' deve ser do tipo 'string'!");
//       }
//     }

//   if(user){
//     user.email = newEmail || user.email
//     user.password = newPassword || user.password
//     res.status(200).send("Usuario editado com sucesso!")
//   }else{
//     res.status(404)
//     throw new Error("Usuario nao existe!");
//   }

//   } catch (error:any) {
//     console.log(error)
//     if(res.statusCode === 200){
//       res.status(500)
//     }
//     res.send(error.message)
//   }


  

// })

// app.put("/products/:id", (req:Request, res:Response) => {

//   try {
//     const id = req.params.id
//     const newName = req.body.name
//     const newPrice = req.body.price
//     const newCategory = req.body.category
//     const product = products.find((product) => product.id === id)

//     if(id !== undefined){
//       if(typeof id !== 'string'){
//         res.status(400)
//         throw new Error("'id' deve ser do tipo 'string'!");
//       }
//     }

//     if(newName !== undefined){
//       if(typeof newName !== 'string'){
//         res.status(400)
//         throw new Error("'name' deve ser do tipo 'string'!");
//       }
//     }

//     if(newPrice !== undefined){
//       if(typeof newPrice !== 'number'){
//         res.status(400)
//         throw new Error("'price' deve ser do tipo 'number'!");
//       }
//     }

//     if(newCategory !== undefined){
//       if(newCategory !== PRODUCT_TYPE.ELECTRONICS &&
//         newCategory !== PRODUCT_TYPE.HARDWARE &&
//         newCategory !== PRODUCT_TYPE.PERIPHERALS ){
//         res.status(400)
//         throw new Error("'category' deve ser do tipo: Electronics, Hardware ou Peripherals!");
//       }
//     }
  
//     if(product){
//     product.name = newName || product.name
//     product.price = newPrice || product.price
//     product.category = newCategory || product.category
//     res.status(200).send("Produto editado com sucesso!")
//   }else{
//     res.status(404)
//     throw new Error("Produto nao existe!");
    
//   }
//   } catch (error:any) {
//     console.log(error)
//     if(res.statusCode === 200){
//       res.status(500)
//     }
//     res.send(error.message)
//   }


  
// })




