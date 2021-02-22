import * as Http from './http-mocks'
import faker from 'faker'

export const mockUnauthorizedError = (): void => Http.mockUnauthorizedError(/login/)
export const mockServerError = (): void => Http.mockServerError(/login/, 'POST')
export const mockOk = (): void => Http.mockOk(/login/, 'POST', { accessToken: faker.random.uuid() })
