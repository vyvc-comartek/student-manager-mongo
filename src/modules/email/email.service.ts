import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { Student } from 'src/students/student.entity';
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
      to: (score.student as Student).email,
      subject: 'Điểm của bạn đã được cập nhật!',
      template: './email-template/score-added',
      attachments: this._attachmentsExcels(content),
      context: score,
    };

    return this.mailerService.sendMail({
      ...defaultOptions,
      ...overrideOptions,
    });
  }

  private _attachmentsExcels(contents: Buffer[]) {
    function createAttachInfo(content, index) {
      return {
        filename: `result-${index}.xlsx`,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        content,
      };
    }

    return contents.map(createAttachInfo) as Mail.Attachment[];
  }
}
