import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { user } from "src/Schemas/user.model";
import { LoginDTO,RegisterDTO } from "./auth.dto";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { saltRounds } from "./auth.constants";
import { RequestService } from "src/Helper/request.service";

@Injectable()

export class AuthService {

    constructor(
        @InjectModel(user.name) private userModel : Model<user>,
        private jwt : JwtService,
        private requestService : RequestService
    ) {
    }

    async login(body : LoginDTO) {
        const findUser = await this.findUserByEmail(body.email);

        if(!findUser) {
            throw new HttpException("account is not found"  ,404);
        }

        if(findUser.login_token) {
            throw new HttpException("Account is already in use"  ,403);
        }
   
        const isMatch = await bcrypt.compare(body.password,findUser.password);
  
        if(!isMatch) {
            throw new HttpException("You input wrong password" , 400);
        }

        const payload = { id:findUser._id };

        const generateToken = await this.jwt.signAsync(payload);

        if(generateToken) {
  
            findUser.login_token = generateToken;
            await findUser.save();

            return {
               data: {
                 access_token:generateToken,
               },
               statusCode:200,
            }
        }

        throw new HttpException("Internal Server Error" , 500);

    }

    async register(body : RegisterDTO) {
       const findUser = await this.findUserByEmail(body.email);

        if(findUser) {
            throw new HttpException("account is already exists"  ,400);
        }

        const isMatch : boolean = body.password === body.confirm ? true : false;

        if(!isMatch) {
            throw new HttpException("Password is not match"  ,400);
        }

        const initUser = new this.userModel({
            name:body.name,
            email:body.email
        });

        const salt = await bcrypt.genSalt(saltRounds);

        const hash = await bcrypt.hash(body.password , salt);

        if(hash) {
            initUser.password = hash;

            const saveUser = await initUser.save();

            if(saveUser) {
                return {
                    message:"account is create",
                    statusCode:200,
                }
            }

            throw new HttpException("Failed to save user" , 500);
        }

        throw new HttpException("Failed to save user" , 500);
    }

    async logout() {

        const findUser = await this.findUserById();

        if(!findUser) {
            throw new UnauthorizedException("Unauthorized");
        }

        findUser.login_token = null;

        const saveChange = await findUser.save();

        if(saveChange) {
            return {
                message:"logout success",
                statusCode:200
            }
        }
    }

    async findUserById() {
         const findUser = await this.userModel.findById(this.requestService.getUserToken());

         return findUser;
    }

    async findUserByEmail(email : string) {
       const findUser = await this.userModel.findOne({ email : email });
       return findUser;
    }

}