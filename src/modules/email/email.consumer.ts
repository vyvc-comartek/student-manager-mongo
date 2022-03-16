import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
@Processor('email')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process()
  async sendMail(job: Job<ISendMailOptions>) {
    function contentStringToBuffer(attachment: Mail.Attachment) {
      return {
        ...attachment,
        content: Buffer.from(attachment.content as string, 'base64'),
      };
    }

    const attachments = job.data.attachments.map(contentStringToBuffer);

    return this.mailerService.sendMail({
      ...job.data,
      attachments,
    });
  }

  @OnQueueActive()
  async onSendingMail(job: Job<ISendMailOptions>) {
    console.log(`Sending email to ${job.data.to}...`);
  }
}
