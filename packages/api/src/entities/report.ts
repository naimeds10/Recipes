import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Expose, Type } from 'class-transformer'
import { ReportType } from '@recipes/api-types/v1'
import Recipe from './recipe'

@Entity('report')
export default class Report {
    @Expose()
    @PrimaryGeneratedColumn()
    public readonly id!: number

    @Expose()
    @Column()
    public description!: string

    @Expose()
    @Column({ type: 'enum', enum: ReportType })
    public category!: ReportType

    @Expose({ name: 'recipe_id' })
    @Column({ name: 'recipe_id' })
    public recipeId!: number

    @Expose()
    @Type(() => Recipe)
    @ManyToOne(() => Recipe, (recipe) => recipe.reports)
    public recipes?: Recipe[]
}
