import { Test, TestingModule } from '@nestjs/testing';
import { SitesController } from '../sites.controller';
import { SitesService } from '../sites.service';
import { CreateSiteDto } from '../../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../../common/dto/update-site.dto';
import { Sites } from '../../../common/entities/sites.entity';
import { Users } from '../../../common/entities/user.entity'; 

const mockSitesService = {
  createSite: jest.fn((dto: CreateSiteDto) => Promise.resolve({
    ...dto,
    id: Date.now(),
    createdBy: { id: 1, name: 'User One' } as unknown as Users, 
    updatedBy: { id: 1, name: 'User One' } as unknown as Users, 
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sites)),
  getSitesByCreatedBy: jest.fn((createdBy: number) => Promise.resolve([
    {
      id: 1,
      addressline1: '123 Main St',
      addressline2: 'Apt 4B',
      state: 'CA',
      city: 'Los Angeles',
      zipcode: '90001',
      country: 'USA',
      createdBy: { id: createdBy, name: 'User One' } as unknown as Users,
      updatedBy: { id: createdBy, name: 'User One' } as unknown as Users,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Sites,
  ])),
  getSiteById: jest.fn((id: number) => Promise.resolve({
    id,
    addressline1: '123 Main St',
    addressline2: 'Apt 4B',
    state: 'CA',
    city: 'Los Angeles',
    zipcode: '90001',
    country: 'USA',
    createdBy: { id: 1, name: 'User One' } as unknown as Users,
    updatedBy: { id: 1, name: 'User One' } as unknown as Users,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sites)),
  updateSiteById: jest.fn((id: number, dto: UpdateSiteDto) => Promise.resolve({
    ...dto,
    id,
    createdBy: { id: 1, name: 'User One' } as unknown as Users,
    updatedBy: { id: 1, name: 'User One' } as unknown as Users,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sites)),
  deleteSiteById: jest.fn((id: number) => Promise.resolve({
    id,
    addressline1: '123 Main St',
    addressline2: 'Apt 4B',
    state: 'CA',
    city: 'Los Angeles',
    zipcode: '90001',
    country: 'USA',
    createdBy: { id: 1, name: 'User One' } as unknown as Users,
    updatedBy: { id: 1, name: 'User One' } as unknown as Users,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sites)),
};

describe('SitesController', () => {
  let controller: SitesController;
  let service: SitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitesController],
      providers: [
        {
          provide: SitesService,
          useValue: mockSitesService,
        },
      ],
    }).compile();

    controller = module.get<SitesController>(SitesController);
    service = module.get<SitesService>(SitesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


});
