import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy, UpdateCurrentAccountMock, Helper } from '@/presentation/test'
import faker from 'faker'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  updateCurrentAccountMock: UpdateCurrentAccountMock
}
type SutParams = {
  validationErro: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationErro
  const authenticationSpy = new AuthenticationSpy()
  const updateCurrentAccountMock = new UpdateCurrentAccountMock()
  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        updateCurrentAccount={updateCurrentAccountMock} />
    </Router>

  )
  return {
    sut,
    authenticationSpy,
    updateCurrentAccountMock
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationErro = faker.random.words()
    const { sut } = makeSut({ validationErro })
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'email', validationErro)
    Helper.testStatusForField(sut, 'password', validationErro)
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
  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email')
  })
  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password')
  })
  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })
  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    Helper.testElementsExists(sut, 'spinner')
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })
  test('Should not call Authentication if form is invalid', async () => {
    const validationErro = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationErro })
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })
  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })
  test('Should call UpdateCurrentAccount on success', async () => {
    const { sut, authenticationSpy, updateCurrentAccountMock } = makeSut()
    await simulateValidSubmit(sut)
    expect(updateCurrentAccountMock.account).toEqual(authenticationSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })
  test('Should present error if UpdateCurrentAccount fails', async () => {
    const { sut, updateCurrentAccountMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(updateCurrentAccountMock, 'save').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })
  test('Should go to signup page', () => {
    const { sut } = makeSut()
    const signupLink = sut.getByTestId('signup-link')
    fireEvent.click(signupLink)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
