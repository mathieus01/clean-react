import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import 'jest-localstorage-mock'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import faker from 'faker'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}
type SutParams = {
  validationErro: string
}

const history = createMemoryHistory()

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationErro
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>

  )
  return {
    sut,
    authenticationSpy
  }
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}
const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusForField = (sut: RenderResult, fieldName: string, validationErro?: string): void => {
  const passwordStatus = sut.getByTestId(`${fieldName}-status`)
  expect(passwordStatus.title).toBe(validationErro || 'Tudo certo!')
  expect(passwordStatus.textContent).toBe(validationErro ? '🔴' : '🟢')
}

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should start with initial state', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    simulateStatusForField(sut, 'email', validationErro)
    simulateStatusForField(sut, 'password', validationErro)
  })
  test('Should show email error if Validation fails', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    populateEmailField(sut)
    simulateStatusForField(sut, 'email', validationErro)
  })
  test('Should show password error if Validation fails', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    populatePasswordField(sut)
    simulateStatusForField(sut, 'password', validationErro)
  })
  test('Should show email error if Validation fails', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    simulateStatusForField(sut, 'email')
  })
  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    simulateStatusForField(sut, 'password')
  })
  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })
  test('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password)
    const spinner = sut.getByTestId('spinner')
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })
  test('Should not call Authentication if form is invalid', () => {
    const validationErro = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationErro })
    populateEmailField(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })
  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    simulateValidSubmit(sut)
    const errorWrap = sut.getByTestId('error-wrap')
    await waitFor(() => errorWrap)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })
  test('Should add accessToken to localStorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => sut.getByTestId('form'))
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
  })
  test('Should go to signup page', () => {
    const { sut } = makeSut()
    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
