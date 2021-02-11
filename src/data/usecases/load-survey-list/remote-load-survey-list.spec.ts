import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'

interface SutTypes {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
  return {
    httpGetClientSpy,
    sut
  }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HTTPGetClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })
})
