import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';
import { Between, Like } from 'typeorm';

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);

    async create(productData: Partial<Product>): Promise<Product> {
        const product = this.productRepository.create(productData);
        return this.productRepository.save(product);
    }

    async findAll(filters: any = {}) {
        const { minPrice, maxPrice, categoryId, search, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const whereClause: any = {};

        if (minPrice && maxPrice) {
            whereClause.price = Between(minPrice, maxPrice);
        }

        if (categoryId) {
            whereClause.category = { id: categoryId };
        }

        if (search) {
            whereClause.name = Like(`%${search}%`);
        }

        return this.productRepository.findAndCount({
            where: whereClause,
            relations: ['category'],
            skip,
            take: limit,
            order: { id: 'DESC' }
        });
    }
}