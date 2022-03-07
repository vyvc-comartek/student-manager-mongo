import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailScoreAddedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWhenScoreAdded({
    score,
    content,
    overrideOptions,
  }: SendEmailScoreAddedDto) {
    const defaultOptions = {
      to: score.student.email,
      subject: 'Điểm của bạn đã được cập nhật!',
      template: './email-template/score-added',
      attachments: this._attachmentsExcels(content),
      context: score,
    };

    return this.mailerService.sendMail(
      Object.assign(defaultOptions, overrideOptions),
    );
  }

  private _attachmentsExcels(contents: Buffer[]) {
    return contents.map((content, i) => ({
      filename: `result-${i}.xlsx`,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      content,
    })) as Mail.Attachment[];
  }
}
