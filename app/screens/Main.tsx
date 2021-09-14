import React, { useEffect } from 'react'
import { FlatList, View } from 'react-native'
import styled from 'styled-components'
import { retrieveRecipes } from '../actions/my-recipes'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import RecipesFlatList from '../components/data/RecipesFlatList'
import { addRecipes, getRecipes } from '../actions/browse-recipes'
import { FilterHeader, SortHeader } from '../components/user-input/search'
import { browseSort } from '../reducers/browse'
import RecipesListHeader from '../components/data/RecipesListHeader'

function MainScreen({ navigation }: { navigation: any }): JSX.Element {
    const browseRecipes = useAppSelector((state) => state.browseRecipes)
    // console.log("Main", browseRecipes.recipes.length, browseRecipes.recipes.map(r =>
    //     ({index: browseRecipes.recipes.indexOf(r), id: r.id, name: r.name})))
    const { sortState } = useAppSelector((state) => state.browseSort)
    const search = useAppSelector((state) => state.browseSearch)
    const dispatch = useAppDispatch()

    const listRef = React.useRef<FlatList>()

    useEffect(() => {
        navigation.setParams({ listRef })
        dispatch(retrieveRecipes())
        dispatch(getRecipes({ scopes: ['published'], sort: ['publishtime'] }))
    }, [])

    const onEndReached = (): void => {
        if (browseRecipes.nextPage !== null && !browseRecipes.loading) {
            const params = {
                ...browseRecipes.currentParams,
                page: browseRecipes.nextPage,
            }
            dispatch(addRecipes(params))
        }
    }

    return (
        <Container>
            <RecipesListHeader search={search} sort={sortState}/>
            <RecipesFlatList
                ref={listRef}
                recipes={browseRecipes.recipes}
                navigation={navigation}
                onEndReached={onEndReached}
            />
        </Container>
    )
}

export default MainScreen

const Container = styled(View)`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color: ${(props) => props.theme.background};
    padding-bottom: 5px;
`
