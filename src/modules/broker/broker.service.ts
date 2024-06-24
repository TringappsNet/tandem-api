import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrokerService {

  constructor(
  @InjectRepository(Users)
  private readonly brokerRepository: Repository<Users>,
  // private readonly logger: LoggerService,
) {}

  async findAll() {
      return await this.brokerRepository.find();
    }

    async findByRoleId(id: number): Promise<Users> {
      // this.logger.log(`Fetching user with ID ${id}`);
      const role = await this.brokerRepository.findOne({ where: { id } });
      if (!role) {
        // this.logger.warn(`Users with RoleID ${id} not found`);
        throw new NotFoundException(`Users with RoleID ${id} not found`);
      }
      return role;
    }
}
