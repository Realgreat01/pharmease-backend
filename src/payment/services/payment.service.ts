import { Injectable } from '@nestjs/common';
import { CurrencyTypes } from '../dto/create-payment.dto';
import { ProductPrice } from 'src/common/dto';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor() {}

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
}
