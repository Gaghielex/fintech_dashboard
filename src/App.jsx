import { PasswordGate } from './components/PasswordGate.jsx'
import { Phase1Status } from './components/Phase1Status.jsx'

function App() {
  return (
    <PasswordGate>
      <div className="min-h-dvh bg-canvas">
        <Phase1Status />
      </div>
    </PasswordGate>
  )
}

export default App
