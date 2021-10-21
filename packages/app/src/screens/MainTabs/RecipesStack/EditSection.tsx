import React from 'react'
import styled from 'styled-components'
import { Section } from '@recipes/api-types/v1'
import { View, Icons } from '@/components/base'
import {
    HeaderComponent,
    HeaderConfig,
    SectionListItem,
} from '@/components/molecules'
import { useAppSelector } from '@/hooks'

type EditSectionScreenProps = {
    navigation: any
}

function EditSectionScreen({
    navigation,
}: EditSectionScreenProps): JSX.Element {
    const { theme } = useAppSelector((state) => state.settings)
    console.log('Edit section screen')

    // Header configuration
    const headerConfig: HeaderConfig = {
        right: [
            {
                type: Icons.MyFeather,
                name: 'save',
                onPress: () => console.log('Should save now'),
            },
        ],
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <HeaderComponent
                    navigation={navigation}
                    config={headerConfig}
                />
            ),
        })
    }, [navigation])

    // Data handling
    const [data, setData] = React.useState(new Section())

    function handleSectionNameChange(name: string): void {
        setData({ ...data, name })
    }

    function handleSectionDescriptionChange(description: string): void {
        setData({ ...data, description })
    }

    return (
        <Container>
            <SectionListItem
                item={data}
                editable
                handleSectionNameChange={handleSectionNameChange}
                handleSectionDescriptionChange={handleSectionDescriptionChange}
            />
        </Container>
    )
}

export default EditSectionScreen

const Container = styled(View)`
    flex: 1;
    background-color: ${(props) => props.theme.background};
`
