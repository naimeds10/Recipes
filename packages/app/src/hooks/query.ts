import { useNavigation } from '@react-navigation/native'
import { isFetchError } from '@/utils'
import { showPopup } from '@/utils/screen'
import {
    FetchError,
    InferMutationArgs,
    InferQueryArgs,
    InferQueryResult,
    InferUseMutation,
    InferUseQuery,
    UseQueryOptions,
    UseQueryResult,
} from '@/types'

export function withPopupQuery<E>(hook: InferUseQuery<E>) {
    return (args: InferQueryArgs<E>, extraArgs: UseQueryOptions) => {
        const navigation = useNavigation<any>()
        const hookRes = hook(args, extraArgs)

        if (isFetchError(hookRes)) {
            showPopup(navigation, hookRes.error.message)
        }
        return hookRes as UseQueryResult<InferQueryResult<E>>
    }
}

export function withPopupMutation<E>(hook: InferUseMutation<E>) {
    return () => {
        const [func, state] = hook()
        const navigation = useNavigation<any>()

        const useFunc = async (args: InferMutationArgs<E>) => {
            const funcRes = await func(args)

            if (isFetchError(funcRes)) {
                showPopup(navigation, funcRes.error.message)
            }
            return funcRes
        }
        return [useFunc, state]
    }
}
