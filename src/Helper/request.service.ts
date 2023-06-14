import { Injectable, RequestMethod, Scope } from "@nestjs/common";

@Injectable({ scope:Scope.REQUEST })
export class RequestService {
    private userId : string;

    getUserToken() : string {
      return this.userId;
    }

    setUserToken(userId : any) {
       this.userId = userId;

       return this.userId;
    }
}