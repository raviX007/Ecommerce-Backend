import { AppDataSource } from '../config/database';
import { CartItem } from '../models/CartItem';
import { User } from '../models/User';
import { Product } from '../models/Product';

export class CartService {
    private cartRepository = AppDataSource.getRepository(CartItem);
    private productRepository = AppDataSource.getRepository(Product);

    async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
        const product = await this.productRepository.findOneOrFail({
            where: { id: productId }
        });

        const cartItem = this.cartRepository.create({
            user: { id: userId },
            product,
            quantity,
            priceAtAdd: product.price
        });

        return this.cartRepository.save(cartItem);
    }

    async getCart(userId: number) {
        return this.cartRepository.find({
            where: { user: { id: userId } },
            relations: ['product']
        });
    }

    async clearCart(userId: number): Promise<void> {
        await this.cartRepository.delete({ user: { id: userId } });
    }

    async updateItemQuantity(userId: number, itemId: number, quantity: number): Promise<CartItem> {
        const cartItem = await this.cartRepository.findOneOrFail({
            where: { id: itemId, user: { id: userId } }
        });
        cartItem.quantity = quantity;
        return this.cartRepository.save(cartItem);
    }

    async removeItem(userId: number, itemId: number): Promise<void> {
        await this.cartRepository.delete({
            id: itemId,
            user: { id: userId }
        });
    }
}