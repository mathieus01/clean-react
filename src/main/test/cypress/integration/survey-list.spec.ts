import faker from 'faker'
import * as Helper from '../support/helpers'
import * as Http from '../support/survey-list-mocks'

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.testSetLocalStorageItem('account', { accessToken: faker.random.uuid(), name: faker.name.findName() })
  })

  it('Should present error on UnexpectedError', () => {
    Http.mockServerError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve')
  })
  it('Should logout on AccessDeniedError', () => {
    Http.mockAccessDeniedError()
    cy.visit('')
    Helper.testUrl('/login')
  })
  it('Should present correct username', () => {
    Http.mockServerError()
    cy.visit('')
    const { name } = Helper.testGetLocalStorageItem('account')
    cy.getByTestId('username').should('contain.text', name)
  })
  it('Should logout on logout link click', () => {
    Http.mockServerError()
    cy.visit('')
    cy.getByTestId('logout').click()
    Helper.testUrl('/login')
  })
})
