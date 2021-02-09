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

const testChildCount = (sut: RenderResult, fieldName: string, count: number): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.childElementCount).toBe(count)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationErro?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationErro || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationErro ? '🔴' : '🟢')
}

describe('SignUp Component ', () => {
  test('Should start with initial state', () => {
    const validationErro = 'Campo Obrigatorio'
    const { sut } = makeSut()
    testChildCount(sut, 'error-wrap', 0)
    testButtonIsDisabled(sut, 'submit', true)
    testStatusForField(sut, 'name', validationErro)
    testStatusForField(sut, 'email', validationErro)
    testStatusForField(sut, 'password', validationErro)
    testStatusForField(sut, 'passwordConfirmation', validationErro)
  })
})
