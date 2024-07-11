import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../common/entities/user.entity';
import { UserRole } from '../../common/entities/user-role.entity';
import { Deals } from '../../common/entities/deals.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UpdateBrokerDto } from '../../common/dto/update-broker.dto';
import { SetActiveBrokerDto } from '../../common/dto/set-active-broker.dto';

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

  async findAll(): Promise<object> {
    const user = await this.brokerRepository.find();
    const filteredUser = user.map((removeSensitiveData) => {
      const {
        password,
        createdAt,
        updatedAt,
        isActive,
        resetToken,
        resetTokenExpires,
        ...userObject
      } = removeSensitiveData;
      return userObject;
    });
    return filteredUser;
  }

  async findAllUsers(roleId: number[] = [1, 2]): Promise<any> {
    const usersWithRole = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .innerJoinAndSelect('userRole.user', 'user')
      .where('userRole.roleId IN (:...roleIds)', { roleIds: roleId })
      .getMany();
  
    if (usersWithRole.length === 0) {
      throw new NotFoundException();
    }
  
    const brokers = await Promise.all(
      usersWithRole.map(async (userRole) => {
        const user = userRole.user;
        const roleId = userRole.roleId;
  
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
          roleId,
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
  

  async updateBroker(id: number, UpdateBrokerDto: UpdateBrokerDto): Promise<Users> {
    const role = await this.getBrokerById(id);
    Object.assign(role, UpdateBrokerDto);
    if (!role) {
      throw new NotFoundException();
    }
    return await this.brokerRepository.save(role);
  }

  async getBrokerById(id: number): Promise<Users> {
    const role = await this.brokerRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }
  async setActiveBroker(id: number, setActiveBrokerDto: SetActiveBrokerDto) {
    try {
      const checkStatus = await this.brokerRepository.findOne({
        where: { id },
      });
      if (!checkStatus) {
        throw new NotFoundException(`Broker with id ${id} not found`);
      }
      if (checkStatus.isActive == true && setActiveBrokerDto.isActive == true) {
        throw new BadRequestException(
          `Broker with id ${id} already in active state`,
        );
      }
      if (
        checkStatus.isActive == false &&
        setActiveBrokerDto.isActive == false
      ) {
        throw new BadRequestException(
          `Broker with id ${id} already in deactive state`,
        );
      }
      await this.brokerRepository.update(id, {
        isActive: setActiveBrokerDto.isActive,
      });

      const updatedBrokerData = await this.brokerRepository.findOne({
        where: { id },
      });
      if (!updatedBrokerData) {
        throw new NotFoundException('User not found');
      }

      var status: string = 'deactivated';
      if (setActiveBrokerDto.isActive) {
        status = 'activated';
      }

      return {
        updatedBrokerData,
        message: `Broker record ${status} successfully`,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBroker(id: number): Promise<any> {
    try {
      const result = await this.brokerRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Broker with id ${id} not found`);
      }
      return {
        message: 'Broker deleted successfully',
      };
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('a foreign key constraint fails')) {
        throw new BadRequestException('This broker has assigned deals and cannot be deleted');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }


}
