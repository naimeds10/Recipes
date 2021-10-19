import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { BrowseScreen, ViewRecipeScreen } from '@/screens'
import { routeUtils } from '@/utils'
import { HeaderComponent } from '@/oldRoutes/components'

const Stack = createStackNavigator()

function BrowseStack(): JSX.Element {
    return (
        <Stack.Navigator
            initialRouteName="Browse"
            screenOptions={{
                presentation: 'transparentModal',
                cardStyleInterpolator: routeUtils.slideVertical,
            }}
        >
            <Stack.Screen
                name="Browse"
                component={BrowseScreen}
                options={{
                    header: ({ navigation }) => (
                        <HeaderComponent navigation={navigation} />
                    ),
                }}
            />

            <Stack.Screen
                name="ViewRecipe"
                component={ViewRecipeScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default BrowseStack
