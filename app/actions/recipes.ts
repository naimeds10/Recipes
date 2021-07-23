import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dispatch } from 'redux'
import * as lodash from 'lodash'
import Recipe from '../data/recipe'
import { RECIPEACTIONS } from '../reducers/recipes'
import * as recipeService from '../services/recipe'
import Ingredient from '../data/ingredient'


export const createRecipe =
    (recipe: Recipe) =>
    async (dispatch: Dispatch): Promise<void> => {
        // console.log("Creating Recipe", recipe)
        try {
            const recipesString = await AsyncStorage.getItem('recipes')
            if (recipesString !== null) {
                const localRecipes: Recipe[] = JSON.parse(recipesString)

                const newRecipe = await recipeService.createRecipe(recipe)

                // If ingredients were set, put those in database too and set in newRecipe
                if (typeof recipe.recipeIngredients !== 'undefined' && recipe.recipeIngredients.length > 0) {
                    const ingredientObjects: any[] = []
                    recipe.recipeIngredients.forEach((ri) => {
                        const i = (ri.ingredient as Ingredient)
                        ingredientObjects.push({
                            name: i.name,
                            amount: ri.amount,
                            key: i.key,
                            unit: i.unit,
                        })
                    })
                    const ingredients = await recipeService.addIngredients(newRecipe.id, ingredientObjects)
                    newRecipe.recipeIngredients = ingredients
                    // else set ingredients to empty array
                } else {
                    recipe.recipeIngredients = []
                }

                // If instructions were set, put those in database too and set in newRecipe
                if (typeof recipe.instructions !== 'undefined' && recipe.instructions.length > 0) {
                    const instructions = await recipeService.addInstructions(newRecipe.id, recipe.instructions)
                    newRecipe.instructions = instructions
                   // else set instructions to empty array
                } else {
                    recipe.instructions = []
                }

                console.log('New Recipe', newRecipe)
                localRecipes.push(newRecipe)
                await AsyncStorage.setItem(
                    'recipes',
                    JSON.stringify(localRecipes)
                )
                console.log('Recipe set, dispatch now')
                dispatch({
                    type: RECIPEACTIONS.ADD_RECIPE,
                    payload: { newRecipe },
                })
            }
        } catch (err) {
            console.log(err.message)
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
                await AsyncStorage.setItem('recipes', JSON.stringify([]))
                rs = '[]'
            }
            const recipes: Recipe[] = JSON.parse(rs)
            // Put recipes without a database id into the database
            const localRecipes = recipes.filter((recipe) => recipe.id === 0)
            if (localRecipes.length > 0) {
                await recipeService.createRecipes(localRecipes)
            }

            // Get all my recipes from database
            const newRecipes = await recipeService.getMyRecipes()
            await AsyncStorage.setItem('recipes', JSON.stringify(recipes))
            dispatch({
                type: RECIPEACTIONS.SET_RECIPES,
                payload: { newRecipes },
            })
        } catch (err) {
            console.log(err.message)
            console.error(err)
        }
    }

export const deleteRecipe =
    (recipe: Recipe) =>
    async (dispatch: Dispatch): Promise<void> => {
        console.log('Deleting Recipe', recipe)
    }
