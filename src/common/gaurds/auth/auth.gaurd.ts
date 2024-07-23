import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../../modules/auth/auth.service';
import { ClsService } from 'nestjs-cls';
import { Users } from 'src/common/entities/user.entity';
// import { MyClsStore } from 'src/common/interfaces/cls-store.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    // private clsService: ClsService<MyClsStore>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];
    const accessToken = request.headers['access-token'];

    if (!userId || !accessToken) {
      throw new UnauthorizedException(
        'Please provide a valid user ID and access token',
      );
    }

    const isValid = await this.authService.validateUser(
      Number(userId),
      accessToken,
    );

    const users = await this.authService.getUser(userId);
    // this.clsService.set('user', users);
    // console.log(this.clsService.get('user'));
    
    if (!isValid) {
      throw new UnauthorizedException(
        'The provided user ID or access token is invalid',
      );
    }

    return true;
  }
}
