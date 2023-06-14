import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    console.log(process.env.JWT_AUTH_SECRET);
  }
}
