import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "generated/prisma";
import { AuthLoginDto } from "./domain/dto/authLogin.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { UserService } from "../users/user.services";
import { CreateUserDTO } from "../users/domain/dto/createUser.dto";
import { AuthRegisterDTO } from "./domain/dto/authRegister.dto";
import { Role } from "@prisma/client";
import { AuthResetPasswordDTO } from "./domain/dto/authResetPassword.dto";



@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
    ) {}

    async generateJwtToken(user: User) {
        const payload = { sub: user.id, name: user.name };
        const options = { 
            expiresIn: 60 * 60 * 24,
            issuer: 'dnc_hotel',
            audience: "users"
        };

        return {access_token: await this.jwtService.sign(payload, options)};
    }

    async login({ email, password }: AuthLoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            throw new UnauthorizedException('Email ou senha incorretos');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Email ou senha incorretos');
        }

        return this.generateJwtToken(user);
    }


    async register(body: AuthRegisterDTO) {
        if (!body.password) throw new BadRequestException('Password is required');

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser: CreateUserDTO = {
            name: body.name ?? '',
            email: body.email ?? '',
            password: hashedPassword,
            role: body.role ?? Role.USER,
        };

        const user = await this.userService.create(newUser);
        return this.generateJwtToken(user);
    }


    async resetPassword({token, password}: AuthResetPasswordDTO) {
        const {valid, decoded } = await this.jwtService.verifyAsync(token);

        if (!valid) throw new UnauthorizedException('Invalid token');

        const user = await this.userService.update(decoded.sub, {password});
        
        return await this.generateJwtToken(user);
    }
}