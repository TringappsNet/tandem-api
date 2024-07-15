import { DataSource } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';

export const seedUserRole = async (dataSource: DataSource) => {
  const existingUsers = await dataSource.getRepository(UserRole).find();
  if (existingUsers.length === 0) {
    await dataSource.getRepository(UserRole).save({
      userId: 1,
      roleId: 1,
    });
  }
};
