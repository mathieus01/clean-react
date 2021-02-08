import { FieldValidation } from '@/validation/protocols/field-validation'
import { InvalidFieldError } from '@/validation/errors'

export class CompareFieldsValidation implements FieldValidation {
  constructor (
    readonly fieldName: string,
    readonly valueToCompare: string
  ) {}

  validate (value: string): Error {
    return value !== this.valueToCompare ? new InvalidFieldError(this.fieldName) : null
  }
}
