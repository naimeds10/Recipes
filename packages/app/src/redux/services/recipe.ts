import { Copy, Recipe, RecipeCreate, RecipeUpdate } from '@recipes/api-types/v1'
import { api } from './base'
import { withPopupMutation, withPopupQuery } from '@/hooks'

type BaseArg = { sectionId: number }

const recipeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecipesBySectionId: builder.query<Recipe[], number>({
            query: (sectionId) => ({
                url: `/sections/${sectionId}/recipes`,
                method: 'GET',
            }),
        }),

        createRecipes: builder.mutation<
            Recipe[],
            BaseArg & { body: Array<Omit<RecipeCreate, 'sectionId'>> }
        >({
            query: (args) => ({
                url: `/sections/${args.sectionId}/recipes/bulk`,
                method: 'POST',
                body: args.body,
            }),
        }),

        updateRecipes: builder.mutation<
            Recipe[],
            BaseArg & { body: Array<RecipeUpdate> }
        >({
            query: (args) => ({
                url: `/sections/${args.sectionId}/recipes/bulk`,
                method: 'PUT',
                body: args.body,
            }),
        }),

        deleteRecipe: builder.mutation<boolean, BaseArg & { recipeId: number }>(
            {
                query: (args) => ({
                    url: `/sections/${args.sectionId}/recipes/${args.recipeId}`,
                    method: 'DELETE',
                }),
            }
        ),
    }),
})

export const {
    // useGetRecipesBySectionIdQuery,
    useCreateRecipesMutation,
    useUpdateRecipesMutation,
    useDeleteRecipeMutation,
} = recipeApi

export const useGetRecipesBySectionIdQuery = withPopupQuery<
    typeof recipeApi.endpoints.getRecipesBySectionId
>(recipeApi.useGetRecipesBySectionIdQuery)

// export const useCreateRecipesMutation = withPopupMutation<
//     typeof recipeApi.endpoints.createRecipes
// >(recipeApi.useCreateRecipesMutation)
