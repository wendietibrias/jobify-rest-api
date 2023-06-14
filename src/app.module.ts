import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './Modules/auth/auth.module';
import { JobModule } from './Modules/job/job.module';
import { AccountModule } from './Modules/account/account.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://wendietibrias:1234@cluster0.pf1svjc.mongodb.net/jobify?retryWrites=true&w=majority'),
    JwtModule.register({
       global:true,
       secret:"auth",
       signOptions:{ expiresIn:"1d",algorithm:"HS384" }
    }),
    ConfigModule.forRoot({
      envFilePath:['.env.development','.env.production'],
      isGlobal:true
    }),
    AuthModule,
    JobModule,
    AccountModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
