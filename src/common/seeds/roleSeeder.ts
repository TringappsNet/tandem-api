import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';

export const seedRole = async (dataSource: DataSource) => {
  const existingUsers = await dataSource.getRepository(Role).find();
  if (existingUsers.length === 0) {
    await dataSource.getRepository(Role).save([
      {
        roleName: 'admin',
        description: 'admin-role',
        createdBy: 1,
        createdAt: new Date(Date.now()),
        updatedBy: 1,
        updatedAt: new Date(Date.now()),
      },
      {
        roleName: 'broker',
        description: 'broker-role',
        createdBy: 1,
        createdAt: new Date(Date.now()),
        updatedBy: 1,
        updatedAt: new Date(Date.now()),
      },
    ]);
  }
};
