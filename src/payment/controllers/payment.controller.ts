import {
  Body,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequest } from 'src/common/interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/common/config/env.config';
import { Public } from 'src/common/decorators';

@Controller('payment')
@ApiBearerAuth()
@ApiTags('Payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private configService: ConfigService,
  ) {}

  @Get('rates')
  getExchangeRates() {
    return this.paymentService.getExchangeRate();
  }
  @Post('init')
  initializePayment(@Req() req: IRequest, @Body() payload: CreatePaymentDto) {
    return this.paymentService.initiatializePayment(req.user.id, payload);
  }

  @Public()
  @Post('webhook')
  validatePayment(
    @Req() req: IRequest,
    @Res() res: Response,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const PaystackPrivateKey = this.configService.get<string>(
      EnvConfig.PAYSTACK_PRIVATE_KEY,
    );

    const hash = crypto
      .createHmac('sha512', PaystackPrivateKey)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== hash) {
      return 'Invalid webhook signature';
    }

    const event = req.body;

    try {
      return this.paymentService.validatePayment(event);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
