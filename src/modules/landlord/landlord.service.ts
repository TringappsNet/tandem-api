import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landlord } from './entities/landlord.entity';
import { CreateLandlordDto } from './dto/create-landlord.dto';
import { UpdateLandlordDto } from './dto/update-landlord.dto';

@Injectable()
export class LandlordService {
  constructor(
    @InjectRepository(Landlord)
    private readonly landlordRepository: Repository<Landlord>,
  ) {}

  async create(createLandlordDto: CreateLandlordDto): Promise<Landlord> {
    const landlord = this.landlordRepository.create(createLandlordDto);
    return await this.landlordRepository.save(landlord);
  }

  async findAll(): Promise<Landlord[]> {
    return await this.landlordRepository.find();
  }

  async findOne(id: number): Promise<Landlord> {
    const landlord = await this.landlordRepository.findOneBy({ id });
    if (!landlord) {
      throw new NotFoundException(`Landlord with ID ${id} not found`);
    }
    return landlord;
  }

  async update(id: number, updateLandlordDto: UpdateLandlordDto): Promise<Landlord> {
    const landlord = await this.landlordRepository.preload({
      id: id,
      ...updateLandlordDto,
    });
    if (!landlord) {
      throw new NotFoundException(`Landlord with ID ${id} not found`);
    }
    return await this.landlordRepository.save(landlord);
  }

  async remove(id: number): Promise<void> {
    const landlord = await this.findOne(id);
    await this.landlordRepository.remove(landlord);
  }
}
