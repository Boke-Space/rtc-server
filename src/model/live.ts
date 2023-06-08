import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Live {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'tinyint', width: 1 })
    isLive!: boolean;

    @Column({ name: 'room_id' })
    roomId!: string;

    @Column({ name: 'room_name' })
    roomName!: string;

    @Column({ name: 'cover_img', nullable: true })
    coverImg!: string;
    
    @Column({ name: 'stream_url', nullable: true })
    streamUrl!: string;

    @Column({ name: 'flv_url' })
    flvUrl!: string;

    @CreateDateColumn({ name: 'create_time', type: 'timestamp' })
    createTime!: Date;


}
