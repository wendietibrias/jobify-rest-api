import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestService } from "src/Helper/request.service";
import { user } from "src/Schemas/user.model";
import { UpdateUserDTO } from "./account.dto";

@Injectable()

export class AccountService {
    private userId : string;

    constructor(
        @InjectModel(user.name) private userModel : Model<user>,
        private requestService : RequestService
    ) {
       this.userId = this.requestService.getUserToken();
    }

    async getUserDetail() {
        try {
            const findUser = await this.userModel.findById(this.userId);

            if(findUser) {
                return {
                    data:findUser,
                    statusCode:200
                }
            }

            throw new NotFoundException("Account is not found");
             
        } catch(err : any) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateUserProfile(userId : string ,body : UpdateUserDTO) {
        const {
            name,
            lastName,
            email,
            location 
        } = body;

        try {
           const findUser = await this.userModel.findById(this.userId);

           if(findUser) {
              findUser.name = name === "" ? findUser.name : name;
              findUser.lastName  = lastName === "" ? findUser.lastName : lastName;
              findUser.email = email === "" ? findUser.email : email;
              findUser.location = location === "" ? findUser.location : location;

              const saveChange = findUser.save();

              if(saveChange) {
                return {
                    message:"success update profile",
                    statusCode:200
                }
              }
           }

           throw new NotFoundException("Account is not found");

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}