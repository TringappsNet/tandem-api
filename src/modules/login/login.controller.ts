// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   Post,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { LoginService } from './login.service';
// import { LoginDto } from '../../common/dto/login.dto';

// @Controller('login')
// export class LoginController {
//   constructor(private loginService: LoginService) {}

//   @Get('/')
//   @HttpCode(200)
//   @UsePipes(ValidationPipe)
//   addLoginDetails(@Body() loginData: LoginDto) {
//     return this.loginService.loginDetails(loginData);
//   }
// }
