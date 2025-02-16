// src/models/Session.ts
import { Table, Column, Model, DataType} from 'sequelize-typescript'; // Removed ForeignKey and BelongsTo for strict User relation
import { z } from 'zod';
const SessionSchema = z.object({
  id: z.number().optional(),
  userId: z.number(), // Keep userId as number, but it can refer to any 'user-like' entity
  entityType: z.enum(['USER' , 'ADMIN' , 'TEACHER' , 'PARENT']), // Store entity type in session
  token: z.string().uuid(),
  expiryDate: z.date(),
  userAgent: z.string().nullable(),
  ipAddress: z.string().nullable(),
});

interface SessionZod extends z.infer<typeof SessionSchema> {};

@Table({
  tableName: 'sessions',
})
export class Session extends Model<SessionZod> implements SessionZod {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  // Removed strict ForeignKey and BelongsTo to User
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  // Removed BelongsTo -  Session is now less strictly tied to a specific User model in schema

  @Column({
    type: DataType.ENUM('ADMIN','TEACHER','USER','PARENT'), // Store entity type here
    allowNull: false,
  })
  entityType!: 'USER' | 'ADMIN' | 'TEACHER' | 'PARENT';


  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiryDate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userAgent!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipAddress!: string | null;
}

export { SessionSchema };