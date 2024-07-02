import { Test, TestingModule } from '@nestjs/testing';
import { SitesController } from '../sites.controller';
import { SitesService } from '../sites.service';
import { CreateSiteDto } from '../../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../../common/dto/update-site.dto';
import { Sites } from '../../../common/entities/sites.entity';
import { NotFoundException } from '@nestjs/common';

describe('SitesController', () => {
  let controller: SitesController;
  let service: SitesService;

  const mockSite: Sites = {
    id: 1,
    addressline1: '123 Main St',
    addressline2: 'Apt 4B',
    state: 'CA',
    city: 'Los Angeles',
    zipcode: '90001',
    country: 'USA',
    createdBy: 1,
    updatedBy: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateSiteDto: CreateSiteDto = {
    isNew:true,
    addressline1: '123 Main St',
    addressline2: 'Apt 4B',
    state: 'CA',
    city: 'Los Angeles',
    zipcode: '90001',
    country: 'USA',
    createdBy: 1,
    
  };

  const mockUpdateSiteDto: UpdateSiteDto = {
    
    addressline1: '456 Elm St',
    addressline2: 'Suite 500',
    state: 'CA',
    city: 'Los Angeles',
    zipcode: '90001',
    country: 'USA',
    updatedBy: 2,
  };

  const mockSitesService = {
    createSite: jest.fn().mockResolvedValue(mockSite),
    getAllSites: jest.fn().mockResolvedValue([mockSite]),
    getSiteById: jest.fn().mockResolvedValue(mockSite),
    updateSite: jest.fn().mockResolvedValue({ ...mockSite, ...mockUpdateSiteDto }),
    deleteSiteById: jest.fn().mockResolvedValue(mockSite),
  };

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

  describe('createSite', () => {
    it('should create and return a site', async () => {
      const result = await controller.createSite(mockCreateSiteDto);
      expect(result).toEqual(mockSite);
      expect(service.createSite).toHaveBeenCalledWith(mockCreateSiteDto);
    });
  });

  describe('getAllSites', () => {
    it('should return an array of sites', async () => {
      const result = await controller.getAllSites();
      expect(result).toEqual([mockSite]);
      expect(service.getAllSites).toHaveBeenCalled();
    });
  });

  describe('getSiteById', () => {
    it('should return a site by id', async () => {
      const result = await controller.getSiteById(1);
      expect(result).toEqual(mockSite);
      expect(service.getSiteById).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if site not found', async () => {
      jest.spyOn(service, 'getSiteById').mockRejectedValueOnce(new NotFoundException());
      await expect(controller.getSiteById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSiteById', () => {
    it('should update and return a site', async () => {
      const result = await controller.updateSiteById(1, mockUpdateSiteDto);
      expect(result).toEqual({ ...mockSite, ...mockUpdateSiteDto });
      expect(service.updateSite).toHaveBeenCalledWith(1, mockUpdateSiteDto);
    });
  });

  describe('deleteSiteById', () => {
    it('should delete a site by id and return it', async () => {
      const result = await controller.deleteSiteById(1);
      expect(result).toEqual(mockSite);
      expect(service.deleteSiteById).toHaveBeenCalledWith(1);
    });
  });
});
