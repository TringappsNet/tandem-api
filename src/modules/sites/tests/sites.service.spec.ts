import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from '../sites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sites } from '../../../common/entities/sites.entity'; 
import { Users } from '../../../common/entities/user.entity'; 
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSiteDto } from '../../../common/dto/create-site.dto'; 
import { UpdateSiteDto } from '../../../common/dto/update-site.dto'; 

describe('SitesService', () => {
  let service: SitesService;
  let sitesRepository: MockProxy<Repository<Sites>>;
  let usersRepository: MockProxy<Repository<Users>>;

  beforeEach(async () => {
    sitesRepository = mock<Repository<Sites>>();
    usersRepository = mock<Repository<Users>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        {
          provide: getRepositoryToken(Sites),
          useValue: sitesRepository,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSite', () => {
    it('should create a new site successfully', async () => {
      const createSiteDto = {
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'NY',
        city: 'New York',
        zipcode: '10001',
        country: 'USA',
        createdBy: { id: 1 } as Users,
        updatedBy: { id: 1 } as Users,
        isNew: true,
      };

      const user = { id: 1 } as Users;
      const site = {
        id: 1,
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'NY',
        city: 'New York',
        zipcode: '10001',
        country: 'USA',
        createdBy: user,
        updatedBy: user,
        isNew: true,
        createdAt: new Date(), 
        updatedAt: new Date(), 
      } as Sites;

      usersRepository.findOne.mockResolvedValue(user);
      sitesRepository.create.mockReturnValue(site);
      sitesRepository.save.mockResolvedValue(site);

      const result = await service.createSite(createSiteDto);
      expect(result).toEqual(site);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: createSiteDto.createdBy.id } });
      expect(sitesRepository.create).toHaveBeenCalledWith({ ...createSiteDto, createdBy: user, updatedBy: user });
      expect(sitesRepository.save).toHaveBeenCalledWith(site);
    });

    it('should throw NotFoundException if user not found', async () => {
      const createSiteDto = {
        addressline1: '123 Main St',
        addressline2:'1234',

        state: 'NY',
        city: 'New York',
        zipcode: '10001',
        country: 'USA',
        createdBy: { id: 1 } as Users,
        isNew: true,
      };

      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.createSite(createSiteDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if not a new site', async () => {
      const createSiteDto = {
        addressline1: '123 Main St',
        addressline2:'1234',
        state: 'NY',
        city: 'New York',
        zipcode: '10001',
        country: 'USA',
        createdBy: { id: 1 } as Users,
        isNew: false,
      };

      await expect(service.createSite(createSiteDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSitesByCreatedBy', () => {
    it('should return sites created by the given user', async () => {
      const createdBy = 1;
      const sites = [
        {
          id: 1,
          addressline1: '123 Main St',
          createdAt: new Date(), 
          updatedAt: new Date(), 
        } as Sites,
      ];
      sitesRepository.find.mockResolvedValue(sites);

      const result = await service.getSitesByCreatedBy(createdBy);
      expect(result).toEqual(sites);
      expect(sitesRepository.find).toHaveBeenCalledWith({ where: { createdBy: { id: createdBy } } });
    });
  });

  describe('getSiteById', () => {
    it('should return the site with the given ID', async () => {
      const id = 1;
      const site = {
        id,
        addressline1: '123 Main St',
        createdAt: new Date(), 
        updatedAt: new Date(),
      } as Sites;
      sitesRepository.findOne.mockResolvedValue(site);

      const result = await service.getSiteById(id);
      expect(result).toEqual(site);
      expect(sitesRepository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    });

    it('should throw NotFoundException if site not found', async () => {
      const id = 1;
      sitesRepository.findOne.mockResolvedValue(null);

      await expect(service.getSiteById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSiteById', () => {
    it('should update the site successfully', async () => {
      const id = 1;
      const updateSiteDto: UpdateSiteDto = {
        addressline1: '456 Elm St',
        addressline2: 'Suite 101', 
        state: 'CA',
        city: 'Los Angeles',
        zipcode: '90001',
        country: 'USA',
        updatedBy: { id: 2 } as Users,
      };
      
      const existingSite = {
        id,
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'NY',
        city: 'New York',
        zipcode: '10001',
        country: 'USA',
        createdAt: new Date(), 
        updatedAt: new Date(),
      } as Sites;
  
      const updatedSite = {
        ...existingSite,
        ...updateSiteDto,
        updatedBy: updateSiteDto.updatedBy,
      } as Sites;
      
      const user = { id: 2 } as Users;
  
      sitesRepository.findOne.mockResolvedValue(existingSite);
      usersRepository.findOne.mockResolvedValue(user);
      sitesRepository.merge.mockReturnValue(updatedSite);
      sitesRepository.save.mockResolvedValue(updatedSite);
  
      const result = await service.updateSiteById(id, updateSiteDto);
      expect(result).toEqual(updatedSite);
      expect(sitesRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['createdBy', 'updatedBy'],
      });      
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: updateSiteDto.updatedBy.id } });
      expect(sitesRepository.merge).toHaveBeenCalledWith(existingSite, updateSiteDto, { updatedBy: user });
      expect(sitesRepository.save).toHaveBeenCalledWith(updatedSite);
    });
  
    it('should throw NotFoundException if site not found during update', async () => {
      const id = 1;
      const updateSiteDto: UpdateSiteDto = {
        addressline1: '456 Elm St',
        addressline2: 'Suite 101',
        state: 'CA',
        city: 'Los Angeles',
        zipcode: '90001',
        country: 'USA',
        updatedBy: { id: 2 } as Users,
      };
  
      sitesRepository.findOne.mockResolvedValue(null);
  
      await expect(service.updateSiteById(id, updateSiteDto)).rejects.toThrow(NotFoundException);
    });
  
    it('should throw NotFoundException if user not found during update', async () => {
      const id = 1;
      const updateSiteDto: UpdateSiteDto = {
        addressline1: '456 Elm St',
        addressline2: 'Suite 101',
        state: 'CA',
        city: 'Los Angeles',
        zipcode: '90001',
        country: 'USA',
        updatedBy: { id: 2 } as Users,
      };
      const existingSite = {
        id,
        addressline1: '123 Main St',
        addressline2: 'Apt 4B',
        state: 'NY',
        city: 'New York',
        zipcode: '10001',
        country: 'USA',
        createdAt: new Date(), 
        updatedAt: new Date(), 
      } as Sites;
  
      sitesRepository.findOne.mockResolvedValue(existingSite);
      usersRepository.findOne.mockResolvedValue(null);
  
      await expect(service.updateSiteById(id, updateSiteDto)).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('deleteSiteById', () => {
    it('should delete the site successfully', async () => {
      const id = 1;
      const site = {
        id,
        addressline1: '123 Main St',
        createdAt: new Date(), 
        updatedAt: new Date(), 
      } as Sites;

      sitesRepository.findOne.mockResolvedValue(site);
      sitesRepository.remove.mockResolvedValue(site);

      const result = await service.deleteSiteById(id);
      expect(result).toEqual(site);
      expect(sitesRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['createdBy', 'updatedBy'],
      });      
      expect(sitesRepository.remove).toHaveBeenCalledWith(site);
    });

    it('should throw NotFoundException if site not found during deletion', async () => {
      const id = 1;
      sitesRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteSiteById(id)).rejects.toThrow(NotFoundException);
    });
  });
});
