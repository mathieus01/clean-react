import * as FormHelper from '../support/form-helpers'
import * as Helper from '../support/helpers'
import * as Http from '../support/signup-mocks'
import faker from 'faker'

const populateFields = (): void => {
  const password = faker.random.alphaNumeric(5)
  cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(password)
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('name', 'Campo obrigatorio')
    FormHelper.testInputStatus('email', 'Campo obrigatorio')
    FormHelper.testInputStatus('password', 'Campo obrigatorio')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatorio')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })
  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(2))
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(4))
    FormHelper.testInputStatus('email', 'Campo email invalido')
    FormHelper.testInputStatus('name', 'Campo name invalido')
    FormHelper.testInputStatus('password', 'Campo password invalido')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo passwordConfirmation invalido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })
  it('Should present valid state if form is valid', () => {
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })
  it('Should present EmailInUseError on 403', () => {
    Http.mockForbiddenError()
    simulateValidSubmit()
    FormHelper.testMainError('Esse e-mail ja esta em uso')
    Helper.testUrl('/signup')
  })
  it('Should present UnexpectedError on default error cases', () => {
    Http.mockServerError()
    simulateValidSubmit()
    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve')
    Helper.testUrl('/signup')
  })

  it('Should present save accessToken if valid credentials are provided', () => {
    Http.mockOk()
    simulateValidSubmit()
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })
  it('Should prevent multiple submits', () => {
    Http.mockOk()
    populateFields()
    cy.getByTestId('submit').dblclick()
    Helper.testHttpCallsCount(1)
  })
  it('Should not call submit if form is invalid', () => {
    Http.mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    Helper.testHttpCallsCount(0)
  })
})
