import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('dealsHistory')
export class DealsHistory {
    @PrimaryGeneratedColumn({
        name: 'id',
        comment: 'This is a unique identifier',
    })
    id: number;

    @Column()
    dealId: number;

    @Column('json')
    dealState: string;

    @Column()
    date: Date = undefined;

    @Column()
    action: string;
}