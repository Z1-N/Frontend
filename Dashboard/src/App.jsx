// src/App.jsx
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './Components/layout/DashboardLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { AddContestantPage } from './pages/AddContestantPage.jsx';
import { ContestantDetailsPage } from './pages/ContestantDetailsPage.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';
import { PublicLeaderboardPage } from './pages/PublicLeaderboardPage.jsx';

// الخطوة 1: استيراد دوال الـ API من ملف الخدمات
import { getContestants, addContestant, addPoints, addAward, deleteContestant, getAccolades, login, setAuthToken, clearAuthToken } from './services/api.js';

// مكون بسيط لعرض حالة التحميل
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
    </div>
);

export default function App() {
  const [page, setPage] = useState(() => {
    try { return localStorage.getItem('page') || 'public'; } catch { return 'public'; }
  });
  const [pageProps, setPageProps] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return JSON.parse(localStorage.getItem('isAuthenticated') || 'false'); } catch { return false; }
  });
  // Feature flag: toggle to enforce real JWT when ready
  const [useJwtAuth] = useState(false);
  const [accolades, setAccolades] = useState([])
  const [contestants, setContestants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize starting page for guests
  useEffect(() => {
    if (!isAuthenticated && (page === 'login' || page === 'dashboard' || page === 'results' || page === 'contestantDetails' || page === 'addContestant')) {
      navigate('public');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect: يتم تشغيله مرة واحدة بعد تسجيل الدخول لجلب البيانات
  useEffect(() => {
    if (isAuthenticated) {
      fetchContestants();
      fetchAccolades();
    }
  }, [isAuthenticated]);

  // دالة جلب البيانات: تستخدم دالة getContestants من api.js
  const fetchContestants = async () => {
    try {
      setIsLoading(true);
      const response = await getContestants(); // <-- استخدام دالة الـ API
      setContestants(response.data || []); 
      setError(null);
    } catch (err) {
      setError("فشل في جلب البيانات من الخادم.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = (newPage, props = {}) => {
    setPage(newPage);
    setPageProps(props);
    try {
      localStorage.setItem('page', newPage);
      // Persist a minimal pageProps when needed (e.g., contestantDetails id)
      if (newPage === 'contestantDetails' && props && props.id) {
        localStorage.setItem('pageProps', JSON.stringify({ id: props.id }));
      } else {
        localStorage.removeItem('pageProps');
      }
    } catch {}
  };
  const handleLogin = async (targetPage, credentials) => {
    if (useJwtAuth) {
      try {
        const { username, password } = credentials || {};
        const res = await login(username, password);
        // Expecting { token: '...' } in response
        const token = res?.data?.token || res?.data;
        if (!token) throw new Error('No token returned');
        setAuthToken(token);
      } catch (e) {
        alert('فشل تسجيل الدخول. تحقق من بيانات الاعتماد.');
        return;
      }
    }
    setIsAuthenticated(true);
    try { localStorage.setItem('isAuthenticated', 'true'); } catch {}
    navigate(targetPage);
  };
  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    try { localStorage.removeItem('isAuthenticated'); } catch {}
    setContestants([]);
    navigate('public');
  };

  // دالة معالجة إضافة متسابق: تستخدم دالة addContestant من api.js
  const handleAddContestant = async ({ name, batch }) => {
    try {
        await addContestant({ name, description: batch }); // <-- استخدام دالة الـ API
        await fetchContestants();
        navigate('dashboard');
    } catch (err) {
        alert("حدث خطأ أثناء إضافة المتسابق.");
        console.error(err);
    }
  };
  const fetchAccolades = async () => {
    try {
      const response = await getAccolades();
      setAccolades(response.data || []);
    } catch (err) {
      console.error("Failed to fetch accolades:", err);
    }
  };
  // دالة معالجة إضافة نقاط: تستخدم دالة addPoints من api.js
const handleAddPoints = async (RacerId, points, reason) => {
    try {
      // إنشاء كائن البيانات (payload) بالتنسيق الصحيح الذي يتوقعه الخادم
      const payload = {
        number: points,
        RacerId: RacerId,
        dateTime: new Date().toISOString(), // إنشاء تاريخ ووقت حالي
        reason: reason
      };
      
      await addPoints(RacerId, payload); // إرسال البيانات المحدثة
      fetchContestants();
    } catch (err) {
      alert("حدث خطأ أثناء إضافة النقاط.");
      console.error(err);
    }
  };

    const handleDeleteContestant = async (RacerId) => {
    try {
      await deleteContestant(RacerId);
      fetchContestants(); // Refresh the contestant list after a successful deletion
    } catch (err) {
      alert("حدث خطأ أثناء حذف المتسابق.");
      console.error(err);
    }
  };


  // دالة معالجة منح وسام: ترسل سبب المنح (إن وُجد) إلى الـ API
const handleAwardBadge = async (racerId, accoladeId, reason) => {
    try {
      await addAward(racerId, accoladeId, reason);
      fetchContestants();
    } catch (err) {
      alert("حدث خطأ أثناء منح الوسام.");
      console.error(err);
    }
  };

  // دالة عرض الصفحات: تقوم بتمرير دوال المعالجة كـ props
  const renderPage = () => {
    if (!isAuthenticated) {
      if (page === 'login') return <LoginPage onLogin={handleLogin} />;
      // Public landing page
      return <PublicLeaderboardPage onAdminLogin={() => navigate('login')} />;
    }
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="flex items-center justify-center h-screen text-center p-8 text-red-600 bg-red-50">{error}</div>;

    let pageComponent;
    switch (page) {
      case 'dashboard': pageComponent = <DashboardPage contestants={contestants} navigate={navigate} />; break;
      case 'addContestant': pageComponent = <AddContestantPage onAddContestant={handleAddContestant} navigate={navigate} />; break;
      case 'contestantDetails': 
        // Try to recover id from storage if missing
        let id = pageProps.id;
        if (!id) {
          try { id = JSON.parse(localStorage.getItem('pageProps') || '{}')?.id; } catch {}
        }
        const contestant = contestants.find(c => c.id === id);
        pageComponent = <ContestantDetailsPage contestant={contestant} onAddPoints={handleAddPoints} onAwardBadge={handleAwardBadge} navigate={navigate} onDeleteContestant={handleDeleteContestant} availableAccolades={accolades} />; 
        break;
      case 'results': pageComponent = <ResultsPage contestants={contestants} />; break;
  default: pageComponent = <DashboardPage contestants={contestants} navigate={navigate} />;
    }
    
    return <DashboardLayout navigate={navigate} onLogout={handleLogout} currentPage={page}>{pageComponent}</DashboardLayout>;
  };

  return <div className="min-h-screen bg-slate-100 text-slate-800">{renderPage()}</div>;
}
