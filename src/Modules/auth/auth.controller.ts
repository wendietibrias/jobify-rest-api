import { Controller,Get,Post,Delete,Put,HttpCode,Body,Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, RegisterDTO } from "./auth.dto";
import { Request } from "express";

@Controller('api/auth')

export class AuthController {
    constructor(private authService : AuthService) {}

    @HttpCode(200)
    @Post('login')
    async login(
        @Body() body : LoginDTO
    ) {
       return await this.authService.login(body);
    }
    
    @HttpCode(200)
    @Post('register')
    async register(
        @Body() body : RegisterDTO
    ) {
       return await this.authService.register(body);
    }

    @HttpCode(200)
    @Delete('logout')
    async logout(
        @Req() req : Request
    ) {
        return await this.authService.logout(req.headers.authorization);
    }
}