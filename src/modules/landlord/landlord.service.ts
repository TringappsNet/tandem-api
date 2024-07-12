import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landlord } from '../../common/entities/landlord.entity';
import { CreateLandlordDto } from '../../common/dto/create-landlord.dto';
import { UpdateLandlordDto } from '../../common/dto/update-landlord.dto';

@Injectable()
export class LandlordService {
  constructor(
    @InjectRepository(Landlord)
    private readonly landlordRepository: Repository<Landlord>,
  ) {}

  async create(createLandlordDto: CreateLandlordDto): Promise<Landlord> {
    const landlord = this.landlordRepository.create(createLandlordDto);
    if (!landlord) {
      throw new BadRequestException();
    }
    return await this.landlordRepository.save(landlord);
  }

  async findAll(): Promise<Landlord[]> {
    const Landlord = await this.landlordRepository.find();
    if (Landlord.length === 0) {
      throw new NotFoundException();
    }
    return Landlord;
  }

  async findOne(id: number): Promise<Landlord> {
    const landlord = await this.landlordRepository.findOneBy({ id });
    if (!landlord) {
      throw new NotFoundException();
    }
    return landlord;
  }

  async update(
    id: number,
    updateLandlordDto: UpdateLandlordDto,
  ): Promise<Landlord> {
    const landlord = await this.landlordRepository.preload({
      id: id,
      ...updateLandlordDto,
    });
    if (!landlord) {
      throw new NotFoundException();
    }
    return await this.landlordRepository.save(landlord);
  }

  async remove(id: number): Promise<void> {
    const landlord = await this.findOne(id);
    if (!landlord) {
      throw new NotFoundException();
    }
    await this.landlordRepository.remove(landlord);
  }
}
