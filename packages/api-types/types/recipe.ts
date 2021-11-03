import { Optional } from './base'
import { Instruction } from './instruction'
import { RecipeIngredient } from './recipe-ingredient'

export class Recipe {
    constructor(
        id = 0,
        sectionId = 0,

        name = '',
        description = '',
        prepareTime = 0,
        peopleCount = 0,
        recipeIngredients: RecipeIngredient[] = [new RecipeIngredient()],
        instructions: Instruction[] = [new Instruction()],
        createdAt = new Date(),
        position = 0,

        publishedAt: Date | null = null,
        copyOf: number | null = null
    ) {
        this.id = id
        this.sectionId = sectionId

        this.name = name
        this.description = description
        this.prepareTime = prepareTime
        this.peopleCount = peopleCount
        this.recipeIngredients = recipeIngredients
        this.instructions = instructions
        this.createdAt = createdAt
        this.position = position

        this.publishedAt = publishedAt
        this.copyOf = copyOf
    }

    public readonly id!: number
    public sectionId!: number
    public name!: string
    public description!: string
    public prepareTime!: number
    public peopleCount!: number
    public recipeIngredients!: RecipeIngredient[]
    public instructions!: Instruction[]
    public createdAt!: Date
    public position!: number

    public publishedAt!: Date | null
    public copyOf!: number | null
}

export type RecipeCreate = Optional<
    Omit<Recipe, 'id' | 'recipeIngredients' | 'instructions' | 'sectionId'>,
    'createdAt' | 'publishedAt' | 'copyOf'
>

export type RecipeUpdate = Pick<Recipe, 'id'> &
    Partial<Omit<RecipeCreate, 'createdAt' | 'copyOf'>>
