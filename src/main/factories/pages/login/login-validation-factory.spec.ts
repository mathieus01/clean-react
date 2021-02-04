import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators/builder/validation-builder'
import { makeLoginValidation } from './login-validation-factory'

describe('LoginValidationFactory', () => {
  test('Should make ValidationComposite with correct validations', () => {
    const composite = makeLoginValidation()
    expect(composite).toEqual(new ValidationComposite([
      ...ValidationBuilder.field('email').required().email().build(),
      ...ValidationBuilder.field('password').min(5).required().build()
    ]))
  })
})