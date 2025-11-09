import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controllers";
import { UserService } from "./user.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';

@Module({
    imports: [
        PrismaModule, 
        forwardRef(() => AuthModule), 
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const filename: string = `${uuidv4()}${file.originalname}`;
                    return cb(null, filename);
                }
            })
        })
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}