import { PasswordGate } from './components/PasswordGate.jsx'
import DashboardApp from './components/DashboardApp.jsx'

function App() {
  return (
    <PasswordGate>
      <DashboardApp />
    </PasswordGate>
  )
}

export default App
