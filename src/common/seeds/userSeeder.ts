import { DataSource } from 'typeorm';
import { Users } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export const seedUsers = async (dataSource: DataSource) => {
  const existingUsers = await dataSource.getRepository(Users).find();
  if (existingUsers.length === 0) {
    await dataSource.getRepository(Users).save({
      email: 'tandeminfrastructure@gmail.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      mobile: '1234567890',
      address: '123 Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      country: 'Admin Country',
      zipcode: '12345',
      isActive: true,
    });
  }
};
