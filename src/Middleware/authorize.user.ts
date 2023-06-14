import { NestMiddleware,Injectable, UnauthorizedException } from "@nestjs/common";
import { Response,Request,NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/Modules/auth/auth.constants";
import { user,userModel } from "src/Schemas/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestService } from "src/Helper/request.service";

@Injectable()

export class AuthorizeMiddleware implements NestMiddleware {

    constructor(
        @InjectModel(user.name) private userModel : Model<user>,
        private jwt : JwtService,
        private requestService : RequestService
    ) {}

    async use(req : Request,res : Response , next :  NextFunction) {
         const bearer = req.headers.authorization;

         if(bearer) {
            const token : string = bearer.split(" ")[1];
            
            const verifyToken = await this.jwt.verify(token, { secret:"auth",algorithms:["HS384"] });

            const findUser = await this.userModel.findById(verifyToken?.id);

            if(findUser && findUser.login_token) {
                this.requestService.setUserToken(findUser._id);

                return next();
            }

            throw new UnauthorizedException("Unauthorized");

         }

         throw new UnauthorizedException("Unauthorized");
    }
}