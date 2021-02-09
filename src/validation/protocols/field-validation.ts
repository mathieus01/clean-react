export interface FieldValidation {
  fieldName: string
  validate(value: object): Error
}
