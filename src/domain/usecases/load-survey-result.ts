export interface LoadSurveyResult {
  load(): Promise<LoadSurveyResult.Model>
}

export namespace LoadSurveyResult {
  export type Model = {
    id: string
    question: string
    date: Date
    answers: LoadSurveyResultAnswer.Model[]
  }
}
export namespace LoadSurveyResultAnswer {
  export type Model = {
    image?: string
    answer: string
    count: number
    percent: number
  }
}
