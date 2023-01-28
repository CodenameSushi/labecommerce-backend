import {
  TUser,
  TProduct,
  TPurchase,
  PRODUCT_TYPE,
  TPurchaseProduct,
} from "./types";

import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db("users").select(
      "id AS id",
      "name as name",
      "email AS email",
      "password AS password",
      "created_at AS createdAt"
    );
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [user] = await db.select("*").from("users").where({ id: id });

    if (!user) {
      res.status(400);
      throw new Error("'id' nao encontrado!");
    }

    const result = await db
      .select(
        "id",
        "paid",
        "buyer_id AS buyerId",
        "total_price AS totalPrice",
        "created_at AS createdAt"
      )
      .from("purchases")
      .where({ buyer_id: id });

    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db
      .select(
        "id AS id",
        "name AS name",
        "price AS price",
        "description AS description",
        "image_url AS imageUrl",
        "category AS category"
      )
      .from("products");
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (q.length < 1) {
      res.status(400);
      throw new Error("'query params' deve possuir pelo menos um caractere.");
    }
    const result = await db
      .select(
        "id AS id",
        "name AS name",
        "price AS price",
        "description AS description",
        "image_url AS imageUrl",
        "category AS category"
      )
      .from("products")
      .whereLike("name", `%${q}%`);
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }

});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [product] = await db
      .select(
        "id AS id",
        "name AS name",
        "price AS price",
        "description AS description",
        "image_url AS imageUrl",
        "category AS category"
      )
      .from("products")
      .where({ id: id });

    if (!product) {
      res.status(400);
      throw new Error("'id' nao encontrada!");
    }

    res.status(200).send(product);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const result = await db
      .select(
        "id AS id",
        "buyer_id AS buyerId",
        "total_price AS totalPrice",
        "created_at AS createdAt",
        "paid AS paid"
      )
      .from("purchases");
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [purchase]: TPurchase[] | undefined[] = await db("purchases").where({
      id: id,
    });

    if (purchase) {
      const [cart] = await db("purchases")
        .select(
          "purchases.id AS purchaseID",
          "purchases.total_price AS totalPrice",
          "purchases.created_at AS createdAt",
          "purchases.paid",
          "users.id AS buyerId",
          "users.email",
          "users.name"
        )
        .innerJoin("users", "purchases.buyer_id", "=", "users.id")
        .where({ "purchases.id": id });

      const purchasesProducts = await db("purchases_products")
        .select(
          "products.name",
          "products.price",
          "products.description",
          "products.image_url AS imageUrl",
          "purchases_products.quantity"
        )
        .innerJoin(
          "products",
          "products.id",
          "=",
          "purchases_products.product_id"
        )
        .where({ purchase_id: id });

      const result = { ...cart, productsList: purchasesProducts };

      res.status(200).send(result);
    } else {
      res.status(400);
      throw new Error("Compra nao encontrada!");
    }
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body as TUser;
    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser do tipo 'string'");
    }

    if (typeof email !== "string") {
      res.status(400);
      throw new Error("'email' deve ser do tipo 'string'");
    }

    if (typeof password !== "string") {
      res.status(400);
      throw new Error("'password' deve ser do tipo 'string'");
    }

    if (!id || !name || !email || !password) {
      res.status(400);
      throw new Error(
        "Dados invalidos! Todos os campos devem ser preenchidos."
      );
    }

    const [user] = await db.select("*").from("users").where({ id: id });

    const [userEmail] = await db
      .select("*")
      .from("users")
      .where({ email: email });

    if (user) {
      res.status(400);
      throw new Error("Id ja cadastrado!");
    }
    if (userEmail) {
      res.status(400);
      throw new Error("Email ja cadastrado!");
    }

    const newUser = {
      id: id,
      name: name,
      email: email,
      password: password,
    };

    await db("users").insert(newUser);
    res.status(201).send("Cadastro realizado com sucesso!");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl, category } =
      req.body as TProduct;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser do tipo 'string'.");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' deve ser do tipo 'string'.");
    }

    if (typeof price !== "number") {
      res.status(400);
      throw new Error("'price' deve ser do tipo 'number'.");
    }

    if (typeof description !== "string") {
      res.status(400);
      throw new Error("'description' deve ser do tipo 'string'");
    }
    if (typeof imageUrl !== "string") {
      res.status(400);
      throw new Error("'image_url' deve ser do tipo 'string'");
    }

    if (
      category !== PRODUCT_TYPE.ELECTRONICS &&
      category !== PRODUCT_TYPE.HARDWARE &&
      category !== PRODUCT_TYPE.PERIPHERALS
    ) {
      res.status(400);
      throw new Error(
        `Category deve ser, ${PRODUCT_TYPE.ELECTRONICS}, ${PRODUCT_TYPE.HARDWARE} ou ${PRODUCT_TYPE.PERIPHERALS}`
      );
    }

    const [product] = await db("products").where({ id: id });

    if (product) {
      res.status(400);
      throw new Error("'id' ja cadastrado!");
    }

    const newProduct = {
      id: id,
      name: name,
      price: price,
      description: description,
      image_url: imageUrl,
      category: category,
    };

    await db("products").insert(newProduct);
    res.status(201).send("Produto cadastrado com sucesso!");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyerId } = req.body as TPurchase;

    let totalPrice = 0;

    const products = req.body.products as TPurchaseProduct[];

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'userId' deve ser do tipo 'string'!");
    }

    if (typeof buyerId !== "string") {
      res.status(400);
      throw new Error("'productId' deve ser do tipo 'string'!");
    }

    if (typeof totalPrice !== "number") {
      res.status(400);
      throw new Error("'quantity' deve ser do tipo 'number'!");
    }

    const [purchase] = await db("purchases").where({ id: id });

    if (purchase) {
      res.status(400);
      throw new Error("ID de compra ja cadastrado.");
    }

    if (typeof products !== "object") {
      res.status(400);
      throw new Error(
        "Products dever ser um Array de objetos nao vazio. Com as seguintes propriedades: productID e quantity."
      );
    }

    if (products.length <= 0) {
      res.status(400);
      throw new Error(
        "É necessário ao menos um produto para cadastrar uma compra!"
      );
    }

    for (let i = 0; i < products.length; i++) {
      const [existingProduct]: TProduct[] | undefined[] = await db(
        "products"
      ).where({ id: products[i].productId });
      if (!existingProduct) {
        res.status(404);
        throw new Error("Produto nao encontrado.");
      }
      if (
        typeof products[i].productId !== "string" ||
        typeof products[i].productId === undefined
      ) {
        res.status(400);
        throw new Error(
          "productId deve ser do tipo 'string' e nao deve ser undefined!"
        );
      }
      if (
        typeof products[i].purchaseId !== "string" ||
        typeof products[i].purchaseId === undefined
      ) {
        res.status(400);
        throw new Error(
          "purchaseId deve ser do tipo 'string' e nao deve ser undefined!"
        );
      }
      if (
        typeof products[i].quantity !== "number" ||
        products[i].quantity <= 0
      ) {
        res.status(400);
        throw new Error("Quantity deve ser um numero e maior que '0'!");
      }
    }

    const [existingBuyer]: TUser[] | undefined[] = await db("users").where({
      id: buyerId,
    });
    if (!existingBuyer) {
      res.status(400);
      throw new Error("buyerID nao encontrado!");
    }

    const newPurchase = {
      id: id,
      buyer_id: buyerId,
      created_at: new Date(Date.now()).toUTCString(),
      total_price: totalPrice,
    };

    await db("purchases").insert(newPurchase);

    for (let i in products) {
      const purchaseProducts = {
        product_id: products[i].productId,
        purchase_id: id,
        quantity: products[i].quantity,
      };
      await db("purchases_products").insert(purchaseProducts);
      const [product]: TProduct[] = await db("products")
        .select("price")
        .where({ id: purchaseProducts.product_id });
      totalPrice += purchaseProducts.quantity * product.price;
    }

    await db("purchases").update({ total_price: totalPrice }).where({ id: id });

    const productsToSend: TProduct[] = await db("products")
      .select(
        "id",
        "name",
        "price",
        "description",
        "image_url AS imageUrl",
        "quantity"
      )
      .innerJoin(
        "purchases_products",
        "products.id",
        "=",
        "purchases_products.product_id"
      )
      .where({ purchase_id: id });

    res.status(201).send({
      message: "Compra realizada com sucesso!",
      newPurchase: { ...newPurchase, products: productsToSend },
    });
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const [user] = await db.raw(`
      SELECT * FROM users
      WHERE id = "${id}";
    `);

    if (!user) {
      res.status(400);
      throw new Error("'id' nao encontrada!");
    }

    await db.raw(`
      DELETE FROM users 
      WHERE id = "${id}";
    `);

    res.status(200).send("Usuario deletado com sucesso!");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const [product] = await db.select("*").from("products").where({ id: id });
    if (!product) {
      res.status(400);
      throw new Error("'id' nao encontrada");
    }
    await db("products").del().where({ id: id });
    res.status(200).send("Produto apagado com sucesso!");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [purchase] = await db("purchases").where({ id: id });

    if (!purchase) {
      res.status(400);
      throw new Error("ID nao encontrada!");
    }

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("ID deve ser do tipo 'string'!");
    }
    if (id[0] !== "o") {
      res.status(400);
      throw new Error("ID de compra deve comecar com a letra 'o'!");
    }
    await db("purchases_products").del().where({ purchase_id: id });
    await db("purchases").del().where({ id: id });

    res.status(200).send("Compra apagada com sucesso!");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, price, description, imageUrl, category } =
      req.body as TProduct;

    if (name !== undefined) {
      if (typeof name !== "string") {
        res.status(400);
        throw new Error("Name deve ser do tipo 'string'!");
      }
      if (name.length < 1) {
        res.status(400);
        throw new Error("Name deve ter pelo menos 1 caractere");
      }
    }

    if (price !== undefined) {
      if (typeof price !== "number") {
        res.status(400);
        throw new Error("Price deve ser do tipo 'number'!");
      }
      if (price < 0) {
        res.status(400);
        throw new Error("Price deve ser maior que 0!");
      }
    }

    if (category !== undefined) {
      if (
        category !== PRODUCT_TYPE.ELECTRONICS &&
        category !== PRODUCT_TYPE.HARDWARE &&
        category !== PRODUCT_TYPE.PERIPHERALS
      ) {
        res.status(400);
        throw new Error(
          `Category dever ser, ${PRODUCT_TYPE.ELECTRONICS}, ${PRODUCT_TYPE.HARDWARE} ou ${PRODUCT_TYPE.PERIPHERALS}`
        );
      }
    }

    const [product]: TProduct[] | undefined[] = await db("products").where({id:id})

    if(product){
      const updatedProduct = {
        name: name || product.name,
        price: isNaN(price) ? product.price : price,
        description: description || product.description,
        image_url: imageUrl || product.imageUrl,
        category: category || product.category
      }
      await db("products").update(updatedProduct).where({id:id})
      res.status(200).send("Produto atualizado com sucesso!")
    }else{
      res.status(400).send("Produto nao encontrado!")
    }

  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});
