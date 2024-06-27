import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sites')
export class Sites {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'address_line_1',
        type: 'varchar',
        length: 255
    })
    addressLine1: string;

    @Column({
        name: 'address_line_2',
        type: 'varchar',
        length: 255
    })
    addressLine2: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    state: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    city: string;

    @Column({
        type: 'varchar',
        length: 10
    })
    zipcode: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    country: string;
}
