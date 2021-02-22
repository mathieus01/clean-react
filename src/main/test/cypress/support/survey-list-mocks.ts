import * as Http from './http-mocks'
import faker from 'faker'

export const mockServerError = (): void => Http.mockServerError(/surveys/, 'GET')
