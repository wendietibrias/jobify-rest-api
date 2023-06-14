import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument,Model } from "mongoose";

export type userDocument = HydratedDocument<user>;

@Schema({ timestamps:true })
export class user {
    @Prop({ required:true })
    name : string;

    @Prop()
    lastName : string;

    @Prop({ required:true , unique:true }) 
    email : string;

    @Prop({ required:true })
    password : string;

    @Prop()
    location : string;

    @Prop()
    login_token : string;
}

export const userModel = SchemaFactory.createForClass(user);
