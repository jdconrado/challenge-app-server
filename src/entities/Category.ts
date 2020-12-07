import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm";
import {IsNotEmpty, MaxLength} from "class-validator";
import Product from "./Product";

@Entity()
export default class Category extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({unique: true})
    @IsNotEmpty()
    @MaxLength(15)
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(()=>Product, product => product.category)
    products!: Product[]

    public static listAll(){
        return this.createQueryBuilder("category")
            .select("category.id")
            .addSelect("category.name")
            .cache("categories", 120000)
            .getMany()
    }

}