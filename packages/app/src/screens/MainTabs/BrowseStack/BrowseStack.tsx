import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import BrowseScreen from './Browse'
import { routeUtils } from '@/utils'
import { HeaderComponent } from '@/components/molecules'

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
                        <HeaderComponent
                            navigation={navigation}
                            config={{ right: [] }}
                        />
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

export default BrowseStack
