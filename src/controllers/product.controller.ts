import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Between, Like } from "typeorm";
import uploadToCloudinary from "../utils/cloudinary";

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);
  private categoryRepository = AppDataSource.getRepository(Category);

  async create(
    req: Request & { file?: Express.Multer.File; fileValidationError?: string },
    res: Response
  ) {
    try {
      const { name, description, price, stock, categoryId } = req.body;

      if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      }
      console.log("category Id", categoryId);
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      let imageUrl: string | undefined = undefined;
      if (req.file) {
        try {
          imageUrl = await uploadToCloudinary(req.file.path);
          if (!imageUrl) {
            return res.status(400).json({ message: "Failed to upload image" });
          }
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Error uploading image" });
        }
      }

      const product = this.productRepository.create({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        imageUrl,
      });

      await this.productRepository.save(product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const {
        minPrice,
        maxPrice,
        categoryId,
        search,
        page = 1,
        limit = 10,
      } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};

      if (minPrice && maxPrice) {
        whereClause.price = Between(Number(minPrice), Number(maxPrice));
      }

      if (categoryId) {
        whereClause.category = { id: Number(categoryId) };
      }

      if (search) {
        whereClause.name = Like(`%${search}%`);
      }

      const [products, total] = await this.productRepository.findAndCount({
        where: whereClause,
        relations: ["category"],
        skip,
        take: Number(limit),
        order: { id: "DESC" },
      });

      res.json({
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  }
  async update(
    req: Request & { file?: Express.Multer.File; fileValidationError?: string },
    res: Response
  ) {
    try {
      console.log("Inside Update");
      const id = Number(req.params.id);
      const { name, description, price, stock, categoryId } = req.body;
      console.log("name", name);
      console.log("des", description);
      console.log("price", price);
      console.log("stock", stock);

      const product = await this.productRepository.findOne({
        where: { id },
        relations: ["category"],
      });
      console.log("found product", product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.log("f1");

      if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      }

      console.log("f2", req.body);

      console.log("categoryId", categoryId);
      if (categoryId) {
        console.log("categoryId", categoryId);
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId },
        });
        console.log("f3");

        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
        console.log("f4");
        product.category = category;
      }

      if (req.file) {
        console.log("f5");
        try {
          const imageUrl = await uploadToCloudinary(req.file.path);
          console.log("new url", imageUrl);
          if (!imageUrl) {
            return res.status(400).json({ message: "Failed to upload image" });
          }

          product.imageUrl = imageUrl;
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Error uploading image" });
        }
      }

      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = Number(price);
      if (stock !== undefined) product.stock = Number(stock);

      const updatedProduct = await this.productRepository.save(product);

      res.json(updatedProduct);
    } catch (error) {
      console.error("Product update error:", error);
      res.status(500).json({ message: "Error updating product" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await this.productRepository.remove(product);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Product deletion error:", error);
      res.status(500).json({ message: "Error deleting product" });
    }
  }
}
