import { RemoteLoadSurveyResult } from '@/data/usecases'
import { HttpGetClientSpy } from '@/data/test'
import faker from 'faker'
import { HttpGetClient } from '@/data/protocols/http'

type SutTypes = {
  sut: RemoteLoadSurveyResult
  httpGetClientSpy: HttpGetClientSpy<any>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<any>()
  const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy)
  return {
    sut,
    httpGetClientSpy
  }
}

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    await sut.load()
    expect(httpGetClientSpy.url).toBe(url)
  })
})
