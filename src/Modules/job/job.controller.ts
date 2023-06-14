import { 
   Controller,
   Get,
   Post,
   Put,
   Delete, 
   HttpCode, 
   Body, 
   Param,
   Query
} from "@nestjs/common";
import { JobService } from "./job.service";
import { CreateDTO, FilterDTO, UpdateDTO } from "./job.dto";

@Controller("api/job")

export class JobController {
   constructor(private jobService : JobService) {}

   @HttpCode(200)
   @Get("stats")
   async statsUserJob() {
     return await this.jobService.statsUserJob();
   }

   @HttpCode(200)
   @Get('all-job')
   async getAllJob(@Query() query : FilterDTO) {
      return await this.jobService.getAllJob(query);
   }

   @HttpCode(200)
   @Get('detail/:id')
   async getDetailJob(@Param() params : any) {
      return await this.jobService.getDetailJob(params.id);
   }

   @HttpCode(200)
   @Post("create")
   async createJob(
    @Body() body : CreateDTO
   ) {
      return await this.jobService.createJob(body);
   }

   @HttpCode(200)
   @Delete("delete/:id")
   async deleteJob(
    @Param() params : any
   ) {
      return await this.jobService.deleteJob(params.id);
   }

   @HttpCode(200)
   @Put("update/:id")
   async updateJob(
     @Body() body : UpdateDTO,
     @Param() params : any 
   ) {
      return await this.jobService.updateJob(params.id , body);
   }
}
