import { LocalUpdateCurrentAccount } from './local-update-current-account'
import { SetStorageMock } from '@/data/test'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  setStorageMock: SetStorageMock
  sut: LocalUpdateCurrentAccount
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalUpdateCurrentAccount(setStorageMock)
  return {
    setStorageMock,
    sut
  }
}

describe('LocalUpdateCurrentAccount', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut()
    const account = mockAccountModel()
    await sut.save(account)
    expect(setStorageMock.key).toBe('account')
    expect(setStorageMock.value).toBe(JSON.stringify(account))
  })
  test('Should throw if SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error())
    const promise = sut.save(mockAccountModel())
    await expect(promise).rejects.toThrow(new Error())
  })
})
