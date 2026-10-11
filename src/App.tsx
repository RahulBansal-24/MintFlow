import React, { useState } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { BudgetActivityPage } from './pages/BudgetActivityPage';
import { GoalsPage } from './pages/GoalsPage';
import { CommitmentsPage } from './pages/CommitmentsPage';
import { FinancialHealthPage } from './pages/FinancialHealthPage';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { SpendSimulatorView } from './components/SpendSimulatorView';
import { SimulationDecision } from './engine/types';

const MainAppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('MINTFLOW_ONBOARDING_SEEN');
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [simulatorModalDecision, setSimulatorModalDecision] = useState<Partial<SimulationDecision> | null>(null);

  const handleLaunchScenario = (decision: Partial<SimulationDecision>) => {
    setSimulatorModalDecision(decision);
  };

  const handleCloseOnboarding = () => {
    localStorage.setItem('MINTFLOW_ONBOARDING_SEEN', 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onOpenSimulatorModal={() => setSimulatorModalDecision({ amount: 1200, title: 'Impulse Purchase' })}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
          onOpenSimulatorModal={() => setSimulatorModalDecision({ amount: 1200, title: 'Impulse Purchase' })}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'overview' && (
            <OverviewPage
              onNavigate={setCurrentPage}
              onOpenSimulator={() => setSimulatorModalDecision({ amount: 1200, title: 'Impulse Purchase' })}
              onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
            />
          )}

          {currentPage === 'simulator' && <SimulatorPage />}

          {currentPage === 'budget' && <BudgetActivityPage />}

          {currentPage === 'goals' && <GoalsPage />}

          {currentPage === 'commitments' && <CommitmentsPage />}

          {currentPage === 'health' && <FinancialHealthPage />}
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Guided Demo Modal */}
      <GuidedDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchScenario={handleLaunchScenario}
      />

      {/* 2. Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />

      {/* 3. Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />

      {/* 4. Global Spend Simulator Overlay Modal */}
      {simulatorModalDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl my-8">
            <SpendSimulatorView
              isModal={true}
              initialDecision={simulatorModalDecision}
              onClose={() => setSimulatorModalDecision(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <FinancialProvider>
      <MainAppContent />
    </FinancialProvider>
  );
}

export default App;
