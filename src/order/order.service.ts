import { PaymentService } from '../payment/services/payment.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateOrderDto,
  OrderStatus,
  StatusHistory,
} from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductPrice } from 'src/common/dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly paymentService: PaymentService,
  ) {}

  create(buyerId: string, createOrderDto: CreateOrderDto) {
    const order = { buyerId, ...createOrderDto };
    const status_history: StatusHistory = {
      user: buyerId,
      timestamp: new Date().toISOString(),
      status: OrderStatus.PENDING,
    };
    return this.orderModel.create({
      ...order,
      status_history,
      status: OrderStatus.PENDING,
    });
  }

  async findAll(buyerId: string) {
    const initOrders = await this.orderModel.find({ buyerId });

    if (!initOrders) throw new NotFoundException('No order found for buyer!');

    const orders = initOrders.map((order) => {
      const orderPrice = order.products.map(
        (product): ProductPrice => ({
          amount: product.productId.price.amount * product.quantity,
          currency: product.productId.price.currency,
        }),
      );
      const total_cost = this.paymentService.getTotalProductCost(orderPrice);
      const formattedOrder = order.toObject();
      return { ...formattedOrder, total_cost };
    });
    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found!');
    const orderPrice = order.products.map(
      (product): ProductPrice => ({
        amount: product.productId.price.amount * product.quantity,
        currency: product.productId.price.currency,
      }),
    );
    const total_cost = this.paymentService.getTotalProductCost(orderPrice);

    const formattedOrder = order.toObject();
    return { ...formattedOrder, total_cost };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
  }

  async updateStatus(id: string, userId: string, status: OrderStatus) {
    const status_history: StatusHistory = {
      user: userId,
      timestamp: new Date().toISOString(),
      status: status,
    };

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status, $push: { status_history } },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async remove(id: string) {
    return await this.orderModel.findByIdAndDelete(id);
  }
}
