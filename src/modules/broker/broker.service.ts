import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';
import { UserRole } from 'src/common/entities/user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrokerService {
  constructor(
    @InjectRepository(Users)
    private readonly brokerRepository: Repository<Users>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async findAll() {
    return await this.brokerRepository.find();
  }

  async findByRoleId(roleId: number = 2): Promise<Users[]> {
    const usersWithRole = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .innerJoinAndSelect('userRole.user', 'user')
      .where('userRole.roleId = :roleId', { roleId })
      .getMany();

    if (usersWithRole.length === 0) {
      throw new NotFoundException(`Users with RoleID ${roleId} not found`);
    }

    return usersWithRole.map((userRole) => userRole.user);
  }
}
