import Recipe from '../data/recipe'
import RecipeIngredient from '../data/recipe-ingredient'
import Instruction from '../data/instruction'
import handleError from './base'

export async function createRecipes(
    body: {
        name: string
        description: string
        prepareTime: number
        peopleCount: number
    }[]
): Promise<Recipe[]> {
    return handleError('POST', '/recipes/bulk', { body })
}

export async function getMyRecipes(): Promise<Recipe[]> {
    return handleError('GET', '/recipes', {})
}

export async function getRecipe(recipeId: number): Promise<Recipe> {
    return handleError('GET', `/recipes/${recipeId}`)
}

export async function deleteRecipe(recipeId: number): Promise<void> {
    return handleError('DELETE', `/recipes/${recipeId}`)
}

export async function updateRecipe(
    recipeId: number,
    body: {
        name?: string
        description?: string
        prepareTime?: number
        peopleCount?: number
    }
): Promise<Recipe> {
    return handleError('PUT', `/recipes/${recipeId}`, { body })
}

export async function addIngredients(
    recipeId: number,
    body: Array<{ amount: number; name: string; unit: string | null }>
): Promise<RecipeIngredient[]> {
    return handleError('POST', `/recipes/${recipeId}/ingredients/bulk`, {
        body,
    })
}

export async function removeIngredients(
    recipeId: number,
    ingredientIds: number[]
): Promise<void> {
    return handleError('DELETE', `/recipes/${recipeId}/ingredients/bulk`, {
        body: ingredientIds,
    })
}

export async function updateIngredients(
    recipeId: number,
    body: Array<{
        recipeIngredientId: number
        amount?: number
        name?: string
        unit?: string | null
    }>
): Promise<RecipeIngredient[]> {
    return handleError('PUT', `/recipes/${recipeId}/ingredients/bulk`, { body })
}

export async function addInstructions(
    recipeId: number,
    body: Array<{ text: string }>
): Promise<Instruction[]> {
    return handleError('POST', `/recipes/${recipeId}/instructions/bulk`, {
        body,
    })
}

export async function deleteInstructions(
    recipeId: number,
    instructionIds: number[]
): Promise<void> {
    return handleError('DELETE', `/recipes/${recipeId}/instructions/bulk`, {
        body: instructionIds,
    })
}

export async function updateInstructions(
    recipeId: number,
    instructions: Array<{ instructionId: number; text: string }>
): Promise<any> {
    return handleError('PUT', `/recipes/${recipeId}/instructions/bulk`, {
        body: instructions,
    })
}
