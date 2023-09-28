import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import {PrimaderaApp} from './PrimaderaApp.jsx'

import './Styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <PrimaderaApp />
    </BrowserRouter>
  </React.StrictMode>,
)
