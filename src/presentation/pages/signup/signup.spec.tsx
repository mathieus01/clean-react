import { Helper } from '@/presentation/test'
import { RenderResult, render } from '@testing-library/react'
import React from 'react'
import SignUp from './signup'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(
    <SignUp />

  )
  return {
    sut
  }
}

describe('SignUp Component ', () => {
  test('Should start with initial state', () => {
    const validationErro = 'Campo Obrigatorio'
    const { sut } = makeSut()
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', validationErro)
    Helper.testStatusForField(sut, 'email', validationErro)
    Helper.testStatusForField(sut, 'password', validationErro)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationErro)
  })
})
