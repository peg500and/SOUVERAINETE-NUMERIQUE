import { useState } from 'react'
import ModuleMDTRGPD from './components/ModuleMDTRGPD'
import GrilleFinOpsIA from './components/GrilleFinOpsIA'

function App() {
  const [activeModule, setActiveModule] = useState('mdt')

  return (
    <div>
      {/* Navigation bar */}
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="font-bold text-lg tracking-wide">
              Souveraineté Numérique
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModule('mdt')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeModule === 'mdt'
                    ? 'bg-white text-blue-900'
                    : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                }`}
              >
                Module MDT
              </button>
              <button
                onClick={() => setActiveModule('finops')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeModule === 'finops'
                    ? 'bg-white text-blue-900'
                    : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                }`}
              >
                Grille FinOps IA
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Active module */}
      {activeModule === 'mdt' ? <ModuleMDTRGPD /> : <GrilleFinOpsIA />}
    </div>
  )
}

export default App
