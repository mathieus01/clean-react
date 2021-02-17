import faker from 'faker'
import { Authentication } from '@/domain/usecases'

export const mockAuthentication = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): Authentication.Model => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName()
})
