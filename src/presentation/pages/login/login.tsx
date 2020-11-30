import React, { useState } from 'react'
import Styles from './login-styles.scss'
import { Header, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

const Login: React.FC = () => {
  const [state] = useState({
    isLoading: false
  })
  const [errorState] = useState({
    email: 'Campo obrigatorio',
    password: 'Campo obrigatorio',
    main: ''
  })
  return (
    <div className={Styles.login}>
      <Header />
      <Context.Provider value={ { state, errorState }}>
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
