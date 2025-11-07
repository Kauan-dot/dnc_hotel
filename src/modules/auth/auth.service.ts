import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { User } from "generated/prisma";
import { AuthLoginDto } from "./domain/dto/authLogin.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { UserService } from "../users/user.service";
import { CreateUserDTO } from "../users/domain/dto/createUser.dto";
import { AuthRegisterDTO } from "./domain/dto/authRegister.dto";
import { Role } from "@prisma/client";
import { AuthResetPasswordDTO } from "./domain/dto/authResetPassword.dto";
import { ValidateTokenDTO } from "./domain/dto/validateToken.dto";



@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
    ) {}

    async generateJwtToken(user: User, expiresIn: string = '1d') {
        const payload = { sub: user.id, name: user.name };
        const options: JwtSignOptions = { 
            expiresIn,
            issuer: 'dnc_hotel',
            audience: 'users',
        };

        return {access_token: this.jwtService.sign(payload, options)};
    }

    async login({ email, password }: AuthLoginDto) {
        const user =  await this.userService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Email or password incorrect');
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


    async reset({token, password}: AuthResetPasswordDTO) {
        const {valid, decoded } = await this.validateToken(token);

        if (!valid || !decoded) throw new UnauthorizedException('Invalid token');

        const user = await this.userService.update(Number(decoded.sub), {password});
        
        return await this.generateJwtToken(user);
    }

    async forgot(email: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Email is incorrect');
        }

        const token = this.generateJwtToken(user, '30m');

        return token;
    }

    async validateToken(token: string): Promise<ValidateTokenDTO> {
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
                issuer: 'dnc_hotel',
                audience: 'users',
            });

            return { valid: true, decoded}
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

}