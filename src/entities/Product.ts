import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {IsInt, Min, IsDecimal, IsNotEmpty} from "class-validator";
import Category from "./Category";
import User from "./User";

export interface Filters{
    title?: string
    categoryId?:number
    price?: {
        from: number,
        to: number
    }
    stock?: {
        from: number,
        to: number
    }
    page: number
}

@Entity()
export default class Product extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column({nullable: false})
    @IsNotEmpty()
    title!: string;

    @ManyToOne(()=> Category, category=>category.products)
    category!: Category;

    @ManyToOne(()=>User, user=>user.products)
    user!: User;

    @Column({nullable: false})
    @IsNotEmpty()
    @Min(0)
    price!: number;

    @Column({default: 0})
    @IsInt()
    @Min(0)
    stock!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    public static search(filters: Filters){
        let query = "";
        let values: any = {};

        if (filters.title !== undefined){
            query+= "product.title like :title";
            values.title = `%${filters.title}%`;
        }
        if (filters.categoryId !== undefined){
            query = this.formQuery(query, "product.categoryId = :categoryId");
            values.categoryId = filters.categoryId;
        }
        if (filters.price !== undefined){
            query = this.formQuery(query, "product.price >= :priceFrom AND product.price <= :priceTo");
            values.priceTo = filters.price.to;
            values.priceFrom = filters.price.from;
        }
        if (filters.stock !== undefined){
            query = this.formQuery(query,"product.stock >= :stockFrom AND product.stock <= :stockTo");
            values.stockTo = filters.stock.to;
            values.stockFrom = filters.stock.from;
        }
        if (query===""){
            return this.createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .limit(20)
            .offset(filters.page*20)
            .orderBy("product.id", "DESC")
            .getMany();
        }
        return this.createQueryBuilder("product")
            .where(query, values)
            .leftJoinAndSelect("product.category", "category")
            .limit(20)
            .offset(filters.page*20)
            .orderBy("product.id", "DESC")
            .getMany();
    }

    private static formQuery(query: string, statement: string) : string {
        if (query !== ""){
            query+=`AND ${statement}`;
        }else{
            query= statement;
        }
        return query;
    }

    public static getOneWithUser(id: number){
        return this.createQueryBuilder("product")
            .leftJoinAndSelect("product.user", "user")
            .where("product.id = :id", {id: id})
            .getOne();
    }

    public static getOneWithCategory(id: number){
        return this.createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.id = :id", {id: id})
            .getOne();
    }

    public static getUserProducts(userId: number, page: number){
        return this.createQueryBuilder("product")
            .where("product.userId = :userId",{userId: userId})
            .leftJoinAndSelect("product.category", "category")
            .limit(20)
            .offset(page*20)
            .orderBy("product.id", "DESC")
            .getMany();
    }
}