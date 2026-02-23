import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Spot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  address: string;
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: string;
}

