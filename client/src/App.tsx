import { type FC } from 'react'

import NaiveRouter from './components/NaiveRouter'
import Navigation from './components/Navigation'

import './App.css'

const App: FC = () =>
  <div>
    <Navigation />
    <NaiveRouter />
  </div>

export default App
