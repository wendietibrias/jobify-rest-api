import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { job } from "src/Schemas/job.model";
import { CreateDTO, FilterDTO, UpdateDTO } from "./job.dto";
import { RequestService } from "src/Helper/request.service";

@Injectable() 

export class JobService {
    private userId : string;

    constructor(
        @InjectModel(job.name) private jobModel : Model<job>,
        private requestService : RequestService
    ) {
       this.userId = this.requestService.getUserToken();
    } 

    async getDetailJob(jobId : string) {
        const findJob = await this.findJobById(jobId);

        if(findJob) {
            return {
                data:findJob,
                statusCode:200
            }
        }

        throw new NotFoundException("Job is not found");
    }


    async statsUserJob() {
        const thisYear = new Date().getFullYear();

        try {
            const findUserJob = await this.findAllUserJob();
            const labels = ["January","Febuary", "March" , "April" , "May" , "June" , "July", "August", "September" , "October", "November" , "December"]
            const data = [];

            for(let i = 0; i < labels.length; i++) {
                const filterJob = findUserJob.filter((job) => {
                      const date = new Date(`${job.createdAt}`);
                      const getMonth = date.getMonth();
                      const getYear = date.getFullYear();

                      if(getMonth === i+1 && getYear === thisYear) {
                         return job
                      }
                })

                data.push(filterJob.length);
            }

            const filterPending = findUserJob.filter((job) => {
                if(job.status === "pending" && new Date(`${job.createdAt}`).getFullYear() === thisYear) {
                    return job
                }
            });
            const filterInterview = findUserJob.filter((job) => {
                 if(job.status === "interview" && new Date(`${job.createdAt}`).getFullYear() === thisYear) {
                    return job
                }
            });
            const filterDeclined = findUserJob.filter((job) => {
                 if(job.status === "declined" && new Date(`${job.createdAt}`).getFullYear() === thisYear) {
                    return job
                }
            });
            

            return {
               data: {
                  chart:{
                     labels:labels,
                     data:data 
                  },
                  scoreCard: {
                     pending:filterPending.length,
                     interview:filterInterview.length,
                     declined:filterDeclined.length
                  }
               },
               statusCode:200
            }

        } catch(err : any) {
             throw new InternalServerErrorException(err.message);
        }
    }

    async getAllJob(query : FilterDTO) {
        try {
            const skip : number = Number(query.page) > 1 ? (Number(query.page) - 1) * Number(query.per_page) : 0;
            const findUserJob =  await this.jobModel
                                                .where('user_id' , this.userId)
                                                .where('status').regex(new RegExp(query.status , 'i'))
                                                .where('jobType').regex(new RegExp(query.type))
                                                .limit(6)
                                                .skip(skip)
                                                .exec();
    
            const allUserJob = await this.jobModel
                                                .where('user_id' , this.userId)
                                                .where('status').regex(new RegExp(query.status , 'i'))
                                                .where('jobType').regex(new RegExp(query.type))
                                                .exec();


            return {
                data: {
                    data:findUserJob,
                    total:allUserJob.length,
                    per_page:6,
                    current_page:Number(query.page),
                },
                statusCode:200
            }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async createJob(body : CreateDTO) {
          const {
            position,
            company,
            jobLocation,
            jobType,
            status
          } = body;

         //check request body
         if(
            position === '' ||
            company === '' || 
            jobLocation === '' ||
            jobType === '' ||
            status === ''
         ) {
            throw new BadRequestException("please complete all field");
         }

         try {
 
            const initJob = new this.jobModel({
                 position,
                 company,
                 jobLocation,
                 jobType,
                 status ,
                 user_id:this.userId 
            });

            const saveJob = await initJob.save();

            if(saveJob) {
                return {
                    message:"job is created!",
                    statusCode:200
                }
            }

            throw new HttpException("Error save data" , 500);

         } catch(err : any) {
            throw new InternalServerErrorException(err.message);
         }
    } 

    async deleteJob(id : string) {
        try {
          const findJobById = await this.findJobById(id);

          if(!findJobById) {
            throw new NotFoundException("job is not found");
          }

          const deleteJob = await this.jobModel.findByIdAndDelete(id);

          if(deleteJob) {
            return {
                message:"Success delete job",
                statusCode:200
            }
          }

        } catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateJob(id : string , body : UpdateDTO) {
         const {
            position,
            company,
            jobLocation,
            jobType,
            status
          } = body;

         //check request body
         if(
            position === '' ||
            company === '' || 
            jobLocation === '' ||
            jobType === '' ||
            status === ''
         ) {
            throw new BadRequestException("please complete all field");
         }

         try {
            const findJobById = await this.findJobById(id);

            if(!findJobById) {
                throw new NotFoundException("job is not found");
            }

            findJobById.position = position;
            findJobById.company = company;
            findJobById.jobLocation = jobLocation;
            findJobById.jobType = jobType;
            findJobById.status = status;

            const saveChange = await findJobById.save();

            if(saveChange) {
                return {
                    message:"job is updated!",
                    statusCode:200
                }
            }

         } catch(err : any) {
            throw new InternalServerErrorException(err.message);
         }
    }

    async findJobById(id : string) {
       const findJobById = await this.jobModel.findById(id);

       return findJobById;
    }

    async findAllUserJob() {
        const findUserJob = await this.jobModel.find({ user_id : this.userId });

        return findUserJob;
    }

}