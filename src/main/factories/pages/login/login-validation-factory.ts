import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators/builder/validation-builder'

export const makeLoginValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').min(5).required().build()
  ])
}
