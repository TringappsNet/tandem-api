import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/common/dto/register.dto';
import { Users } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async registerDetails(register: RegisterDto) {
    const user = new Users();

    user.email = register.email;
    user.password = await bcrypt.hash(register.password, 10);
    user.firstname = register.firstname;
    user.lastname = register.lastname;
    user.address = register.address;
    user.city = register.city;
    user.state = register.state;
    user.country = register.country;
    user.pincode = register.pincode;
    user.referenceBrokerId = register.referenceBrokerId;
    user.ssn = register.ssn;
    user.age = register.age;
    user.roleId = register.role;

    await this.userRepository.save(user);

    return { message: 'Registered Successfully!' };
  }
}
