import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,    
  InternalServerErrorException,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from '../../../common/dto/create-role.dto';
import { UpdateRoleDto } from '../../../common/dto/update-role.dto';
import { Role } from '../../../common/entities/role.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomServiceException,
  CustomInternalServerErrorException,
} from '../../../exceptions/custom-exceptions';

@ApiTags('Role')
@Controller('api/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('role')
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
   try{ return this.roleService.createRole(createRoleDto);}
   catch(error){
    if (error instanceof BadRequestException) {
      throw new CustomBadRequestException();
    } else if (error instanceof InternalServerErrorException) {
      throw new CustomInternalServerErrorException('createRole');
    } else {
      throw new CustomBadRequestException();
    }
   }
  }

  @Get()
  async getRoles(): Promise<Role[]> {
    try{return this.roleService.getRoles();}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Roles`);
      }
    }
  }

  @Get('role/:id')
  async getRoleById(@Param('id') id: number): Promise<Role> {
    try{return this.roleService.getRoleById(id);}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Role with ID ${id}`);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof CustomInternalServerErrorException ) {
        throw new CustomServiceException('RoleService', 'getRoleById');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Put('role/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    try{return this.roleService.updateRole(id, updateRoleDto);}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Role with ID ${id}`);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Role');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Delete('role/:id')
  async deleteRole(@Param('id') id: number): Promise<void> {
   try{ return this.roleService.deleteRole(id);}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(`role with ID ${id}`);
    } else if (error instanceof ForbiddenException) {
      throw new CustomForbiddenException();
    } else if (error instanceof InternalServerErrorException) {
      throw new CustomServiceException('roleService', 'deleteRole');
    } else {
      throw new CustomBadRequestException();
    }
   }
  }
}
