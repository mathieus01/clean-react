export type SurveyModel = {
  id: string
  question: string
  date: Date
  didAnswer: boolean
  answers: SurveyAnswer[]
}

type SurveyAnswer = {
  image?: string
  answer: string
}
