import React from 'react'
import styled from 'styled-components'
import { Recipe } from '@recipes/api-types/v1'
import { useNavigation } from '@react-navigation/native'
import ListItem from './ListItem'
import { Icon, Icons, View, Text } from '@/components/base'
import { Counter, Editable } from '@/components/atoms'
import { createDropDownItems } from '@/utils'
import { recipesActions, recipeService } from '@/redux'
import { useAppDispatch } from '@/hooks'
import { ListItemBaseProps } from '@/types'

interface SectionListItemProps extends ListItemBaseProps<Recipe> {
    handleSectionNameChange?: (text: string) => void
    handleSectionDescriptionChange?: (text: string) => void
    incrementPeopleCount?: () => void
    decrementPeopleCount?: () => void
    changePeopleCount?: (text: string) => void
}

function RecipeListItem({
    item,
    useDropdown,
    onGesture,
    editable,
    releaseHeight,
    hide,
    handleSectionNameChange,
    handleSectionDescriptionChange,
    incrementPeopleCount,
    decrementPeopleCount,
    changePeopleCount,
}: SectionListItemProps): JSX.Element {
    const dispatch = useAppDispatch()
    const navigation = useNavigation<any>()

    const [deleteRecipe] = recipeService.useDeleteRecipeMutation()

    async function deleteRecip(): Promise<void> {
        const args = { sectionId: item.sectionId, recipeId: item.id }
        const res = await deleteRecipe(args)
        if ('data' in res) {
            dispatch(recipesActions.removeRecipe(args))
        }
    }

    function editRecip(): void {
        navigation.navigate('EditRecipeTabs', {
            screen: 'EditRecipeStack',
            params: {
                screen: 'EditRecipe',
                params: {
                    sectionId: item.sectionId,
                    recipeId: item.id,
                },
            },
        })
    }

    function onPress(): void {
        navigation.navigate('ViewRecipe', {
            sectionId: item.sectionId,
            recipeId: item.id,
        })
    }

    const dropdownItems = [
        {
            id: 0,
            text: 'Edit',
            onPress: editRecip,
        },
        {
            id: 1,
            text: 'Delete',
            onPress: deleteRecip,
        },
    ]

    const editPeopleCount =
        editable &&
        typeof incrementPeopleCount !== 'undefined' &&
        typeof decrementPeopleCount !== 'undefined'

    const prepareTimeHours = Math.floor(item.prepareTime / 60)
    const prepareTimeMinutes = item.prepareTime - prepareTimeHours * 60

    return (
        <ListItem
            items={useDropdown ? dropdownItems : undefined}
            onPress={!editable ? onPress : undefined}
            onGesture={onGesture}
            hide={hide}
        >
            <Container>
                <Editable
                    releaseHeight={releaseHeight}
                    text={item.name}
                    handleTextChange={handleSectionNameChange}
                    type="SubHeader"
                    paddingHorizontal="s"
                    numberOfLines={1}
                    placeholder="Section Name"
                />
                <Editable
                    releaseHeight={releaseHeight}
                    text={item.description}
                    handleTextChange={handleSectionDescriptionChange}
                    paddingHorizontal="s"
                    numberOfLines={2}
                    maxLength={1023}
                    placeholder="Description"
                />
                <PropertyRow>
                    <Property
                        iconType={Icons.MyMaterialCommunityIcons}
                        iconName="timer-sand"
                        text={`${prepareTimeHours}:${
                            prepareTimeMinutes < 10 ? '0' : ''
                        }${prepareTimeMinutes}`}
                    />

                    {editPeopleCount ? (
                        <Counter
                            increment={incrementPeopleCount}
                            decrement={decrementPeopleCount}
                            value={item.peopleCount}
                            iconType={Icons.MyMaterialIcons}
                            iconName="person"
                            onChange={changePeopleCount}
                        />
                    ) : (
                        <Property
                            iconType={Icons.MyMaterialIcons}
                            iconName="person"
                            text={item.peopleCount}
                        />
                    )}
                </PropertyRow>
            </Container>
        </ListItem>
    )
}

export default RecipeListItem

const Property = ({
    iconType,
    iconName,
    text,
}: {
    iconType: any
    iconName: string
    text: string | number
}): JSX.Element => {
    return (
        <PropertyContainer paddingVertical="s" width="s">
            <Icon type={iconType} name={iconName} />
            <Text type="SubHeader">{text}</Text>
        </PropertyContainer>
    )
}

const Container = styled(View)`
    flex-direction: column;
    justify-content: center;
`
const PropertyRow = styled(View)`
    flex-direction: row;
    align-items: center;
`

const PropertyContainer = styled(View)`
    flex-direction: row;
`
