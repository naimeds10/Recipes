export const AUTH_ACTIONS = {
    SIGN_IN_START: 'signInStart',
    SIGN_IN_SUCCES: 'signInSucces',
    SIGN_IN_ERROR: 'signInError',

    SIGN_OUT_START: 'signOutStart',
    SIGN_OUT_SUCCES: 'signOutSucces',
    SIGN_OUT_ERROR: 'signOutError',

    SIGN_UP_START: 'signUpStart',
    SIGN_UP_SUCCES: 'signUpSucces',
    SIGN_UP_ERROR: 'signUpError',

    RETRIEVE_TOKEN_START: 'retrieveToken',
    RETRIEVE_TOKEN_SUCCES: 'retrieveTokenSucces',
    RETRIEVE_TOKEN_ERROR: 'retrieveTokenError',

    CLEAR_ERROR: 'clearError',
}

export type Auth = {
    retrieveLoading: boolean
    loading: boolean
    token: string
    error: string
}

const initialState = {
    retrieveLoading: false,
    loading: false,
    token: '',
    error: '',
}

const auth = (
    state = initialState,
    action: { type: string; payload: Auth }
): Auth => {
    switch (action.type) {
        // SIGN UP ACTIONS
        case AUTH_ACTIONS.SIGN_UP_START: {
            return {...state, loading: true}
        }

        case AUTH_ACTIONS.SIGN_UP_SUCCES: {
            return { ...state, error: '', loading: false }
        }

        case AUTH_ACTIONS.SIGN_UP_ERROR: {
            const { error } = action.payload
            return { ...state, error, loading: false }
        }

        // SIGN IN ACTIONS
        case AUTH_ACTIONS.SIGN_IN_START: {
            return {...state, loading: true}
        }

        case AUTH_ACTIONS.SIGN_IN_SUCCES: {
            const { token } = action.payload
            return { ...state, token, error: '', loading: false }
        }

        case AUTH_ACTIONS.SIGN_IN_ERROR: {
            const { error } = action.payload
            return { ...state, error, loading: false }
        }

        // SIGN OUT ACTIONS
        case AUTH_ACTIONS.SIGN_OUT_START: {
            return {...state, loading: true}
        }

        case AUTH_ACTIONS.SIGN_OUT_SUCCES: {
            return initialState
        }

        case AUTH_ACTIONS.SIGN_OUT_ERROR: {
            const { error } = action.payload
            return { ...state, error, loading: false }
        }

        // RETRIEVE TOKEN ACTIONS
        case AUTH_ACTIONS.RETRIEVE_TOKEN_START: {
            return { ...state, retrieveLoading: true }
        }

        case AUTH_ACTIONS.RETRIEVE_TOKEN_SUCCES: {
            const { token } = action.payload
            return {...state, token, retrieveLoading: false, error: '' }
        }

        case AUTH_ACTIONS.RETRIEVE_TOKEN_ERROR: {
            const { error } = action.payload
            return { ...state, error, retrieveLoading: false }
        }

        // CLEAR ERROR AND DEFAULT
        case AUTH_ACTIONS.CLEAR_ERROR: {
            return { ...state, error: ''}
        }

        default:
            return state
    }
}

export default auth
