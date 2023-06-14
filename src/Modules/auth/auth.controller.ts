import { Controller,Get,Post,Delete,Put,HttpCode,Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, RegisterDTO } from "./auth.dto";

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
    async logout() {
        return await this.authService.logout();
    }
}