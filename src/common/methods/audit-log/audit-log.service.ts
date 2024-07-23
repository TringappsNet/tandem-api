// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DealsHistory } from 'src/common/entities/deals.history.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class AuditLogService {
//     constructor(
//         @InjectRepository(DealsHistory) private dealsHistoryRepository: Repository<DealsHistory>,
//     ) {}

//     async createAuditLog(deals: DealsHistory): Promise<DealsHistory> {
//         const dealData = this.dealsHistoryRepository.create(deals);
//         const saveData = await this.dealsHistoryRepository.save(dealData);
//         return saveData;
//     }
// }
