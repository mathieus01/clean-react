import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /surveys/
export const mockServerError = (): void => Http.mockServerError(path, 'GET')

describe('SurveyResult', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => {
      Helper.testSetLocalStorageItem('account', account)
    })
  })

  it('Should present error on UnexpectedError', () => {
    mockServerError()
    cy.visit('/surveys/any_id')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve')
  })
})
