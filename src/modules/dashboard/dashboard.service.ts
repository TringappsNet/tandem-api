import { Injectable } from '@nestjs/common';
import { DealsService } from '../deals/deals.service';

@Injectable()
export class DashboardService {
  constructor(private dealsService: DealsService) {}

  async getHomeData() {
    return 'Welcome to Our Dashboard';
  }
}
