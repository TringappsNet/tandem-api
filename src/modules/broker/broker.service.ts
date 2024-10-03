import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../common/entities/user.entity';
import { UserRole } from '../../common/entities/user-role.entity';
import { Deals } from '../../common/entities/deals.entity';
import { Repository } from 'typeorm';
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
    try {
      const user = await this.brokerRepository.find();
      if (!user) {
        throw new NotFoundException('Brokers');
      }
      const filteredUser = user.map((removeSensitiveData) => {
        const {
          password,
          createdAt,
          updatedAt,
          resetToken,
          resetTokenExpires,
          ...userObject
        } = removeSensitiveData;
        return userObject;
      });
      return filteredUser;
    } catch (error) {
      throw error;
    }
  }

  async getAllBrokersData(roleId: number[] = [1, 2]): Promise<any> {
    try {
      const usersWithRole = await this.userRoleRepository
        .createQueryBuilder('userRole')
        .innerJoinAndSelect('userRole.user', 'user')
        .where('userRole.roleId IN (:...roleIds)', { roleIds: roleId })
        .getMany();

      if (usersWithRole.length === 0) {
        throw new NotFoundException('The user with the specified role was');
      }

      const brokers = await Promise.all(
        usersWithRole.map(async (userRole) => {
          const user = userRole.user;
          const roleId = userRole.roleId;

          const deals = await this.dealsRepository.find({
            where: { brokerId: user.id },
          });

          const totalDeals = deals.length;
          const dealsOpened = deals.filter(
            (deal) => deal.activeStep <= 2,
          ).length;
          const dealsInProgress = deals.filter(
            (deal) => deal.activeStep > 2 && deal.activeStep <= 7,
          ).length;
          const dealsClosed = deals.filter(
            (deal) => deal.activeStep === 8,
          ).length;
          const totalPotentialCommission = deals.reduce(
            (sum, deal) => sum + deal.finalCommission,
            0,
          );

          return {
            user,
            roleId,
            totalDeals,
            dealsOpened,
            dealsInProgress,
            dealsClosed,
            totalPotentialCommission,
          };
        }),
      );

      return brokers;
    } catch (error) {
      throw error;
    }
  }

  async updateBroker(
    id: number,
    UpdateBrokerDto: UpdateBrokerDto,
  ): Promise<Users> {
    try {
      const broker = await this.getBrokerById(id);
      if (!broker) {
        throw new NotFoundException(`Broker with ID ${id}`);
      }
      Object.assign(broker, UpdateBrokerDto);
      return await this.brokerRepository.save(broker);
    } catch (error) {
      throw error;
    }
  }

  async getBrokerById(id: number): Promise<Users> {
    try {
      const broker = await this.brokerRepository.findOne({ where: { id } });
      if (!broker) {
        throw new NotFoundException(`Broker with ID ${id}`);
      }
      return broker;
    } catch (error) {
      throw error;
    }
  }

  async getBrokerByIdWithDeals(id: number): Promise<Users | any> {
    try {
      const broker = await this.brokerRepository.findOne({ where: { id } });
      if (!broker) {
        throw new NotFoundException(`Broker with ID ${id}`);
      }
      const {
        password,
        createdAt,
        updatedAt,
        resetToken,
        resetTokenExpires,
        ...brokerObject
      } = broker;

      const deals = await this.dealsRepository.find({
        where: { brokerId: broker.id },
      });

      const totalDeals = deals.length;
      const dealsOpened = deals.filter((deal) => deal.activeStep === 1).length;
      const dealsInProgress = deals.filter(
        (deal) => deal.activeStep > 1 && deal.activeStep <= 7,
      ).length;
      const dealsClosed = deals.filter((deal) => deal.activeStep === 8).length;
      const totalPotentialCommission = deals.reduce(
        (sum, deal) => sum + deal.finalCommission,
        0,
      );

      return {
        user: brokerObject,
        totalDeals,
        dealsOpened,
        dealsInProgress,
        dealsClosed,
        totalPotentialCommission,
      };
    } catch (error) {
      throw error;
    }
  }

  async setActiveBroker(id: number, setActiveBrokerDto: SetActiveBrokerDto) {
    try {
      const checkStatus = await this.getBrokerById(id);
      if (!checkStatus) {
        throw new NotFoundException(`Broker with id ${id}`);
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
        throw new BadRequestException(`Broker is already in deactive state`);
      }
      await this.brokerRepository.update(id, {
        isActive: setActiveBrokerDto.isActive,
      });

      const updatedBrokerData = await this.brokerRepository.findOne({
        where: { id },
      });
      if (!updatedBrokerData) {
        throw new NotFoundException(
          'The account associated with this user was',
        );
      }

      let status: string = 'deactivated';
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
      const countOfDeals = await this.dealsRepository.count({
        where: { brokerId: id },
      });

      if (countOfDeals > 0) {
        throw new BadRequestException(
          `This broker has assigned with ${countOfDeals} deals and cannot be deleted`,
        );
      }

      const result = await this.brokerRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Broker with id ${id}`);
      }

      return {
        message: 'Broker deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
