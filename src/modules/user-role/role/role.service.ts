import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../../common/entities/role.entity';
import { CreateRoleDto } from '../../../common/dto/create-role.dto';
import { UpdateRoleDto } from '../../../common/dto/update-role.dto';
// import { LoggerService } from '@logger/logger.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    // private readonly logger: LoggerService,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    if (!role) {
      throw new BadRequestException(
        'The specified role is not created properly',
      );
    }
    // this.logger.log(`Role created with ID ${role.id}`);
    return await this.roleRepository.save(role);
  }

  async getRoles(): Promise<Role[]> {
    // this.logger.log('Fetching all roles');
    return await this.roleRepository.find();
  }

  async getRoleById(id: number): Promise<Role> {
    // this.logger.log(`Fetching role with ID ${id}`);
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      // this.logger.warn(`Role with ID ${id} not found`);
      throw new NotFoundException(`Role with ID ${id}`);
    }
    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.getRoleById(id);
    Object.assign(role, updateRoleDto);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id}`);
    }
    // this.logger.log(`Role with ID ${id} updated`);
    return await this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      // this.logger.warn(`Role with ID ${id} not found`);
      throw new NotFoundException(`Role with ID ${id}`);
    }
    // this.logger.log(`Role with ID ${id} deleted`);
  }
}
