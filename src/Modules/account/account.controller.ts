import { Controller,Get,HttpCode,Param,Body, Put } from "@nestjs/common";
import { UpdateUserDTO } from "./account.dto";
import { AccountService } from "./account.service";

@Controller('api/user')

export class AccountController {
    constructor(
        private accountService : AccountService
    ) {}

     @HttpCode(200)
     @Get('detail')
     async getUserDetail() {
        return await this.accountService.getUserDetail();
     }

     @HttpCode(200)
     @Put('update/:id')
     async updateUserProfile(
        @Param() params : any,
        @Body() body : UpdateUserDTO
     ) {
        return await this.accountService.updateUserProfile(params,body);
     }
}