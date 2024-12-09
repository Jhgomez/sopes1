import { useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Index from '../src/Pages/index'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} exact = {true} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
