import { FieldValidation } from '@/validation/protocols/field-validation'
import { InvalidFieldError } from '@/validation/errors'

export class CompareFieldsValidation implements FieldValidation {
  constructor (
    readonly fieldName: string,
    readonly fieldToCompare: string
  ) {}

  validate (input: object): Error {
    return input[this.fieldName] !== input[this.fieldToCompare] ? new InvalidFieldError(this.fieldName) : null
  }
}
