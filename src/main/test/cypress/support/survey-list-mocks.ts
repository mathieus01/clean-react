import * as Http from './http-mocks'
import faker from 'faker'

export const mockServerError = (): void => Http.mockServerError(/surveys/, 'GET')
export const mockAccessDeniedError = (): void => Http.mockForbiddenError(/surveys/, 'GET')
