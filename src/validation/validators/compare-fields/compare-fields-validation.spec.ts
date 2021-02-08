import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'
import faker from 'faker'

const makeSut = (fieldName: string, valueToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(fieldName, valueToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid', () => {
    const sut = makeSut('', faker.random.word())
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError(''))
  })
  test('Should return falsy if compare is valid', () => {
    const valueToCompare = faker.random.word()
    const sut = makeSut(faker.database.column(), valueToCompare)
    const error = sut.validate(valueToCompare)
    expect(error).toBeFalsy()
  })
})
