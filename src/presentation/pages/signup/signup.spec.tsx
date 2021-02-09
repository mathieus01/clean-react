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

describe('SignUp Component ', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', validationErro)
    Helper.testStatusForField(sut, 'email', validationErro)
    Helper.testStatusForField(sut, 'password', validationErro)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationErro)
  })

  test('Should show name error if Validation fails', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name', validationErro)
  })

  test('Should show email error if Validation fails', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email', validationErro)
  })

  test('Should show password error if Validation fails', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password', validationErro)
  })

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation', validationErro)
  })
})
