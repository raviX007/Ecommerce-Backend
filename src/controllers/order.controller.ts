import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }
    

    async createOrder(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            const order = await this.orderService.createOrder(userId);

            res.status(201).json({
                status: 'success',
                data: order
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getUserOrders(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            const orders = await this.orderService.getUserOrders(userId);

            res.json({
                status: 'success',
                data: orders
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getOrderDetails(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const orderId = parseInt(req.params.orderId);
            const userId = req.user.id;

            const order = await this.orderService.getOrderById(orderId, userId);

            if (!order) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Order not found'
                });
            }

            res.json({
                status: 'success',
                data: order
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const orderId = parseInt(req.params.orderId);
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Status is required'
                });
            }

            const updatedOrder = await this.orderService.updateOrderStatus(
                orderId,
                status
            );

            res.json({
                status: 'success',
                data: updatedOrder
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const orders = await this.orderService.getAllOrders();

            res.json({
                status: 'success',
                data: orders
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async cancelOrder(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const orderId = parseInt(req.params.orderId);
            const userId = req.user.id;

            await this.orderService.cancelOrder(orderId, userId);

            res.json({
                status: 'success',
                message: 'Order cancelled successfully'
            });
        } catch (error:any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}