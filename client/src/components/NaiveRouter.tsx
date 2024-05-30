import { type FC, useEffect, useState } from 'react'
import TransactionList from './TransactionsList'
import SingleTransaction from './SingleTransaction'

type RouteParams = Record<string, string>

const NaiveRouter: FC = () => {
  const [route, setRoute] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = (): void => {
      setRoute(window.location.pathname)
    }
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const matchRoute = (pattern: RegExp): RouteParams | null => {
    const match = route.match(pattern)
    if (match !== null) {
      const keys = [...match.slice(1).keys()]
      const values = match.slice(1)
      const params: RouteParams = {}
      keys.forEach((key, index) => {
        params[key] = values[index]
      })
      return params
    }
    return null
  }

  if (route === '/' || route === '/transactions') {
    return <TransactionList />
  } else if (matchRoute(/\/transaction\/(\w+)/) !== null) {
    const params = matchRoute(/\/transaction\/(\w+)/)
    const transactionId = params?.['0']
    return <SingleTransaction id={transactionId ?? null} />
  }

  return <div>404 Not Found</div>
}

export const navigate = (path: string): void => {
  window.history.pushState({}, '', path)
  const popStateEvent = new PopStateEvent('popstate')
  window.dispatchEvent(popStateEvent)
}

export default NaiveRouter
