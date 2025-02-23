import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Category } from "../models/Category";
import { Like } from "typeorm";

export class CategoryController {
  private categoryRepository = AppDataSource.getRepository(Category);

  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const category = this.categoryRepository.create({
        name,
        description,
      });

      await this.categoryRepository.save(category);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error creating category" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      if (search) {
        whereClause.name = Like(`%${search}%`);
      }

      const [categories, total] = await this.categoryRepository.findAndCount({
        where: whereClause,
        skip,
        take: Number(limit),
        order: { id: "DESC" },
        relations: ["products"],
      });

      res.json({
        categories,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await this.categoryRepository.findOne({
        where: { id: Number(id) },
        relations: ["products"],
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await this.categoryRepository.findOne({
        where: { id: Number(id) },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      category.name = name || category.name;
      category.description = description || category.description;

      await this.categoryRepository.save(category);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error updating category" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await this.categoryRepository.findOne({
        where: { id: Number(id) },
        relations: ["products"],
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (category.products && category.products.length > 0) {
        return res.status(400).json({
          message: "Cannot delete category with associated products",
        });
      }

      await this.categoryRepository.remove(category);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  }
}
