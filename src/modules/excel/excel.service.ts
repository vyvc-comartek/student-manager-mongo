import { Injectable } from '@nestjs/common';
import * as XlsxTemplate from 'xlsx-template';
import { CreateExcelDto } from './dto';

@Injectable()
export class ExcelService {
  private _template: XlsxTemplate = new XlsxTemplate();

  async create<T>({ schema, data }: CreateExcelDto<T>) {
    this._template.loadTemplate(schema);
    this._template.substitute(1, data);

    const dataBase64 = this._template.generate('base64');

    return Buffer.from(dataBase64, 'base64');
  }
}
