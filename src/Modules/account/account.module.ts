import { MiddlewareConsumer, Module,NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { user,userModel } from "src/Schemas/user.model";
import { RequestService } from "src/Helper/request.service";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AuthorizeMiddleware } from "src/Middleware/authorize.user";

@Module({
   imports:[
     MongooseModule.forFeature([{ name:user.name,schema:userModel }])
   ],
   controllers:[
    AccountController
   ],
   providers:[
     RequestService,
     AccountService
   ]
})

export class AccountModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
       consumer.apply(AuthorizeMiddleware).forRoutes(AccountController);
   }
}