import { Dispatch } from 'redux'
import { THEME_ACTIONS } from '../reducers/theme'
import * as userService from '../services/user'

export const setTheme =
    (lightTheme: boolean) =>
    async (dispatch: Dispatch): Promise<void> => {
        try {
            const theme = lightTheme ? 'light' : 'dark'
            dispatch({
                type: THEME_ACTIONS.SET_THEME,
                payload: { newTheme: theme },
            })
            await userService.updateSettings({ theme })
        } catch (err: any) {
            console.log(err.message)
            console.error(err)
        }
    }

export const setColor =
    (color: string) =>
    async (dispatch: Dispatch): Promise<void> => {
        try {
            dispatch({
                type: THEME_ACTIONS.SET_COLOR,
                payload: { color },
            })
            await userService.updateSettings({ color })
        } catch (err: any) {
            console.log(err.message)
            console.error(err)
        }
    }

export const resetTheme =
    (): any =>
    async (dispatch: Dispatch): Promise<void> => {
        dispatch({
            type: THEME_ACTIONS.RESET_THEME,
            payload: {},
        })
    }
