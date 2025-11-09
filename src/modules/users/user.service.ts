import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { CreateUserDTO } from "./domain/dto/createUser.dto";
import { UpdateUserDTO } from "./domain/dto/updateUser.dto";
import * as bcrypt from 'bcrypt';
import { userSelectFields } from "../prisma/utils/userSelectFields";
import { join, resolve } from "path";
import { stat, unlink } from "fs/promises";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(body: CreateUserDTO): Promise<User> {
        const user = await this.findByEmail(body.email)
        if (user) {
            throw new BadRequestException('User already exists');
        }

        body.password = await this.hashPassword(body.password);
        return await this.prisma.user.create({ 
            data: body, 
            select: userSelectFields,
        });
    }
    
    async list() {
        return await this.prisma.user.findMany({
            select: userSelectFields,
        });
    }
    
    async show(id: number) {
        const user = await this.isIdExists(id);
        return user;
    }
    
    async update(id: number, body: UpdateUserDTO) {
        await this.isIdExists(id);

        if (body.password) {
            body.password = await this.hashPassword(body.password);
        }
        return await this.prisma.user.update({ 
            where: { id }, 
            data: body,
            select: userSelectFields,
         });
    }

    async delete(id: number) {
        await this.isIdExists(id);
        return await this.prisma.user.delete({ where: { id } });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ 
            where: { email },
        });
    }

    async uploadAvatar(id: number, avatarFilename: string) {
        const user = await this.isIdExists(id);
        const directory = resolve(__dirname, '..', '..', '..', 'uploads');

        if ( user.avatar ) {
            const userAvatarFilePath = join(directory, user.avatar);
            const userAvatarFileExists = await stat(userAvatarFilePath);

            if (userAvatarFileExists) {
                await unlink(userAvatarFilePath);
            }
        }

        const userUpdated = await this.update(id, { avatar: avatarFilename });

        return userUpdated;
    }

    private async isIdExists(id: number) {
        const user = await this.prisma.user.findUnique({ 
            where: { id },
            select: userSelectFields,
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
