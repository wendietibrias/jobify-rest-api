import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { user } from "./user.model";

@Schema({ timestamps:true })

export class job {
    @Prop({ required:true })
    user_id:mongoose.Schema.Types.ObjectId
     
    @Prop({ required:true })
    position : string;

    @Prop({ required:true })
    company : string;

    @Prop({ required:true })
    jobLocation : string;

    @Prop({ required:true, enum:["pending","declined", "interview"] })
    status : string;

    @Prop({ required:true })
    jobType : string;

    @Prop()
    createdAt : string;
}

export const JobModel = SchemaFactory.createForClass(job);