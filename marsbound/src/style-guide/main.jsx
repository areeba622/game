import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/theme.css'
import './style-guide.css'
import StyleGuide from './StyleGuide.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyleGuide />
  </StrictMode>,
)
