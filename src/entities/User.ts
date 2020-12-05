import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import {MinLength, IsEmail ,IsNotEmpty} from "class-validator";
import Product from "./Product";
import bcrypt from "bcryptjs";

@Entity()
export default class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false})
    @IsNotEmpty()
    name!: string

    @Column({nullable: false})
    @IsNotEmpty()
    lastName!: string

    @Column({nullable: false, unique: true})
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @Column({nullable: false})
    @IsNotEmpty()
    @MinLength(7)
    password!: string

    @OneToMany(()=> Product, product=>product.user)
    products!: Product[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    private hashPassword():void{
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public async comparePassword(password: string): Promise<boolean>{
        return await bcrypt.compare(password, this.password);
    }

    public static getUserInfo(id: number){
        return this.createQueryBuilder("user")
            .select("user.id")
            .addSelect("user.name")
            .addSelect("user.lastName")
            .addSelect("user.email")
            .addSelect("user.createdAt")
            .where("user.id = :id", {id: id})
            .getOne();
    }

}