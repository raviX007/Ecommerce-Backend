
import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { JwtPayload } from '../types/auth.types';

export class CartController {
    private cartService: CartService;

    constructor() {
        this.cartService = new CartService();
    }

    async addItem(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            const { productId, quantity } = req.body;

            if (!productId || !quantity || quantity < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid product ID or quantity'
                });
            }

            const cartItem = await this.cartService.addToCart(
                userId,
                productId,
                quantity
            );

            res.status(201).json({
                status: 'success',
                data: cartItem
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getCart(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            const cartItems = await this.cartService.getCart(userId);

            res.json({
                status: 'success',
                data: cartItems
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async updateItemQuantity(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            const itemId = parseInt(req.params.itemId);
            const { quantity } = req.body;

            if (!quantity || quantity < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid quantity'
                });
            }

            const updatedItem = await this.cartService.updateItemQuantity(
                userId,
                itemId,
                quantity
            );

            res.json({
                status: 'success',
                data: updatedItem
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async removeItem(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            const itemId = parseInt(req.params.itemId);

            await this.cartService.removeItem(userId, itemId);

            res.json({
                status: 'success',
                message: 'Item removed from cart'
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async clearCart(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            await this.cartService.clearCart(userId);

            res.json({
                status: 'success',
                message: 'Cart cleared successfully'
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}
