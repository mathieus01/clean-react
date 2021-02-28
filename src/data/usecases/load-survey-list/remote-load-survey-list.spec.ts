import { RemoteLoadSurveyList } from '@/data/usecases'
import { HttpClientSpy, mockRemoteSurveyListModel } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadSurveyList } from '@/domain/usecases'
import faker from 'faker'

interface SutTypes {
  sut: RemoteLoadSurveyList
  httpClientSpy: HttpClientSpy<LoadSurveyList.Model[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<LoadSurveyList.Model[]>()
  const sut = new RemoteLoadSurveyList(url, httpClientSpy)
  return {
    httpClientSpy,
    sut
  }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })
  test('Should throw AccessDeniedError if HttpClient returns 403 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 404 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 500 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should return a list of SurveyModels of HttpClient returns 200 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    const httpResult = mockRemoteSurveyListModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const surveyList = await sut.loadAll()
    await expect(surveyList).toEqual([{
      id: httpResult[0].id,
      question: httpResult[0].question,
      didAnswer: httpResult[0].didAnswer,
      date: new Date(httpResult[0].date)
    }])
  })
  test('Should return a empty list if HttpClient returns 204 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const surveyList = await sut.loadAll()
    await expect(surveyList).toEqual([])
  })
})
