import { Injectable } from '@nestjs/common';
import * as XlsxTemplate from 'xlsx-template';
import { CreateExcelDto } from './dto';

@Injectable()
export class ExcelService {
  private _template: XlsxTemplate = new XlsxTemplate();

  async create<T>({ schema, data }: CreateExcelDto<T>) {
    this._template.loadTemplate(schema);
    this._template.substitute(1, data);

    return Buffer.from(this._template.generate('base64'), 'base64');
  }
}
