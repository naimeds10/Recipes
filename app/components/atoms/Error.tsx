import React from 'react'
import styled from 'styled-components'
import View from './View'
import Text from './Text'
import { Spacing, Typography } from '@/styles'
import { useAppSelector } from '@/hooks'

type ErrorMessageProps = {
    message?: string
    size?: Spacing.Size
}

const sizeMap: Record<Spacing.Size, Typography.TextType> = {
    s: 'TinyText',
    m: 'SubText',
    l: 'Text',
}

function Error({
    message: errorMessage,
    size,
}: ErrorMessageProps): JSX.Element {
    const { theme, textSize } = useAppSelector((state) => state.settings)
    size = size || 's'

    const textType = sizeMap[size]

    const paddingStyle = {
        height: Typography.lineHeight(textType, textSize) + 0.1,
    }

    return (
        <Container>
            {errorMessage ? (
                <Text type={textType} color={theme.error}>
                    {errorMessage}
                </Text>
            ) : (
                <View style={paddingStyle} />
            )}
        </Container>
    )
}

export default Error

const Container = styled(View)`
    align-self: center;
`
