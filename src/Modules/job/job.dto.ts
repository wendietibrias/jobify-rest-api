export class CreateDTO {
     position : string;
     company : string;
     jobLocation : string;
     status : string;
     jobType : string;
}

export class UpdateDTO {
     position : string;
     company : string;
     jobLocation : string;
     status : string;
     jobType : string;
}

export class FilterDTO {
     search:string;
     sort:string;
     status:string;
     type:string;
     page:number;
     per_page:number;
}