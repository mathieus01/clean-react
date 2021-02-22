import faker from 'faker'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /surveys/
export const mockServerError = (): void => Http.mockServerError(path, 'GET')
export const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET')

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => {
      Helper.testSetLocalStorageItem('account', account)
    })
  })

  it('Should present error on UnexpectedError', () => {
    mockServerError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve')
  })
  it('Should logout on AccessDeniedError', () => {
    mockAccessDeniedError()
    cy.visit('')
    Helper.testUrl('/login')
  })
  it('Should present correct username', () => {
    mockServerError()
    cy.visit('')
    const { name } = Helper.testGetLocalStorageItem('account')
    cy.getByTestId('username').should('contain.text', name)
  })
  it('Should logout on logout link click', () => {
    mockServerError()
    cy.visit('')
    cy.getByTestId('logout').click()
    Helper.testUrl('/login')
  })
})
