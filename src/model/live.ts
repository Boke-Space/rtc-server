import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Live {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    socketId!: string;

    @Column({ name: 'room_id' })
    roomId!: string;

    @Column({ name: 'room_name' })
    roomName!: string;
    
    @Column({ name: 'stream_url', nullable: true })
    streamUrl!: string;

    @Column({ name: 'flv_url' })
    flvUrl!: string;

    @CreateDateColumn({ name: 'create_time', type: 'timestamp' })
    createTime!: Date;

    @CreateDateColumn({ name: 'delete_time', type: 'timestamp', nullable: true, default: null })
    deleteTime!: Date;

}
