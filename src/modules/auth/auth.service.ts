import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from '../login/login.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private loginService: LoginService,
    private jwtService: JwtService,
  ) {}

  async loginDetails(email: string, password: string) {
    const user = await this.loginService.findOne(email);
    const match = await bcrypt.compare(password, user.password);
    console.log(user.email, user.password);
    if (!match) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      status_code: HttpStatus.OK,
      message: 'Login Successfully',
    };
  }
}
