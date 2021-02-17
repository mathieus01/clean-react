import { RemoteLoadSurveyList } from '@/data/usecases'
import { HttpGetClientSpy, mockRemoteSurveyListModel } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { LoadSurveyList } from '@/domain/usecases'
import faker from 'faker'

interface SutTypes {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<LoadSurveyList.Model[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<LoadSurveyList.Model[]>()
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
  return {
    httpGetClientSpy,
    sut
  }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })
  test('Should throw UnexpectedError if HttpGetClient returns 403 ', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpGetClient returns 404 ', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpGetClient returns 500 ', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should return a list of SurveyModels of HttpGetClient returns 200 ', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const httpResult = mockRemoteSurveyListModel()
    httpGetClientSpy.response = {
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
  test('Should return a empty list if HttpGetClient returns 204 ', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const surveyList = await sut.loadAll()
    await expect(surveyList).toEqual([])
  })
})
