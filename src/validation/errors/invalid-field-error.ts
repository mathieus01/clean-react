export class InvalidFieldError extends Error {
  constructor (field: string) {
    super(`Campo ${field} invalido`)
    this.name = 'InvalidFieldError'
  }
}
