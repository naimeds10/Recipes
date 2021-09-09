import React, { useState } from 'react'
import styled from 'styled-components'
import { View, TextInput } from 'react-native'
import { useAppSelector } from '../../../hooks'
import { FeatherButton } from '../../user-input/Buttons'

const SearchBarComponent = ({
    navigation,
    toggle,
    searchText,
    setText,
}: {
    navigation: any
    toggle: () => void
    searchText: string
    setText(text: string): void
}): JSX.Element => {
    const theme = useAppSelector((state) => state.theme)
    const { routeName } = navigation.state

    function handleText(search: string): void {
        setText(search)
        navigation.setParams({ search })
    }

    return (
        <SearchBarContainer>
            <ReturnButton
                iconName="arrow-left"
                onPress={() => toggle()}
                size={25}
            />
            <SearchBar
                placeholder={routeName === 'Main' ? 'Search' : 'Filter'}
                placeholderTextColor={theme.grey}
                onChangeText={(t: string) => handleText(t)}
                value={searchText}
            />
            <ClearSearchBarButton
                iconName="x"
                onPress={() => handleText('')}
                size={25}
            />
        </SearchBarContainer>
    )
}

export default SearchBarComponent

const SearchBarContainer = styled(View)`
    flex: 1;
    flex-direction: row;
    align-items: center;
    background-color: ${(props) => props.theme.backgroundVariant};
    border-radius: 10px;
    margin-end: 5px;
`

const ReturnButton = styled(FeatherButton)`
    align-self: flex-start;
    padding-left: 10px;
`

const SearchBar = styled(TextInput)`
    flex: 1;
    color: ${(props) => props.theme.text};
    padding-left: 8px;
    padding-right: 8px;
`

const ClearSearchBarButton = styled(FeatherButton)`
    align-self: flex-end;
    padding-right: 10px;
`
