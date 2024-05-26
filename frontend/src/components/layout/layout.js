/* eslint-disable react/prop-types */
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './header'
import AppRoute from '../common/app-routes'

const Layout = () => (
  <BrowserRouter>
    <div className="w-full">
      <Header />
      <div className="w-full">
        <div
          className="bg-white pt-8 mt-8"
          style={{ height: 'calc(100vh - 40px)' }}
        >
          <AppRoute />
        </div>
      </div>
    </div>
  </BrowserRouter>
)

export default Layout
