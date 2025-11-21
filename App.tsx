
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Scale, FileText, Users, BrainCircuit, Gavel, Settings, Menu, X, MessageSquare, Mic, Calendar } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CaseManager from './components/CaseManager';
import WitnessLab from './components/WitnessLab';
import StrategyRoom from './components/StrategyRoom';
import ArgumentPractice from './components/ArgumentPractice';
import DraftingAssistant from './components/DraftingAssistant';
import SettingsPage from './components/Settings';
import SessionHistory from './components/SessionHistory';
import MockJury from './components/MockJury';
import EvidenceTimeline from './components/EvidenceTimeline';
import LandingPage from './components/LandingPage';
import { MOCK_CASES } from './constants';
import { Case } from './types';
import { loadCases, saveCases, loadActiveCaseId, saveActiveCaseId, loadPreferences } from './utils/storage';

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'bg-slate-800 text-gold-500 border-r-4 border-gold-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white';

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => (
    <Link 
      to={path} 
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-3 px-6 py-4 transition-all duration-200 ${isActive(path)}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-950 border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-gold-500">
            <Scale size={28} />
            <span className="text-xl font-serif font-bold text-white">LexSim</span>
          </div>
          <button className="ml-auto md:hidden text-slate-400" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col">
          <NavItem path="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem path="/cases" icon={Gavel} label="Case Files" />
          <NavItem path="/practice" icon={Mic} label="Trial Simulator" />
          <NavItem path="/sessions" icon={MessageSquare} label="Session History" />
          <NavItem path="/jury" icon={Users} label="Mock Jury" />
          <NavItem path="/timeline" icon={Calendar} label="Evidence Timeline" />
          <NavItem path="/witness-lab" icon={Users} label="Witness Lab" />
          <NavItem path="/strategy" icon={BrainCircuit} label="Strategy & AI" />
          <NavItem path="/docs" icon={FileText} label="Drafting Assistant" />
          <div className="mt-auto border-t border-slate-800 pt-4 mb-6">
            <NavItem path="/settings" icon={Settings} label="Settings" />
          </div>
        </nav>
      </aside>
    </>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="md:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
          <button className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-sm font-semibold text-white">Attorney J. Doe</span>
               <span className="text-xs text-slate-400">Senior Litigator</span>
             </div>
             <div className="h-10 w-10 rounded-full bg-slate-700 border border-slate-600 overflow-hidden">
                <img src="https://picsum.photos/id/1005/100/100" alt="Profile" className="h-full w-full object-cover"/>
             </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

// Context for global state
export const AppContext = React.createContext<{
  cases: Case[];
  activeCase: Case | null;
  setActiveCase: (c: Case) => void;
  addCase: (c: Case) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}>({
  cases: [],
  activeCase: null,
  setActiveCase: () => {},
  addCase: () => {},
  updateCase: () => {},
  deleteCase: () => {},
  theme: 'dark',
  setTheme: () => {},
});

const App = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const preferences = loadPreferences();
  const [theme, setTheme] = useState<'dark' | 'light'>(preferences.theme);

  // Load cases from localStorage on mount
  useEffect(() => {
    const savedCases = loadCases();
    if (savedCases.length > 0) {
      setCases(savedCases);

      // Load active case
      const activeCaseId = loadActiveCaseId();
      if (activeCaseId) {
        const foundCase = savedCases.find(c => c.id === activeCaseId);
        if (foundCase) {
          setActiveCase(foundCase);
        }
      }
    } else {
      // Initialize with MOCK_CASES only if no saved data
      setCases(MOCK_CASES);
    }
    setIsLoaded(true);
  }, []);

  // Save cases to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveCases(cases);
    }
  }, [cases, isLoaded]);

  // Save active case ID whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveActiveCaseId(activeCase?.id || null);
    }
  }, [activeCase, isLoaded]);

  const addCase = (newCase: Case) => {
    setCases(prev => [...prev, newCase]);
    if (!activeCase) {
      setActiveCase(newCase);
    }
  };

  const updateCase = (id: string, updates: Partial<Case>) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (activeCase?.id === id) {
      setActiveCase(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteCase = (id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
    if (activeCase?.id === id) {
      setActiveCase(null);
    }
  };

  return (
    <AppContext.Provider value={{
      cases,
      activeCase,
      setActiveCase,
      addCase,
      updateCase,
      deleteCase,
      theme,
      setTheme
    }}>
      <HashRouter>
        <Routes>
          {/* Landing page without app layout */}
          <Route path="/landing" element={<LandingPage />} />

          {/* App routes with layout */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/cases" element={<Layout><CaseManager /></Layout>} />
          <Route path="/witness-lab" element={<Layout><WitnessLab /></Layout>} />
          <Route path="/practice" element={<Layout><ArgumentPractice /></Layout>} />
          <Route path="/sessions" element={<Layout><SessionHistory /></Layout>} />
          <Route path="/jury" element={<Layout><MockJury /></Layout>} />
          <Route path="/timeline" element={<Layout><EvidenceTimeline /></Layout>} />
          <Route path="/strategy" element={<Layout><StrategyRoom /></Layout>} />
          <Route path="/docs" element={<Layout><DraftingAssistant /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;