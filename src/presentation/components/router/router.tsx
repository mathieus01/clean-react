import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-Router-dom'
import { Login } from '@/presentation/pages'
import '@/presentation/styles/global.scss'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
