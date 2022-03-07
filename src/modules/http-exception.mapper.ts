import { HttpException, HttpStatus } from '@nestjs/common';
export class HttpExceptionMapper {
  static throw(databaseException: DatabaseExceptions) {
    switch (databaseException) {
      case DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST:
        throw new HttpException(
          'Reference object not exist',
          HttpStatus.BAD_REQUEST,
        );

      case DatabaseExceptions.OBJ_REFERENCED:
        throw new HttpException(
          'This object being referenced cannot be deleted',
          HttpStatus.BAD_REQUEST,
        );

      default:
        break;
    }
  }
}

export enum DatabaseExceptions {
  /**
   * Không thể liên kết tới một đối tượng không tồn tại
   */
  REFERENCE_OBJ_NOT_EXIST = 1,

  /**
   * Không thể xóa đối tượng đang được liên kết
   */
  OBJ_REFERENCED = 2,
}
