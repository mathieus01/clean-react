import { LoadSurveyResult } from '@/domain/usecases'
import faker from 'faker'

export const mockSurveyResultModel = (): LoadSurveyResult.Model => ({
  id: faker.random.uuid(),
  question: faker.random.words(10),
  date: faker.date.recent(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word(),
    count: faker.random.number(),
    percent: faker.random.number(100),
    isCurrentAccountAnswer: faker.random.boolean()
  }, {
    answer: faker.random.word(),
    count: faker.random.number(),
    percent: faker.random.number(100),
    isCurrentAccountAnswer: faker.random.boolean()
  }]
})

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0
  survey = mockSurveyResultModel()

  async load (): Promise<LoadSurveyResult.Model> {
    this.callsCount++
    return Promise.resolve(this.survey)
  }
}