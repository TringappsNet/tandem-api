import { Test, TestingModule } from '@nestjs/testing';
import { LandlordService } from '../landlord.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Landlord } from '../../../common/entities/landlord.entity';
import { CreateLandlordDto } from '../../../common/dto/create-landlord.dto';
import { UpdateLandlordDto } from '../../../common/dto/update-landlord.dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  preload: jest.fn(),
});

describe('LandlordService', () => {
  let service: LandlordService;
  let repository: MockRepository<Landlord>;

  beforeEach(async () => {
    repository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandlordService,
        { provide: getRepositoryToken(Landlord), useValue: repository },
      ],
    }).compile();

    service = module.get<LandlordService>(LandlordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a landlord', async () => {
      const createLandlordDto: CreateLandlordDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '',
        address1: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
      };
      const createdLandlord: Landlord = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '',
        address1: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: undefined,
        updatedAt: undefined,
        address2: '',
      };

      repository.create.mockReturnValue(createdLandlord);
      repository.save.mockResolvedValue(createdLandlord);

      const result = await service.create(createLandlordDto);
      expect(result).toEqual(createdLandlord);
      expect(repository.create).toHaveBeenCalledWith(createLandlordDto);
      expect(repository.save).toHaveBeenCalledWith(createdLandlord);
    });
  });

  describe('findAll', () => {
    it('should return an array of landlords', async () => {
      const landlords: Landlord[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          country: '',
          zipcode: '',
          createdBy: 0,
          updatedBy: 0,
          createdAt: undefined,
          updatedAt: undefined,
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phoneNumber: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          country: '',
          zipcode: '',
          createdBy: 0,
          updatedBy: 0,
          createdAt: undefined,
          updatedAt: undefined,
        },
      ];
      repository.find.mockResolvedValue(landlords);

      const result = await service.findAll();
      expect(result).toEqual(landlords);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a landlord by id', async () => {
      const landlordId = 1;
      const landlord: Landlord = {
        id: landlordId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: undefined,
        updatedAt: undefined,
      };
      repository.findOneBy.mockResolvedValue(landlord);

      const result = await service.findOne(landlordId);
      expect(result).toEqual(landlord);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: landlordId });
    });

    it('should throw NotFoundException if landlord not found', async () => {
      const landlordId = 1;
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(landlordId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a landlord', async () => {
      const landlordId = 1;
      const updateLandlordDto: UpdateLandlordDto = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phoneNumber: '',
        address1: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
      };
      const existingLandlord: Landlord = {
        id: landlordId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: undefined,
        updatedAt: undefined,
      };
      const updatedLandlord: Landlord = {
        ...existingLandlord,
        ...updateLandlordDto,
      };

      repository.preload.mockResolvedValue(updatedLandlord);
      repository.save.mockResolvedValue(updatedLandlord);

      const result = await service.update(landlordId, updateLandlordDto);
      expect(result).toEqual(updatedLandlord);
      expect(repository.preload).toHaveBeenCalledWith({
        id: landlordId,
        ...updateLandlordDto,
      });
      expect(repository.save).toHaveBeenCalledWith(updatedLandlord);
    });

    it('should throw NotFoundException if landlord not found', async () => {
      const landlordId = 1;
      const updateLandlordDto: UpdateLandlordDto = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phoneNumber: '',
        address1: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
      };

      repository.preload.mockResolvedValue(null);

      await expect(
        service.update(landlordId, updateLandlordDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a landlord', async () => {
      const landlordId = 1;
      const landlord: Landlord = {
        id: landlordId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: undefined,
        updatedAt: undefined,
      };

      repository.findOneBy.mockResolvedValue(landlord);
      repository.remove.mockResolvedValue(undefined);

      await expect(service.remove(landlordId)).resolves.toBeUndefined();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: landlordId });
      expect(repository.remove).toHaveBeenCalledWith(landlord);
    });

    it('should throw NotFoundException if landlord not found', async () => {
      const landlordId = 1;

      repository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(landlordId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
