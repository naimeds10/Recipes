import { ModifyError, RequestError } from '@recipes/api-types/v1'
import { inject, injectable } from 'inversify'
import { TYPES } from './constants'
import { NotFoundError, ForbiddenError } from '@/errors'
import { RecipeResult, SectionResult } from '@/types'
import { SectionService } from '@/services'

@injectable()
export default class Validator {
    @inject(TYPES.SectionService)
    private readonly sectionsService!: SectionService

    public validateError(error: ModifyError): ModifyError {
        switch (error.statusCode) {
            case RequestError.NOT_FOUND:
                throw new NotFoundError(error.statusMessage)

            case RequestError.FORBIDDEN:
                throw new ForbiddenError(error.statusMessage)

            default:
                break
        }
        return error
    }

    public async validateSections(
        userId: number,
        sectionIds: number[]
    ): Promise<Array<SectionResult | ModifyError>> {
        const sections = await this.sectionsService.getSectionResults(['ids'], {
            sectionIds,
        })

        const res = sectionIds.map((id) => {
            const section = sections.find((s) => s.id === id)
            if (typeof section === 'undefined') {
                return {
                    id,
                    statusCode: RequestError.NOT_FOUND,
                    statusMessage: 'Provided sectionId was not found',
                }
            }
            if (section.userId !== userId) {
                return {
                    id,
                    statusCode: RequestError.FORBIDDEN,
                    statusMessage:
                        'Provided section does not belong to the requesting user',
                }
            }
            return section
        })

        return res
    }

    public async validateRecipes(
        _userId: number,
        sectionId: number,
        recipeIds: number[]
    ): Promise<Array<RecipeResult | ModifyError>> {
        const section = (
            await this.sectionsService.getSections(['ids', 'recipes'], {
                sectionIds: [sectionId],
                recipeIds,
            })
        )[0]

        console.log('ValidateRecipes', section?.recipes?.length)
        return []
    }
}
