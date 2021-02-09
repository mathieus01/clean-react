import React from 'react'
import SignUp from './signup'
import { Helper, ValidationStub } from '@/presentation/test'
import { RenderResult, render, cleanup, fireEvent } from '@testing-library/react'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
}

type SutParams = {
  validationErro: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationErro
  const sut = render(
    <SignUp
      validation={validationStub} />

  )
  return {
    sut
  }
}

const populateField = (sut: RenderResult, fieldName: string, value = faker.random.word()): void => {
  const input = sut.getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

describe('SignUp Component ', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', validationErro)
    Helper.testStatusForField(sut, 'email', 'Campo Obrigatorio')
    Helper.testStatusForField(sut, 'password', 'Campo Obrigatorio')
    Helper.testStatusForField(sut, 'passwordConfirmation', 'Campo Obrigatorio')
  })

  test('Should show name error if Validation fails', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name', validationErro)
  })
})
