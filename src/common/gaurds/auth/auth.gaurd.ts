import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];
    const accessToken = request.headers['access-token'];

    if (!userId || !accessToken) {
      throw new UnauthorizedException('Please provide userId and accessToken');
    }

    const isValid = await this.authService.validateUser(Number(userId), accessToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid userId or accessToken');
    }

    return true;
  }
}	