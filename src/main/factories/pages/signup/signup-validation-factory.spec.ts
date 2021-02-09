import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'
import { makeSignUpValidation } from './signup-validation-factory'

describe('SignUpValidationFactory', () => {
  test('Should make ValidationComposite with correct validations', () => {
    const composite = makeSignUpValidation()
    expect(composite).toEqual(new ValidationComposite([
      ...Builder.field('name').required().min(3).build(),
      ...Builder.field('email').required().email().build(),
      ...Builder.field('password').min(5).required().build(),
      ...Builder.field('passwordConfirmation').min(5).required().sameAs('password').build()
    ]))
  })
})