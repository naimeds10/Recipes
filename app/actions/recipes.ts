import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dispatch } from 'redux'
import { RECIPE_ACTIONS } from '../reducers/recipes'
import * as recipeService from '../services/recipe'
import { Instruction, Ingredient, Recipe, RecipeIngredient } from '../data'
import { deleteElement, deleteElements, replaceElements } from '../config/utils'

export const createRecipe =
    (recipe: Recipe) =>
    async (dispatch: Dispatch): Promise<void> => {
        try {
            const recipesString = await AsyncStorage.getItem('recipes')
            if (recipesString !== null) {
                const localRecipes: Recipe[] = JSON.parse(recipesString)

                const newRecipe = await recipeService.createRecipe({
                    name: recipe.name,
                    description: recipe.description,
                    peopleCount: recipe.peopleCount,
                    prepareTime: recipe.prepareTime
                })

                // If ingredients were set, put those in database too and set in newRecipe
                if (
                    typeof recipe.recipeIngredients !== 'undefined' &&
                    recipe.recipeIngredients.length > 0
                ) {
                    const ingredientObjects: {
                        name: string
                        amount: number
                        unit?: string
                    }[] = []
                    recipe.recipeIngredients.forEach((ri) => {
                        const i = ri.ingredient as Ingredient
                        ingredientObjects.push({
                            name: i.name,
                            amount: ri.amount,
                            unit: i.unit as string | undefined,
                        })
                    })
                    const ingredients = await recipeService.addIngredients(
                        newRecipe.id,
                        ingredientObjects
                    )
                    newRecipe.recipeIngredients = ingredients
                    // else set ingredients to empty array
                } else {
                    newRecipe.recipeIngredients = []
                }

                // If instructions were set, put those in database too and set in newRecipe
                if (
                    typeof recipe.instructions !== 'undefined' &&
                    recipe.instructions.length > 0
                ) {
                    const instructions = await recipeService.addInstructions(
                        newRecipe.id,
                        recipe.instructions
                    )
                    newRecipe.instructions = instructions
                    // else set instructions to empty array
                } else {
                    newRecipe.instructions = []
                }

                // Add new recipe to local storage
                localRecipes.push(newRecipe)
                await AsyncStorage.setItem(
                    'recipes',
                    JSON.stringify(localRecipes)
                )

                dispatch({
                    type: RECIPE_ACTIONS.ADD_RECIPE,
                    payload: { newRecipe },
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

export const editRecipe =
    (recipe: Recipe) =>
    async (dispatch: Dispatch): Promise<void> => {
        try {
            const recipesString = await AsyncStorage.getItem('recipes')
            if (recipesString !== null) {
                const localRecipes: Recipe[] = JSON.parse(recipesString)

                // Replace in local storage
                const oldRecipe = localRecipes.filter(r => r.id === recipe.id)[0]
                deleteElement(localRecipes, oldRecipe)
                localRecipes.push(recipe)
                await AsyncStorage.setItem(
                    'recipes',
                    JSON.stringify(localRecipes)
                )

                // Update recipe in database
                const newRecipe = await recipeService.updateRecipe(
                    recipe.id,
                    {
                        name: recipe.name,
                        description: recipe.description,
                        peopleCount: recipe.peopleCount,
                        prepareTime: recipe.prepareTime
                    },
                )
                newRecipe.recipeIngredients = recipe.recipeIngredients
                newRecipe.instructions = recipe.instructions

                const ingredientsToAdd: RecipeIngredient[] = []
                const ingredientsToUpdate: RecipeIngredient[] = []
                const ingredientsToDelete: RecipeIngredient[] = []

                // If id <= 0 only exists locally, so add to db
                recipe.recipeIngredients!.forEach(ingr => {
                    if (ingr.id <= 0) ingredientsToAdd.push(ingr)
                })

                oldRecipe.recipeIngredients!.forEach(oldIngr => {
                    let toDelete = true
                    recipe.recipeIngredients!.forEach(ingr => {
                        // If id is the same or id <= 0, dont delete
                        if (oldIngr.id === ingr.id || ingr.id <= 0) toDelete = false

                        // if id is the same and any property has changed, add to update list
                        if (oldIngr.id === ingr.id && (oldIngr.amount !== ingr.amount
                            || oldIngr.ingredient!.name !== ingr.ingredient!.name
                            || oldIngr.ingredient!.unit !== ingr.ingredient!.unit)) {
                                ingredientsToUpdate.push(ingr)
                        }
                    })
                    if (toDelete) ingredientsToDelete.push(oldIngr)
                })

                // Update ingredients if there are any
                if (ingredientsToUpdate.length > 0) {
                    // TODO: Fix UpdateIngredients on API side
                    newRecipe.recipeIngredients = replaceElements(newRecipe.recipeIngredients!, ingredientsToUpdate)
                }

                // Delete ingredients if there are any
                if (ingredientsToDelete.length > 0) {
                    await recipeService.removeIngredients(recipe.id, ingredientsToDelete.map(i => i.ingredient!.id))
                }

                // Add ingredients if there are any
                if (ingredientsToAdd.length > 0) {
                    const addedIngredients = await recipeService.addIngredients(
                        recipe.id,
                        ingredientsToAdd.map(ri => ({
                            amount: ri.amount,
                            unit: ri.ingredient!.unit ?? undefined,
                            name: ri.ingredient!.name,
                        }))
                    )
                    newRecipe.recipeIngredients!.push(...addedIngredients)
                }

                // Add and update instructions
                const instructionsToAdd: Instruction[] = []
                const instructionsToUpdate: Instruction[] = []
                const instructionsToDelete: Instruction[] = []

                // If id <= 0, only exists locally, so add to recipe in db
                recipe.instructions!.forEach(ins => {
                    if (ins.id <= 0) instructionsToAdd.push(ins)
                })


                oldRecipe.instructions!.forEach(oldIns => {
                    let toDelete = true
                    recipe.instructions!.forEach(ins => {
                        // If id is the same or id <= 0, dont delete
                        if (oldIns.id === ins.id || ins.id <= 0) toDelete = false

                        // if id is the same and any property has changed, add to update list
                        if (oldIns.id === ins.id && oldIns.text !== ins.text) instructionsToUpdate.push(ins)
                    })
                    if (toDelete) instructionsToDelete.push(oldIns)
                })

                // Update instructions if there are any
                if (instructionsToUpdate.length > 0) {
                    const updatedInstructions = await recipeService.updateInstructions(
                        recipe.id,
                        instructionsToUpdate.map(i => ({ text: i.text, instructionId: i.id}))
                    )
                    newRecipe.instructions = replaceElements(newRecipe.instructions!, updatedInstructions)
                }

                // Delete instructions if there are any
                if (instructionsToDelete.length > 0) {
                    await recipeService.deleteInstructions(
                        recipe.id,
                        instructionsToDelete.map(i => i.id))
                    deleteElements(newRecipe.instructions!, instructionsToDelete)
                }

                // Add Instructions if there are any
                if (instructionsToAdd.length > 0) {
                    const addedInstructions = await recipeService.addInstructions(
                        recipe.id,
                        instructionsToAdd.map(i => ({ text: i.text }))
                    )
                    newRecipe.instructions!.push(...addedInstructions)
                }

                dispatch({
                    type: RECIPE_ACTIONS.EDIT_RECIPE,
                    payload: { newRecipe }
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

export const retrieveRecipes =
    () =>
    async (dispatch: Dispatch): Promise<void> => {
        try {
            // Check local storage for recipes
            let rs = await AsyncStorage.getItem('recipes')
            if (rs === null) {
                await AsyncStorage.setItem('recipes', '[]')
                rs = '[]'
            }
            const recipes: Recipe[] = JSON.parse(rs)

            // Put recipes without a database id into the database
            const localRecipes = recipes.filter((recipe) => recipe.id <= 0)
            if (localRecipes.length > 0) {
                await recipeService.createRecipes(localRecipes)
            }

            // Get all my recipes from database
            const newRecipes = await recipeService.getMyRecipes()

            await AsyncStorage.setItem('recipes', JSON.stringify(recipes))
            dispatch({
                type: RECIPE_ACTIONS.SET_RECIPES,
                payload: { newRecipes },
            })
        } catch (err) {
            console.error(err)
        }
    }

export const deleteRecipe =
    (recipe: Recipe) =>
    async (dispatch: Dispatch): Promise<void> => {
        try {
            const rs = (await AsyncStorage.getItem('recipes')) as string
            const localRecipes: Recipe[] = JSON.parse(rs)

            deleteElement(localRecipes, recipe)

            await recipeService.deleteRecipe(recipe.id)
            dispatch({
                type: RECIPE_ACTIONS.DELETE_RECIPE,
                payload: { recipe },
            })
        } catch (err) {
            console.error(err)
        }
    }
