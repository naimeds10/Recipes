import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { HeaderComponent } from './components'
import {EditRecipeTabs} from '@/screens/EditRecipeStack'
import { routeUtils } from '@/config'
import { RecipesScreen, ViewRecipeScreen } from '@/screens'

const Stack = createStackNavigator()

function RecipesStack(): JSX.Element {
    return (
        <Stack.Navigator
            initialRouteName="Recipes"
            screenOptions={{
                presentation: 'transparentModal',
                cardStyleInterpolator: routeUtils.slideVertical,
            }}
        >
            <Stack.Screen
                name="Recipes"
                component={RecipesScreen}
                options={{
                    header: ({ navigation }) => (
                        <HeaderComponent navigation={navigation} />
                    ),
                }}
            />

            <Stack.Screen
                name="EditRecipeTabs"
                component={EditRecipeTabs}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ViewRecipe"
                component={ViewRecipeScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default RecipesStack
