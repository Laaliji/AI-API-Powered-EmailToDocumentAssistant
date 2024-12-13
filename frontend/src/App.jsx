import React from 'react'
import ChatApp from './components/ChatInterface'
import './App.css'
import { QueryClient , QueryClientProvider } from 'react-query' 

function App() {
  const queryClient = new QueryClient()
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ChatApp />
      </QueryClientProvider>
    </div>
  )
}

export default App