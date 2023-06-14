import { MiddlewareConsumer, Module,NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { job,JobModel } from "src/Schemas/job.model";
import { JobController } from "./job.controller";
import { RequestService } from "src/Helper/request.service";
import { JobService } from "./job.service";
import { AuthorizeMiddleware } from "src/Middleware/authorize.user";
import { user,userModel } from "src/Schemas/user.model";

@Module({
   imports:[
    MongooseModule.forFeature([{ name:job.name,schema:JobModel } , { name:user.name,schema:userModel }])
   ],
   controllers:[
    JobController
   ],
   providers:[
    JobService,
    RequestService
   ]
})

export class JobModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
       consumer.apply(AuthorizeMiddleware).forRoutes(JobController);
   }
}  