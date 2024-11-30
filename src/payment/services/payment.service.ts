import { Injectable } from '@nestjs/common';
import { CurrencyTypes } from '../dto/create-payment.dto';
import { ProductPrice } from 'src/product/dto/create-product.dto';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor() {}

  getExchangeRate() {
    return {
      base: CurrencyTypes.USD,
      rates: {
        [CurrencyTypes.USD]: 1,
        [CurrencyTypes.LRD]: 0.03342,
        [CurrencyTypes.NGN]: 0.07,
        [CurrencyTypes.EUR]: 1.15,
        [CurrencyTypes.GBP]: 1.21,
      },
    };
  }

  getTotalProductCost(prices: ProductPrice[]): ProductPrice {
    const exchangeRates = this.getExchangeRate().rates;

    const totalInBaseCurrency = prices.reduce(
      (accum: number, price: ProductPrice) => {
        const rate = exchangeRates[price.currency] || 1;
        const convertedPrice = price.amount * rate;
        return accum + convertedPrice;
      },
      0,
    );

    return {
      amount: parseFloat(totalInBaseCurrency.toFixed(2)),
      currency: CurrencyTypes.USD,
    };
  }
}
