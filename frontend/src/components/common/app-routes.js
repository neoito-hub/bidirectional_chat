import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const AppRoute = () => {
  const Chat = lazy(() => import('../chat'))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<Chat />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoute
