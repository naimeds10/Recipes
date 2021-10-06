import React, { useReducer } from 'react'
import {
    View,
    Dimensions,
    TouchableOpacity,
    Animated,
    Modal,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components'
import logo from '@/assets/temp_icon.png'
import { MyFeather, MyFontAwesome } from '@/components/Icons'
import { ButtonFilled, ButtonInverted } from '@/components/user-input/Buttons'
import { colors } from '@/config'
import { authActions } from '@/redux/actions'
import { InputFieldRounded } from '@/components/user-input/TextInputs'
import { ErrorMessage as old } from '@/components/user-input/ErrorMessage'
import { useAppDispatch, useAppSelector } from '@/hooks'

import {
    Icons,
    Icon,
    IconButton,
    Button,
    ErrorMessage,
} from '@/components/atoms'
import { TextInputWithIcons } from '@/components/molecules'

const LOGIN_ACTIONS = {
    USERNAME_CHANGE: 'usernameChange',
    PASSWORD_CHANGE: 'passwordChange',
    PASSWORD_SECURE_CHANGE: 'passwordSecureChange',
}

interface LoginState {
    username: string
    password: string
    securePasswordText: boolean
    isValidUsername: boolean
    isValidPassword: boolean
}

function reducer(state: LoginState, action: any): LoginState {
    switch (action.type) {
        case LOGIN_ACTIONS.USERNAME_CHANGE: {
            const { username, isValidUsername } = action.payload
            return { ...state, username, isValidUsername }
        }

        case LOGIN_ACTIONS.PASSWORD_CHANGE: {
            const { password, isValidPassword } = action.payload
            return { ...state, password, isValidPassword }
        }

        case LOGIN_ACTIONS.PASSWORD_SECURE_CHANGE: {
            const securePasswordText = action.payload
            return { ...state, securePasswordText }
        }

        default:
            return state
    }
}

interface LoginModalProps {
    navigation: any
    showRegister: () => void
}

function LoginModal({
    navigation,
    showRegister,
}: LoginModalProps): JSX.Element {
    const { auth, settings } = useAppSelector((state) => state)
    const { theme } = settings
    const dispatch = useAppDispatch()

    const insets = useSafeAreaInsets()

    const initialState: LoginState = {
        username: '',
        password: '',
        securePasswordText: true,
        isValidUsername: true,
        isValidPassword: true,
    }

    const [data, localDispatch] = useReducer(reducer, initialState)

    function handleUsernameInputChange(username: string): void {
        const regex = /^[a-z0-9]+(@[a-z0-9]+\.[a-z0-9]+)?$/i
        const isValidUsername =
            (regex.test(username) &&
                username.length >= 4 &&
                username.length <= 30) ||
            username.length === 0
        localDispatch({
            type: LOGIN_ACTIONS.USERNAME_CHANGE,
            payload: { username, isValidUsername },
        })
    }

    function handlePasswordInputChange(password: string): void {
        const isValidPassword =
            (password.length >= 5 && password.length <= 50) ||
            password.length === 0
        localDispatch({
            type: LOGIN_ACTIONS.PASSWORD_CHANGE,
            payload: { password, isValidPassword },
        })
    }

    function handleSecurePasswordChange(): void {
        localDispatch({
            type: LOGIN_ACTIONS.PASSWORD_SECURE_CHANGE,
            payload: !data.securePasswordText,
        })
    }

    function isValidData(): boolean {
        const isEmpty = data.username.length === 0 && data.password.length === 0
        return !isEmpty && data.isValidUsername && data.isValidPassword
    }

    async function handleLoginButton(): Promise<void> {
        if (isValidData()) {
            dispatch(
                authActions.signIn(data.username, data.password, navigation)
            )
        }
    }

    function handleRegisterButton(): void {
        showRegister()
        dispatch(authActions.clearError())
    }

    return (
        <Modal statusBarTranslucent animationType="slide">
            <Container
                style={{
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                    paddingBottom: insets.bottom,
                }}
            >
                {/* Logo */}
                <LogoView>
                    <Logo source={logo} />
                </LogoView>

                <TextInputWithIcons
                    leftIcon={
                        <Icon
                            Type={Icons.MyFontAwesome}
                            name="user-o"
                            color={theme.grey}
                        />
                    }
                    placeholder="Your Username or Email"
                    onChangeText={(text: string) =>
                        handleUsernameInputChange(text)
                    }
                    errorMessage={
                        !data.isValidUsername
                            ? 'Invalid Username or Email'
                            : undefined
                    }
                />

                <TextInputWithIcons
                    leftIcon={
                        <Icon
                            marginHorizontal="s"
                            Type={Icons.MyFontAwesome}
                            name="lock"
                            color={theme.grey}
                        />
                    }
                    placeholder="Your Password"
                    onChangeText={(text: string) =>
                        handlePasswordInputChange(text)
                    }
                    secureTextEntry={data.securePasswordText}
                    rightIcon={
                        <IconButton
                            IconType={Icons.MyFeather}
                            iconName={
                                data.securePasswordText ? 'eye-off' : 'eye'
                            }
                            onPress={() => handleSecurePasswordChange()}
                            color={theme.grey}
                        />
                    }
                    errorMessage={
                        !data.isValidPassword ? 'Invalid Password' : undefined
                    }
                />

                {/* <Button
                    type='Solid'
                    text="SIGN IN"
                    onPress={() => handleLoginButton()}
                    loading={auth.awaitingResponse}
                /> */}

                {/* Log in Button */}
                <ButtonFilled
                    text="Sign in"
                    onPress={() => handleLoginButton()}
                    loading={auth.awaitingResponse}
                />

                {/* Register Button */}
                <ButtonInverted
                    text="Register"
                    onPress={() => handleRegisterButton()}
                />
                <ErrorMessage errorMessage={auth.error} />
            </Container>
        </Modal>
    )
}

export default LoginModal

const { height } = Dimensions.get('screen')
const logoHeight = height * 0.2

const Container = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.background};
`

const LogoView = styled(View)`
    position: absolute;
    top: 80px;
`

const Logo = styled(Animated.Image)`
    height: ${logoHeight}px;
    width: ${logoHeight}px;
`
