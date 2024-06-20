import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from 'src/common/dto/register.dto';

@Controller('api/register')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post('/')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async registerDetails(@Body() registerData: RegisterDto) {
    return await this.registerService.registerDetails(registerData);
  }
}
