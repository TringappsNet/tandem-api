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
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from '../../../common/dto/create-role.dto';
import { UpdateRoleDto } from '../../../common/dto/update-role.dto';
import { Role } from '../../../common/entities/role.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomServiceException,
  CustomInternalServerErrorException,
} from '../../../exceptions/custom-exceptions';
import { AuthGuard } from '../../../common/gaurds/auth/auth.gaurd';
import { UserAuth } from '../../../common/gaurds/auth/user-auth.decorator';


@ApiTags('Role')
@Controller('api/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('role')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async createRole(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Body() createRoleDto: CreateRoleDto): Promise<Role> {
   try{ return this.roleService.createRole(createRoleDto);}
   catch(error){
    if (error instanceof BadRequestException) {
      throw new CustomBadRequestException(error.message);
    } else if (error instanceof InternalServerErrorException) {
      throw new CustomInternalServerErrorException('createRole');
    } else {
      throw new NotFoundException(error.message);
    }
   }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getRoles(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
  ): Promise<Role[]> {
    try{return this.roleService.getRoles();}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      }
    }
  }

  @Get('role/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getRoleById(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id') id: number): Promise<Role> {
    try{return this.roleService.getRoleById(id);}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof CustomInternalServerErrorException ) {
        throw new CustomServiceException('RoleService', 'getRoleById');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Put('role/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async updateRole(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    try{return this.roleService.updateRole(id, updateRoleDto);}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Role');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Delete('role/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async deleteRole(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id') id: number): Promise<void> {
   try{ return this.roleService.deleteRole(id);}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(error.message);
    } else if (error instanceof ForbiddenException) {
      throw new CustomForbiddenException();
    } else if (error instanceof InternalServerErrorException) {
      throw new CustomServiceException('roleService', 'deleteRole');
    } else {
      throw new CustomBadRequestException(error.message);
    }
   }
  }
}
