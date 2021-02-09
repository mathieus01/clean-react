import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...Builder.field('name').required().min(3).build(),
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').min(5).required().build(),
    ...Builder.field('passwordConfirmation').required().sameAs('password').build()
  ])
}
