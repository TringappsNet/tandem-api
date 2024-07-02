import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../common/entities/user.entity';
import { UserRole } from '../../common/entities/user-role.entity';
import { Deals } from '../../common/entities/deals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrokerService {
  constructor(
    @InjectRepository(Users)
    private readonly brokerRepository: Repository<Users>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Deals)
    private readonly dealsRepository: Repository<Deals>,
  ) {}

  async findAll() {
    return await this.brokerRepository.find();
  }

  async findByRoleId(roleId: number[] = [1, 2]): Promise<any> {

    const usersWithRole = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .innerJoinAndSelect('userRole.user', 'user')
      .where('userRole.roleId IN (:...roleIds)', { roleIds: roleId})
      .getMany();

    if (usersWithRole.length === 0) {
      throw new NotFoundException(`No Users were found`);
    }

    const brokers = await Promise.all(
      usersWithRole.map(async (userRole) => {
        const user = userRole.user;

        const deals = await this.dealsRepository.find({
          where: { createdBy: { id: user.id } },
        });

        const totalDeals = deals.length;
        const dealsOpened = deals.filter(
          (deal) => deal.activeStep === 1,
        ).length;
        const dealsInProgress = deals.filter(
          (deal) => deal.activeStep > 1 && deal.activeStep <= 6,
        ).length;
        const dealsClosed = deals.filter(
          (deal) => deal.activeStep === 7,
        ).length;
        const totalCommission = deals.reduce(
          (sum, deal) => sum + deal.potentialCommission,
          0,
        );

        return {
          user,
          totalDeals,
          dealsOpened,
          dealsInProgress,
          dealsClosed,
          totalCommission,
        };
      }),
    );

    return brokers;
  }
}
