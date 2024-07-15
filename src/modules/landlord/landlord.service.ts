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
    try {
      const landlord = this.landlordRepository.create(createLandlordDto);
      if (!landlord) {
        throw new BadRequestException(
          'The specified landlord is not created properly',
        );
      }
      return await this.landlordRepository.save(landlord);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Landlord[]> {
    try {
      const Landlord = await this.landlordRepository.find();
      if (Landlord.length === 0) {
        throw new NotFoundException('Landlords');
      }
      return Landlord;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Landlord> {
    try {
      const landlord = await this.landlordRepository.findOneBy({ id });
      if (!landlord) {
        throw new NotFoundException(`Landlord with ID ${id}`);
      }
      return landlord;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateLandlordDto: UpdateLandlordDto,
  ): Promise<Landlord> {
    try {
      const landlord = await this.landlordRepository.preload({
        id: id,
        ...updateLandlordDto,
      });
      if (!landlord) {
        throw new NotFoundException(`Landlord with ID ${id}`);
      }
      return await this.landlordRepository.save(landlord);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const landlord = await this.findOne(id);
      if (!landlord) {
        throw new NotFoundException(`Landlord with ID ${id}`);
      }
      await this.landlordRepository.remove(landlord);
    } catch (error) {
      throw error;
    }
  }
}
