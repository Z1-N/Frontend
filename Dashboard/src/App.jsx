// src/App.jsx
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './Components/layout/DashboardLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { AddContestantPage } from './pages/AddContestantPage.jsx';
import { ContestantDetailsPage } from './pages/ContestantDetailsPage.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';

// الخطوة 1: استيراد دوال الـ API من ملف الخدمات
import { getContestants, addContestant, addPoints, addAward } from './services/api.js';

// مكون بسيط لعرض حالة التحميل
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
    </div>
);

export default function App() {
  const [page, setPage] = useState('login');
  const [pageProps, setPageProps] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [contestants, setContestants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect: يتم تشغيله مرة واحدة بعد تسجيل الدخول لجلب البيانات
  useEffect(() => {
    if (isAuthenticated) {
      fetchContestants();
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

  const navigate = (newPage, props = {}) => { setPage(newPage); setPageProps(props); };
  const handleLogin = (targetPage) => { setIsAuthenticated(true); navigate(targetPage); };
  const handleLogout = () => { setIsAuthenticated(false); setContestants([]); navigate('login'); };

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

  // دالة معالجة إضافة نقاط: تستخدم دالة addPoints من api.js
const handleAddPoints = async (racerId, points, reason) => {
    try {
      // إنشاء كائن البيانات (payload) بالتنسيق الصحيح الذي يتوقعه الخادم
      const payload = {
        number: points,
        racerId: racerId,
        dateTime: new Date().toISOString(), // إنشاء تاريخ ووقت حالي
        reason: reason
      };
      
      await addPoints(racerId, payload); // إرسال البيانات المحدثة
      fetchContestants();
    } catch (err) {
      alert("حدث خطأ أثناء إضافة النقاط.");
      console.error(err);
    }
  };

    const handleDeleteContestant = async (racerId) => {
    try {
      await deleteContestant(racerId);
      fetchContestants(); // Refresh the contestant list after a successful deletion
    } catch (err) {
      alert("حدث خطأ أثناء حذف المتسابق.");
      console.error(err);
    }
  };


  // دالة معالجة منح وسام: تستخدم دالة addAward من api.js
  const handleAwardBadge = async (racerId, badgeName) => {
    try {
      await addAward(racerId, { accolade: badgeName }); // <-- استخدام دالة الـ API
      fetchContestants();
    } catch (err) {
      alert("حدث خطأ أثناء منح الوسام.");
      console.error(err);
    }
  };

  // دالة عرض الصفحات: تقوم بتمرير دوال المعالجة كـ props
  const renderPage = () => {
    if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="flex items-center justify-center h-screen text-center p-8 text-red-600 bg-red-50">{error}</div>;

    let pageComponent;
    switch (page) {
      case 'dashboard': pageComponent = <DashboardPage contestants={contestants} navigate={navigate} />; break;
      case 'addContestant': pageComponent = <AddContestantPage onAddContestant={handleAddContestant} navigate={navigate} />; break;
      case 'contestantDetails': 
      
        const contestant = contestants.find(c => c.id === pageProps.id); 
        pageComponent = <ContestantDetailsPage contestant={contestant} onAddPoints={handleAddPoints} onAwardBadge={handleAwardBadge} navigate={navigate} />; 
        break;
      case 'results': pageComponent = <ResultsPage contestants={contestants} />; break;
      default: pageComponent = <DashboardPage contestants={contestants} navigate={navigate} />;
    }
    
    return <DashboardLayout navigate={navigate} onLogout={handleLogout} currentPage={page}>{pageComponent}</DashboardLayout>;
  };

  return <div className="min-h-screen bg-slate-100 text-slate-800">{renderPage()}</div>;
}
