import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'
import { Header, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: 'Campo obrigatorio',
    passwordError: 'Campo obrigatorio',
    mainError: ''
  })
  useEffect(() => {
    validation.validate('email', state.email)
  }, [state.email])
  useEffect(() => {
    validation.validate('password', state.password)
  }, [state.password])

  return (
    <div className={Styles.login}>
      <Header />
      <Context.Provider value={ { state, setState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="digite seu e-mail"/>
          <Input type="password" name="password" placeholder="digite seu senha"/>
          <button data-testid="submit" className={Styles.submit} type="submit" disabled>Entrar</button>
          <span className={Styles.link}>Criar Conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}
export default Login
