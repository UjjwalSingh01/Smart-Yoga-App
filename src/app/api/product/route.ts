import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/database/mongodb";
import Product from "@/models/Product";
// import Cors from "cors";

// const cors = Cors({
//   methods: ["GET", "POST", "PATCH", "DELETE"],
//   origin: "*", 
// });

// Helper function to run middleware
// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await runMiddleware(req, res, cors); 
  await dbConnect(); 
  const { method } = req;

  if (method === "GET") {
    try {
      const products = await Product.find({});
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  if (method === "POST") {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }

  if (method === "PATCH") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }

  if (method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
