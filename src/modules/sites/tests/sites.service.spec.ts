import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from '../sites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sites } from '../../../common/entities/sites.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateSiteDto } from '../../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../../common/dto/update-site.dto';

describe('SitesService', () => {
  let service: SitesService;
  let sitesRepository: Repository<Sites>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        {
          provide: getRepositoryToken(Sites),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
    sitesRepository = module.get<Repository<Sites>>(getRepositoryToken(Sites));
  });

  describe('createSite', () => {
    it('should create and return a site', async () => {
      const createSiteDto: CreateSiteDto = {
        landlordId: 1,
        isNew: true,
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'CA',
        city: 'Los Angeles',
        zipcode: '90001',
        country: 'USA',
        createdBy: 1,
      };

      const savedSite: Sites = {
        landlordId: 1,
        id: 1,
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'CA',
        city: 'Los Angeles',
        zipcode: '90001',
        country: 'USA',
        createdBy: 1,
        updatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(sitesRepository, 'create').mockReturnValue(savedSite);
      jest.spyOn(sitesRepository, 'save').mockResolvedValue(savedSite);

      expect(await service.createSite(createSiteDto)).toEqual(savedSite);
    });
  });

  describe('getAllSites', () => {
    it('should return an array of sites', async () => {
      const sitesArray: Sites[] = [
        {
          id: 1,
          landlordId: 1,
          addressline1: '123 Main St',
          addressline2: 'Apt 4B',
          state: 'CA',
          city: 'Los Angeles',
          zipcode: '90001',
          country: 'USA',
          createdBy: 1,
          updatedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(sitesRepository, 'find').mockResolvedValue(sitesArray);

      expect(await service.getAllSites()).toEqual(sitesArray);
    });
  });

  describe('getSiteById', () => {
    it('should return a site by ID', async () => {
      const site: Sites = {
        landlordId: 1,
        id: 1,
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'CA',
        city: 'Los Angeles',
        zipcode: '90001',
        country: 'USA',
        createdBy: 1,
        updatedBy: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(sitesRepository, 'findOne').mockResolvedValue(site);

      expect(await service.getSiteById(1)).toEqual(site);
    });

    it('should throw NotFoundException if site not found', async () => {
      jest.spyOn(sitesRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getSiteById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSite', () => {
    it('should update and return a site', async () => {
      const updateSiteDto: UpdateSiteDto = {
        landlordId: 1,
        addressline1: '456 Elm St',
        addressline2: 'Suite 5C',
        state: 'TX',
        city: 'Dallas',
        zipcode: '75201',
        country: 'USA',
        updatedBy: 3,
      };

      const existingSite: Sites = {
        landlordId: 1,
        id: 1,
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'CA',
        city: 'Los Angeles',
        zipcode: '90001',
        country: 'USA',
        createdBy: 1,
        updatedBy: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedSite: Sites = {
        ...existingSite,
        ...updateSiteDto,
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'getSiteById').mockResolvedValue(existingSite);
      jest.spyOn(sitesRepository, 'save').mockResolvedValue(updatedSite);

      expect(await service.updateSite(1, updateSiteDto)).toEqual(updatedSite);
    });
  });
});
