import { IUploadedMulterFile } from '../../../files/s3/interfaces/upload-file.interface';

export class UploadFileRequestDto {
  file: IUploadedMulterFile;
  userId: string;
}
