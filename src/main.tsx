import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Demo} from "./Demo.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
)
