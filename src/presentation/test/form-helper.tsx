import { fireEvent, screen } from '@testing-library/react'
import faker from 'faker'

export const testStatusForField = (fieldName: string, validationErro?: string): void => {
  const fieldStatus = screen.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationErro || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationErro ? '🔴' : '🟢')
}

export const populateField = (fieldName: string, value = faker.random.word()): void => {
  const input = screen.getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}
