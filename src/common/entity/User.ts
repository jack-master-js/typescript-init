import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @apiDefine UserEntity
 * @apiBody {String} email 邮箱
 * @apiBody {String} password 密码
 */
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
}
