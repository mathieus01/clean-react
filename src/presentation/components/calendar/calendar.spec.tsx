import React from 'react'
import { Calendar } from '@/presentation/components'
import { render, screen } from '@testing-library/react'

const makeSut = (date: Date): void => {
  render(<Calendar date={date} />)
}

describe('Calendar Component', () => {
  test('Should render with correct values', () => {
    makeSut(new Date('2021-02-16T00:00:00'))
    expect(screen.getByTestId('day')).toHaveTextContent('16')
    expect(screen.getByTestId('month')).toHaveTextContent('fev')
    expect(screen.getByTestId('year')).toHaveTextContent('2021')
  })
  test('Should render with correct values', () => {
    makeSut(new Date('2019-12-13T00:00:00'))
    expect(screen.getByTestId('day')).toHaveTextContent('13')
    expect(screen.getByTestId('month')).toHaveTextContent('dez')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
  })
})
