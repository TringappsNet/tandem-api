// // ChangeAuditSubscriber.ts
// import { 
//     EntitySubscriberInterface, 
//     EventSubscriber, 
//     InsertEvent,
//     UpdateEvent,
//     RemoveEvent,
//     SoftRemoveEvent,
//     Repository,
//   } from 'typeorm';
//   import { Inject, Injectable } from '@nestjs/common';
//   // import { AuditLogService } from '../methods/audit-log/audit-log.service'; 
//   import { allowedActions, DealsHistory } from '../entities/deals.history.entity';
//   import { Deals } from '../entities/deals.entity';
//   import { Users } from '../entities/user.entity';
//   import { ClsService } from 'nestjs-cls';
//   import { MyClsStore } from '../interfaces/cls-store.interface';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DealsService } from 'src/modules/deals/deals.service';
  
//   @Injectable()
//   @EventSubscriber()
//   export class ChangeAuditSubscriber implements EntitySubscriberInterface<Deals> {
//     constructor(
//       // private clsService: ClsService<MyClsStore>,
//       // private auditLogService: DealsService,
//       @InjectRepository(DealsHistory) private dealsHistoryRepository: Repository<DealsHistory>,
//       // @Inject(AuditLogService) private readonly auditLogService: AuditLogService,
//     ) {
//       console.log("Change Audit", this.dealsHistoryRepository);
//     }  

//     listenTo(): Function | string {
//         return Deals;
//     }
    
//     async createAuditLog(deals: Partial<DealsHistory>): Promise<DealsHistory> {
//       // const dealData = this.dealsHistoryRepository.create(deals);
//       console.log(this.dealsHistoryRepository);
//       const saveData = await this.dealsHistoryRepository.save(deals);
//       return saveData;
//     }

//     // private get user(): Users {
//     //   const users = this.clsService.get('user');
//     //   console.log(users);
//     //   return users;
//     // }


  
//     async afterInsert(event: InsertEvent<Deals>) {
//        // const entityBefore = event['databaseEntity'];
//        const entityAfter = event.entity;
//        console.log(event.entity);
//        const entityType = event.metadata.targetName;
  
//        try {
//         if (entityType === DealsHistory.name) return;
  
//         const entityId = entityAfter.id;
//         // const user:Users = this.clsService.get('user');
//         // console.log(user);
  
//         const auditLog = {
//           dealId: entityId,
//           dealState: JSON.stringify(entityAfter),
//           date: new Date(Date.now()),
//           action: allowedActions.CREATE,
//           createdBy: Number(entityAfter.createdBy),
//         };
    
//         return await this.createAuditLog(auditLog);
        
//         } catch (error) {
//           return error;
//         }
//     }

//     afterUpdate(event: UpdateEvent<Deals>) {
//     // const entityBefore = event['databaseEntity'];
//        const entityAfter = event.entity;
//        console.log(event.entity);
//        const entityType = event.metadata.targetName;
  
//        try {
//         if (entityType === DealsHistory.name) return;
  
//         const entityId = entityAfter.id;
//         // const user = this.clsService.get('user');
  
//         const auditLog = {
//           id: entityId,
//           dealId: entityAfter.id,
//           dealState: JSON.stringify(entityAfter),
//           date: new Date(Date.now()),
//           action: allowedActions.UPDATE,
//           createdBy: Number(entityAfter.createdBy),
//         };
    
//         // return this.auditLogService.createAuditLog(auditLog);
//         } catch (error) {
//           return error;
//         }
//     }
//     afterRemove(event: RemoveEvent<Deals>) {
//     // const entityBefore = event['databaseEntity'];
//        const entityAfter = event.entity;
//        console.log(event.entity);
//        const entityType = event.metadata.targetName;
  
//        try {
//         if (entityType === DealsHistory.name) return;
  
//         const entityId = entityAfter.id;
//         // const user = this.clsService.get('user');
  
//         const auditLog = {
//           id: entityId,
//           dealId: entityAfter.id,
//           dealState: JSON.stringify(entityAfter),
//           date: new Date(Date.now()),
//           action: allowedActions.DELETE,
//           createdBy: Number(entityAfter.createdBy),
//         };
    
//         // return this.auditLogService.createAuditLog(auditLog);
//         } catch (error) {
//           return error;
//         }
//     }
//   }