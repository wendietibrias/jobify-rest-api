import { Module,NestModule,MiddlewareConsumer } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { user,userModel } from "src/Schemas/user.model";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt';
import { RequestService } from "src/Helper/request.service";
import { jwtConstants } from "./auth.constants";
import { AuthorizeMiddleware } from "src/Middleware/authorize.user";

@Module({
    imports:[
        MongooseModule.forFeature([{ name:user.name,schema:userModel }]),
    ],
    controllers:[
        AuthController
    ],
    providers:[
        AuthService,
        RequestService
    ]
})

export class AuthModule implements NestModule {
     configure(consumer : MiddlewareConsumer) {
         consumer.apply(AuthorizeMiddleware).forRoutes('api/auth/logout')
     }
}