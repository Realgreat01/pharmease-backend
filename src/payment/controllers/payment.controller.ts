import { Controller, Get } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('payment')
@ApiBearerAuth()
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('rates')
  getExchangeRates() {
    return this.paymentService.getExchangeRate();
  }
}
