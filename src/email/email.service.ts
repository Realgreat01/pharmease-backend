import { ConfigService } from '@nestjs/config';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { EnvConfig } from 'src/common/config/env.config';
@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}
  private resend = new Resend(
    this.configService.get<string>(EnvConfig.RESEND_API_KEY),
  );

  async sendWelcomeEmail() {
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['samsonrealgreat@gmail.com'],
      subject: 'hello world',
      html: '<strong>it works!</strong>',
    });

    if (error) throw new BadGatewayException(error);

    return { data };
  }
}
