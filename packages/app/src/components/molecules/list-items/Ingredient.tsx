import React from 'react'
import styled from 'styled-components'
import { RecipeIngredient } from '@recipes/api-types/v1'
import { View, Text } from '@/components/base'
import { ListItem, Editable } from '@/components/atoms'
import { utils } from '@/utils'
import { ListItemBaseProps } from '@/types'

interface IngredientListItemProps extends ListItemBaseProps<RecipeIngredient> {
    editable?: boolean
    handleIngredientNameChange?: (key: string, text: string) => void
    handleIngredientAmountChange?: (key: string, text: string) => void
    handleIngredientUnitChange?: (key: string, text: string) => void
}

function IngredientListItem({
    item,
    editable,
    handleIngredientNameChange,
    handleIngredientAmountChange,
    handleIngredientUnitChange,
}: IngredientListItemProps): JSX.Element {
    function logIngredient(): void {
        console.log('Logging ingredient')
    }

    return (
        <ListItem
            items={utils.createDropDownItems([logIngredient], 'ingredient')}
        >
            <Container>
                <Editable
                    editable={editable}
                    text={item.ingredient.name}
                    handleTextChange={handleIngredientNameChange}
                    paddingHorizontal="s"
                />
                <SubContainer>
                    <Editable
                        editable={editable}
                        text={item.amount.toString()}
                        handleTextChange={handleIngredientAmountChange}
                        paddingHorizontal="s"
                    />
                    <Editable
                        editable={editable}
                        text={item.ingredient.unit ?? ''}
                        handleTextChange={handleIngredientUnitChange}
                        width="m"
                    />
                </SubContainer>
            </Container>
        </ListItem>
    )
}

export default IngredientListItem

const Container = styled(View)`
    flex-direction: column;
    justify-content: center;
`

const SubContainer = styled(View)`
    flex-direction: row;
    align-items: center;
`
