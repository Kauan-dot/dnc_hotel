import { FileValidator } from '@nestjs/common';

export class ImageFileValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    return !!file?.mimetype?.startsWith('image/');
  }

  buildErrorMessage(): string {
    return 'Apenas arquivos de imagem são permitidos.';
  }
}
