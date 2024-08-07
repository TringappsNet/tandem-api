import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from '../role.controller';
import { RoleService } from '../role.service';
import { AuthService } from '../../../auth/auth.service';
import { AuthGuard } from '../../../../common/gaurds/auth/auth.gaurd';
import { CreateRoleDto } from '../../../../common/dto/create-role.dto';
import { UpdateRoleDto } from '../../../../common/dto/update-role.dto';
import { Role } from '../../../../common/entities/role.entity';

describe('RoleController', () => {
  let controller: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            createRole: jest.fn().mockResolvedValue({
              id: 1,
              roleName: 'Admin',
              description: 'Administrator role',
              createdBy: 0,
              createdAt: new Date(),
              updatedBy: 0,
              updatedAt: new Date(),
            }),
            getRoles: jest.fn().mockResolvedValue([
              {
                id: 1,
                roleName: 'Admin',
                description: 'Administrator role',
                createdBy: 0,
                createdAt: new Date(),
                updatedBy: 0,
                updatedAt: new Date(),
              },
              {
                id: 2,
                roleName: 'User',
                description: 'User role',
                createdBy: 0,
                createdAt: new Date(),
                updatedBy: 0,
                updatedAt: new Date(),
              },
            ]),
            getRoleById: jest.fn().mockResolvedValue({
              id: 1,
              roleName: 'Admin',
              description: 'Administrator role',
              createdBy: 0,
              createdAt: new Date(),
              updatedBy: 0,
              updatedAt: new Date(),
            }),
            updateRole: jest.fn().mockResolvedValue({
              id: 1,
              roleName: 'New Admin',
              description: 'Updated description',
              createdBy: 0,
              createdAt: new Date(),
              updatedBy: 0,
              updatedAt: new Date(),
            }),
            deleteRole: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AuthService, // Provide the mock AuthService
          useValue: {
            validateUser: jest.fn().mockResolvedValue(true),
          },
        },
        AuthGuard, // Provide the AuthGuard
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const createRoleDto: CreateRoleDto = {
        roleName: 'Admin',
        createdBy: 0,
      };
      const userAuth = { userId: 1, accessToken: 'some-token' };
      const createdRole: Role = {
        id: 1,
        roleName: 'Admin',
        description: '',
        createdBy: 0,
        createdAt: expect.any(Date),
        updatedBy: 0,
        updatedAt: expect.any(Date),
      };
      const result = await controller.createRole(userAuth, createRoleDto);
      expect(result).toEqual({
        id: 1,
        roleName: 'Admin',
        description: 'Administrator role',
        createdBy: 0,
        createdAt: expect.any(Date),
        updatedBy: 0,
        updatedAt: expect.any(Date),
      });
      expect(roleService.createRole).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('getRoles', () => {
    it('should get all roles', async () => {
      const roles: Role[] = [
        {
          id: 1,
          roleName: 'Admin',
          description: 'Administrator role',
          createdBy: 0,
          createdAt: expect.any(Date),
          updatedBy: 0,
          updatedAt: expect.any(Date),
        },
        {
          id: 2,
          roleName: 'User',
          description: 'User role',
          createdBy: 0,
          createdAt: expect.any(Date),
          updatedBy: 0,
          updatedAt: expect.any(Date),
        },
      ];
      jest.spyOn(roleService, 'getRoles').mockResolvedValue(roles);

      const userAuth = { userId: 1, accessToken: 'some-token' };
      const result = await controller.getRoles(userAuth);
      expect(result).toEqual(roles);
      expect(roleService.getRoles).toHaveBeenCalled();
    });
  });

  describe('getRoleById', () => {
    it('should get role by id', async () => {
      const roleId = 1;
      const role: Role = {
        id: roleId,
        roleName: 'Admin',
        description: 'Administrator role',
        createdBy: 0,
        createdAt: expect.any(Date),
        updatedBy: 0,
        updatedAt: expect.any(Date),
      };
      jest.spyOn(roleService, 'getRoleById').mockResolvedValue(role);

      const userAuth = { userId: 1, accessToken: 'some-token' };
      const result = await controller.getRoleById(userAuth, roleId);
      expect(result).toEqual(role);
      expect(roleService.getRoleById).toHaveBeenCalledWith(roleId);
    });
  });

  describe('updateRole', () => {
    it('should update role', async () => {
      const roleId = 1;
      const updateRoleDto: UpdateRoleDto = {
        roleName: 'New Admin',
        updatedBy: 0,
      };
      const updatedRole: Role = {
        id: roleId,
        roleName: 'New Admin',
        description: 'Updated description',
        createdBy: 0,
        createdAt: expect.any(Date),
        updatedBy: 0,
        updatedAt: expect.any(Date),
      };
      const userAuth = { userId: 1, accessToken: 'some-token' };
      const result = await controller.updateRole(
        userAuth,
        roleId,
        updateRoleDto,
      );
      expect(result).toEqual(updatedRole);
      expect(roleService.updateRole).toHaveBeenCalledWith(
        roleId,
        updateRoleDto,
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete role', async () => {
      const roleId = 1;
      const userAuth = { userId: 1, accessToken: 'some-token' };
      const result = await controller.deleteRole(userAuth, roleId);
      expect(result).toBeUndefined();
      expect(roleService.deleteRole).toHaveBeenCalledWith(roleId);
    });
  });
});
