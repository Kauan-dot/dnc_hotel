import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./domain/dto/createUser.dto";
import { UpdateUserDTO } from "./domain/dto/updateUser.dto";
import { ParamId } from "src/shared/decorators/paramId.decorator";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { User } from "src/shared/decorators/user.decorator";
import type { User as UserType } from "@prisma/client";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { RoleGuard } from "src/shared/guards/role.guard";
import { UserMatchGuard } from "src/shared/guards/userMatch.guard";
import { ThrottlerGuard } from "@nestjs/throttler";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageFileValidator } from "src/shared/validators/image-file.validator";
import { FileValidationInterceptor } from "src/shared/interceptos/fileValidation.interceptor";


@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    list(@User('email') user: UserType ) {
        console.log(user)
        return this.userService.list();
    }

    @Get(':id')
    show(@ParamId() id: number) {
        return this.userService.show(id);
    };

    @Roles(Role.ADMIN)
    @Post()
    createUser(@Body() body: CreateUserDTO) {
        return this.userService.create(body);
    }

    @UseGuards(UserMatchGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Patch(':id')
    updateUser(@ParamId() id: number, @Body() body: UpdateUserDTO) {
        return this.userService.update(id, body);
    }

    @UseGuards(UserMatchGuard)
    @Delete(':id')
    deleteUser(@ParamId() id: number) {
        return this.userService.delete(id);
    }

    @UseInterceptors(FileInterceptor('avatar'), FileValidationInterceptor)
    @Post('avatar')
    uploadAvatar(
        @User('id') id: number, 
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new ImageFileValidator(),
                    new MaxFileSizeValidator({
                        maxSize: 900 * 1024,
                    }),
                ],
            })
        ) 
        avatar: Express.Multer.File
    ) {
        return this.userService.uploadAvatar(id, avatar.filename);
    }
}