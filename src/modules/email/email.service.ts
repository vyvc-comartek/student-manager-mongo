import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailScoreAddedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async sendWhenScoreAdded({
    score,
    content,
    overrideOptions,
    jobOptions,
  }: SendEmailScoreAddedDto) {
    const defaultOptions = {
      to: score.student.email,
      subject: 'Điểm của bạn đã được cập nhật!',
      template: './email-template/score-added',
      attachments: this._attachmentsExcels(content),
      context: score,
    };

    return this.emailQueue.add(
      {
        ...defaultOptions,
        ...overrideOptions,
      },
      jobOptions,
    );
  }

  private _attachmentsExcels(contents: Buffer[]) {
    function createAttachInfo(content: Buffer, index: number) {
      return {
        filename: `result-${index}.xlsx`,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        content: content.toString('base64'),
      };
    }

    return contents.map(createAttachInfo) as Mail.Attachment[];
  }
}
