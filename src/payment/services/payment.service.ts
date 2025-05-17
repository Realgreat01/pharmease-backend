import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, CurrencyTypes } from '../dto/create-payment.dto';
import { ProductPrice } from 'src/common/dto';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/order/entities/order.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/common/config/env.config';
import { randomUUID } from 'crypto';
import {
  OrderPaymentStatus,
  OrderStatus,
} from 'src/order/dto/create-order.dto';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  getExchangeRate() {
    return {
      base: CurrencyTypes.NGN,
      rates: {
        [CurrencyTypes.USD]: 0.00067568,
        [CurrencyTypes.NGN]: 1,
        [CurrencyTypes.EUR]: 0.0005875,
        [CurrencyTypes.GBP]: 0.000559,
      },
    };
  }

  getTotalProductCost(prices: ProductPrice[]): ProductPrice {
    const exchangeRates = this.getExchangeRate().rates;

    const totalInNaira = prices.reduce((accum: number, price: ProductPrice) => {
      const rate = exchangeRates[price.currency];
      if (!rate) {
        throw new Error(
          `Missing exchange rate for currency: ${price.currency}`,
        );
      }

      const convertedPrice = price.amount / rate; // Convert to NGN
      return accum + convertedPrice;
    }, 0);

    return {
      amount: parseFloat(totalInNaira.toFixed(2)),
      currency: CurrencyTypes.NGN,
    };
  }

  async initiatializePayment(userId: string, payload: CreatePaymentDto) {
    const { orderId } = payload;

    const order = await this.orderModel.findById(orderId);
    if (order) {
      if (order.payment_info?.status !== OrderPaymentStatus.PAID) {
        const orderPrice = order.products.map(
          (product): ProductPrice => ({
            amount: product.productId.price.amount * product.quantity,
            currency: product.productId.price.currency,
          }),
        );
        const total_cost = this.getTotalProductCost(orderPrice).amount * 100;
        try {
          const PaystackPrivateKey = this.configService.get<string>(
            EnvConfig.PAYSTACK_PRIVATE_KEY,
          );
          const PaystackPublicKey = this.configService.get<string>(
            EnvConfig.PAYSTACK_PUBLIC_KEY,
          );

          const referenceId = randomUUID();
          const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
              email: order.buyerId.email,
              amount: total_cost,
              reference: referenceId,
              customer: {
                id: order.buyerId.id,
                first_name: order.buyerId.firstname,
                last_name: order.buyerId.lastname,
                name: `${order.buyerId.firstname} ${order.buyerId.lastname}`,
                email: order.buyerId.email,
                phone_number: order.buyerId.phone_number,
              },
              metadata: {
                orderId,
                type: 'ORDER',
                products: order.products.map((item) => ({
                  product: item.productId.name,
                  quantity: item.quantity,
                })),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${PaystackPrivateKey}`,
                'Content-Type': 'application/json',
              },
            },
          );

          if (response.data) {
            const paymentResponse = {
              amount: total_cost,
              access_code: response.data?.data.access_code,
              reference: response.data?.data.reference,
              currency: 'NGN',
              customer: {
                id: order.buyerId.id,
                first_name: order.buyerId.firstname,
                last_name: order.buyerId.lastname,
                name: `${order.buyerId.firstname} ${order.buyerId.lastname}`,
                email: order.buyerId.email,
                phone_number: order.buyerId.phone_number,
              },
              customizations: {
                title: 'Product Order Payment',
                description: `payment for ORDER ${order.id}`,
              },
              publicKey: PaystackPublicKey,
              payment_options: 'card, banktransfer, ussd',
            };
            return paymentResponse;
          }
        } catch (e: any) {
          return e;
        }
      } else {
        throw new ConflictException(
          'Payment has already been completed for this order',
        );
      }
    } else throw new NotFoundException('Order not found');
  }

  async validatePayment(event: any) {
    if (event.event === 'charge.success') {
      const paymentData = event.data;

      if (paymentData.status === 'success') {
        const orderId = paymentData.metadata.orderId;

        await this.orderModel.findByIdAndUpdate(
          orderId,
          {
            status: OrderStatus.PROCESSING,
            payment_info: {
              payment_method: paymentData.channel,
              transactionId: paymentData.reference,
              status: OrderPaymentStatus.PAID,
              amount: 0,
              timestamp: new Date().toISOString(),
            },
            $push: {
              status_history: {
                $each: [
                  {
                    status: OrderStatus.ACCEPTED,
                    timestamp: new Date().toISOString(),
                  },
                  {
                    status: OrderStatus.PROCESSING,
                    timestamp: new Date().toISOString(),
                  },
                ],
              },
            },
          },
          { new: true },
        );
      }
    } else {
      throw new InternalServerErrorException();
    }
  }
}

// const response = {
//   paymentData: {
//     id: 4973192428,
//     domain: 'test',
//     status: 'success',
//     reference: '33690812-b1fc-44b4-bdaf-c19fe114ae25',
//     amount: 18485082,
//     message: null,
//     gateway_response: 'Successful',
//     paid_at: '2025-05-17T11:57:11.000Z',
//     created_at: '2025-05-17T11:56:58.000Z',
//     channel: 'card',
//     currency: 'NGN',
//     ip_address: '102.89.84.207',
//     metadata: { orderId: '68286c1266aadb3e1c4ab30d', products: [Array] },
//     fees_breakdown: null,
//     log: null,
//     fees: 200000,
//     fees_split: null,
//     authorization: {
//       authorization_code: 'AUTH_isnt02pmlp',
//       bin: '408408',
//       last4: '4081',
//       exp_month: '12',
//       exp_year: '2030',
//       channel: 'card',
//       card_type: 'visa ',
//       bank: 'TEST BANK',
//       country_code: 'NG',
//       brand: 'visa',
//       reusable: true,
//       signature: 'SIG_Aq8B0ZKz3g5rhHjeIrB9',
//       account_name: null,
//       receiver_bank_account_number: null,
//       receiver_bank: null,
//     },
//     customer: {
//       id: 274154915,
//       first_name: null,
//       last_name: null,
//       email: 'samsonrealgreat+1@gmail.com',
//       customer_code: 'CUS_1v5odrcs20l0124',
//       phone: null,
//       metadata: null,
//       risk_action: 'default',
//       international_format_phone: null,
//     },
//     plan: {},
//     subaccount: {},
//     split: {},
//     order_id: null,
//     paidAt: '2025-05-17T11:57:11.000Z',
//     requested_amount: 18485082,
//     pos_transaction_data: null,
//     source: {
//       type: 'api',
//       source: 'merchant_api',
//       entry_point: 'transaction_initialize',
//       identifier: null,
//     },
//   },
//   reference: '33690812-b1fc-44b4-bdaf-c19fe114ae25',
// };
