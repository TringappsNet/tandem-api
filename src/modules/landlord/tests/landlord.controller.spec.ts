import { Test, TestingModule } from '@nestjs/testing';
import { LandlordController } from '../landlord.controller';
import { LandlordService } from '../landlord.service';
import { CreateLandlordDto } from '../dto/create-landlord.dto';
import { UpdateLandlordDto } from '../dto/update-landlord.dto';
import { Landlord } from '../entities/landlord.entity';

describe('LandlordController', () => {
  let controller: LandlordController;
  let service: LandlordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandlordController],
      providers: [
        {
          provide: LandlordService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LandlordController>(LandlordController);
    service = module.get<LandlordService>(LandlordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a landlord', async () => {
      const createLandlordDto: CreateLandlordDto = {
        name: '',
        phoneNumber: '',
        email: '',
        address1: '',
        city: '',
        state: '',
        country: '',
        zipcode: ''
      };
      const result: Landlord = {
        name: '',
        phoneNumber: '',
        email: '',
        address1: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        id: 0,
        address2: '',
        createdBy: 0,
        updatedBy: 0,
        createdAt: undefined,
        updatedAt: undefined
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createLandlordDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createLandlordDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of landlords', async () => {
      const result: Landlord[] = [/* fill with appropriate data */];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single landlord', async () => {
      const result: Landlord = {
        id: 0,
        name: '',
        phoneNumber: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        createdAt: undefined,
        updatedAt: undefined,
        createdBy: 0,
        updatedBy: 0
      };
      const id = 1;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a landlord', async () => {
      const updateLandlordDto: UpdateLandlordDto = {
        name: '',
        phoneNumber: '',
        email: '',
        address1: '',
        city: '',
        state: '',
        country: '',
        zipcode: ''
      };
      const result: Landlord = {
        id: 0,
        name: '',
        phoneNumber: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        createdAt: undefined,
        updatedAt: undefined,
        createdBy: 0,
        updatedBy: 0
      };
      const id = 1;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateLandlordDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(id, updateLandlordDto);
    });
  });

  describe('remove', () => {
    it('should remove a landlord', async () => {
      const id = 1;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(id)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});