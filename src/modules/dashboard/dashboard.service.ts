import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getHomeData() {
    return 'Welcome to Our Dashboard';
  }
}
