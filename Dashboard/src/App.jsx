
import { useState, useMemo } from 'react';
import { initialContestants } from './data/mockData';
import { DashboardLayout } from './Components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddContestantPage } from './pages/AddContestantPage';
import { ContestantDetailsPage } from './pages/ContestantDetailsPage';
import { ResultsPage } from './pages/ResultsPage';

export default function App() {
  const [page, setPage] = useState('login'); // 'login', 'dashboard', 'addContestant', 'contestantDetails', 'results'
  const [pageProps, setPageProps] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contestants, setContestants] = useState(initialContestants);

  const navigate = (newPage, props = {}) => {
    setPage(newPage);
    setPageProps(props);
  };

  const handleLogin = (targetPage) => {
      setIsAuthenticated(true);
      navigate(targetPage);
  }

  const handleLogout = () => {
      setIsAuthenticated(false);
      navigate('login');
  }

  const handleAddContestant = ({ name, batch }) => {
    const newContestant = {
      id: contestants.length + 1,
      name,
      batch,
      badges: { starOfCreativity: false, medalOfParticipation: false, medalOfCreativity: false },
      pointsHistory: [],
    };
    setContestants([...contestants, newContestant]);
  };

  const handleAddPoints = (contestantId, points, reason) => {
    setContestants(contestants.map(c => {
      if (c.id === contestantId) {
        const newPointEntry = {
          points,
          reason,
          date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
        };
        return { ...c, pointsHistory: [...c.pointsHistory, newPointEntry] };
      }
      return c;
    }));
  };

  const handleAwardBadge = (contestantId, badgeName) => {
      setContestants(contestants.map(c => {
          if (c.id === contestantId) {
              return { ...c, badges: { ...c.badges, [badgeName]: true } };
          }
          return c;
      }));
  };

  const renderPage = () => {
    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    let pageComponent;
    switch (page) {
      case 'dashboard':
        pageComponent = <DashboardPage contestants={contestants} navigate={navigate} />;
        break;
      case 'addContestant':
        pageComponent = <AddContestantPage onAddContestant={handleAddContestant} navigate={navigate} />;
        break;
      case 'contestantDetails':
        const contestant = contestants.find(c => c.id === pageProps.id);
        pageComponent = <ContestantDetailsPage contestant={contestant} onAddPoints={handleAddPoints} onAwardBadge={handleAwardBadge} navigate={navigate} />;
        break;
      case 'results':
        pageComponent = <ResultsPage contestants={contestants} />;
        break;
      default:
        pageComponent = <DashboardPage contestants={contestants} navigate={navigate} />;
    }
    
    return (
        <DashboardLayout navigate={navigate} onLogout={handleLogout}>
            {pageComponent}
        </DashboardLayout>
    );
  };

  return <div className="min-h-screen bg-gray-100">{renderPage()}</div>;
}
