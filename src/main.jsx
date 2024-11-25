import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router'
import { RouterProvider } from 'react-router-dom'
import { QuioscoProvider } from './context/QuioscoProvider'


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <QuioscoProvider> {/*La informacion del context Quiosco esta disponible de forma global  */}
        <RouterProvider router={router} />
    </QuioscoProvider>
  </StrictMode>,
)
