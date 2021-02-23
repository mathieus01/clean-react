export interface LoadSurveyResult {
  load(): Promise<LoadSurveyResult.Model>
}

export namespace LoadSurveyResult {
  export type Model = {
    id: string
    question: string
    date: Date
    answers: LoadSurveyResultAnswer[]
  }

  type LoadSurveyResultAnswer = {
    image?: string
    answer: string
    count: number
    percent: number
  }
}
