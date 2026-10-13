import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CourseCatalogue from './components/CourseCatalogue';
import CourseDetails from './components/CourseDetails';
import CourseNotesReader from './components/CourseNotesReader';
import StudentDashboard from './components/StudentDashboard';
import PricingModal from './components/PricingModal';
import ProPaywallModal from './components/ProPaywallModal';
import HealthModal from './components/HealthModal';
import AuthModal from './components/AuthModal';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import { COURSES_DATA } from './data/coursesData';
import { checkBackendHealth, fetchCurrentUser, clearStoredToken, getStoredToken } from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [selectedCourse, setSelectedCourse] = useState(COURSES_DATA[0]);
  const [pendingCourseToLearn, setPendingCourseToLearn] = useState(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingPlanToOpen, setPricingPlanToOpen] = useState('quarterly');
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [paywallCourse, setPaywallCourse] = useState(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authPromptReason, setAuthPromptReason] = useState(null);

  // Real database-backed authenticated user profile
  const [currentUser, setCurrentUser] = useState(null);
  const [bannerMessage, setBannerMessage] = useState(null);

  // Backend Health State (Preserving Phase 1 integration)
  const [healthState, setHealthState] = useState({
    loading: true,
    ok: false,
    data: null,
    error: null,
    latencyMs: null,
    lastChecked: null,
  });

  const runHealthCheck = useCallback(async () => {
    setHealthState((prev) => ({ ...prev, loading: true }));
    const result = await checkBackendHealth();

    setHealthState({
      loading: false,
      ok: result.ok,
      data: result.data || null,
      error: result.error || null,
      latencyMs: result.latencyMs,
      lastChecked: new Date(),
    });
  }, []);

  // Fetch actual authenticated user on application load from database
  const loadAuthenticatedUser = useCallback(async () => {
    const result = await fetchCurrentUser();
    if (result.ok && result.user) {
      setCurrentUser(result.user);
    } else {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    runHealthCheck();
    loadAuthenticatedUser();
  }, [runHealthCheck, loadAuthenticatedUser]);

  // Sync hash routing for intuitive browser back/forward and bookmarking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'home') {
        setActiveView('landing');
      } else if (hash === 'courses') {
        setActiveView('courses');
      } else if (hash.startsWith('courses/')) {
        const courseId = hash.replace('courses/', '');
        const found = COURSES_DATA.find((c) => c.id === courseId);
        if (found) {
          setSelectedCourse(found);
          setActiveView('course-details');
        }
      } else if (hash.startsWith('learn/') || hash.startsWith('notes/')) {
        const courseId = hash.replace('notes/', '').replace('learn/', '');
        const found = COURSES_DATA.find((c) => c.id === courseId);
        if (found) {
          setSelectedCourse(found);
          const token = getStoredToken();
          if (!token) {
            setActiveView('course-details');
            setBannerMessage({
              type: 'info',
              text: '🔒 Please login first, then start reading! Your course progress, bookmarks, and notes will be saved.',
            });
            setPendingCourseToLearn(found);
            handleOpenAuth(
              'login',
              `Please log in first to access study notes for "${found.title}". You will be automatically redirected to your reading view after signing in!`
            );
          } else {
            setActiveView('notes');
          }
        }
      } else if (hash === 'dashboard') {
        setActiveView('dashboard');
      } else if (hash === 'quizzes' || hash === 'projects') {
        setActiveView('dashboard-quizzes');
      } else if (hash === 'certificates' || hash === 'resources') {
        setActiveView('dashboard-certificates');
      } else if (hash === 'pricing') {
        setIsPricingModalOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view) => {
    setActiveView(view);
    if (view === 'landing') window.location.hash = 'home';
    else if (view === 'courses') window.location.hash = 'courses';
    else if (view === 'dashboard') window.location.hash = 'dashboard';
    else if (view === 'dashboard-quizzes') window.location.hash = 'quizzes';
    else if (view === 'dashboard-certificates') window.location.hash = 'certificates';
    else if (view === 'pricing') {
      setPricingPlanToOpen('quarterly');
      setIsPricingModalOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActiveView('course-details');
    window.location.hash = `courses/${course.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPro = currentUser?.subscription?.status === 'pro';

  // Start Learning handler with Authentication & Pro paywall guards
  const handleStartLearning = (course) => {
    const targetCourse = course || selectedCourse;

    // 1. Unauthenticated Guard: Must be logged in to enter classroom
    if (!currentUser) {
      setPendingCourseToLearn(targetCourse);
      setBannerMessage({
        type: 'info',
        text: '🔒 Please login first, then start learning! Your course progress and notes will be saved.',
      });
      setTimeout(() => setBannerMessage(null), 6000);
      handleOpenAuth(
        'login',
        `Please log in first to start learning "${targetCourse.title}". You will be automatically redirected to your classroom after signing in!`
      );
      return;
    }

    // 2. Pro Subscription Guard: Pro courses require Pro membership
    if (targetCourse.isPro && !isPro) {
      setPaywallCourse(targetCourse);
      setIsPaywallModalOpen(true);
      return;
    }

    // 3. User is authorized: Enter the Notes Reader!
    setSelectedCourse(targetCourse);
    setActiveView('notes');
    window.location.hash = `notes/${targetCourse.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPaywall = (course) => {
    setPaywallCourse(course || selectedCourse);
    setIsPaywallModalOpen(true);
  };

  const handleOpenPricingWithPlan = (planId = 'quarterly') => {
    setIsPaywallModalOpen(false);
    setPricingPlanToOpen(planId);
    setIsPricingModalOpen(true);
  };

  const handleOpenAuth = (mode = 'login', reason = null) => {
    setAuthModalMode(mode);
    setAuthPromptReason(reason);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setCurrentUser(authenticatedUser);
    setBannerMessage({
      type: 'success',
      text: `Welcome, ${authenticatedUser.name}! Successfully signed in with ${authenticatedUser.subscription?.status.toUpperCase()} plan.`,
    });
    setTimeout(() => setBannerMessage(null), 5000);

    // If student was trying to start a course before login, launch it right now!
    if (pendingCourseToLearn) {
      const target = pendingCourseToLearn;
      setPendingCourseToLearn(null);
      const userIsPro = authenticatedUser.subscription?.status === 'pro';
      if (target.isPro && !userIsPro) {
        setPaywallCourse(target);
        setIsPaywallModalOpen(true);
      } else {
        setSelectedCourse(target);
        setActiveView('notes');
        window.location.hash = `notes/${target.id}`;
      }
    } else {
      handleNavigate('dashboard');
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setCurrentUser(null);
    setBannerMessage({
      type: 'info',
      text: 'You have been safely signed out.',
    });
    setTimeout(() => setBannerMessage(null), 4000);
    handleNavigate('landing');
  };

  const handlePaymentSuccess = (upgradedUser) => {
    setCurrentUser(upgradedUser);
    setBannerMessage({
      type: 'success',
      text: `🎉 Pro Subscription Active! Welcome to Aptivella Pro, ${upgradedUser.name}! Unlimited courses and projects are now unlocked.`,
    });
    setTimeout(() => setBannerMessage(null), 7000);
  };

  return (
    <div className="app-wrapper">
      {/* Top Notification Toast */}
      {bannerMessage && (
        <div
          className={`top-notification-toast ${bannerMessage.type === 'success' ? 'toast-success' : 'toast-info'}`}
          role="status"
          aria-live="polite"
        >
          {bannerMessage.text}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        isBackendOnline={healthState.ok}
        latencyMs={healthState.latencyMs}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
        onOpenPricing={() => handleOpenPricingWithPlan('quarterly')}
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main id="main-content">
        {/* Screen 1: Landing Page */}
        {activeView === 'landing' && (
          <>
            <Hero
              onStartLearning={() => handleStartLearning(COURSES_DATA[0])}
              onExploreCourses={() => handleNavigate('courses')}
              onOpenPricing={() => handleOpenPricingWithPlan('quarterly')}
            />

            {/* Core Platform Pillars & Features Showcase */}
            <Features />

            {/* Quick Preview of Courses Catalogue on Landing Page */}
            <div>
              <CourseCatalogue
                courses={COURSES_DATA}
                onSelectCourse={handleSelectCourse}
                onOpenPricing={() => handleOpenPricingWithPlan('quarterly')}
                isPro={isPro}
              />
            </div>
          </>
        )}

        {/* Screen 2: Dedicated Course Catalogue */}
        {activeView === 'courses' && (
          <CourseCatalogue
            courses={COURSES_DATA}
            onSelectCourse={handleSelectCourse}
            onOpenPricing={() => handleOpenPricingWithPlan('quarterly')}
            isPro={isPro}
          />
        )}

        {/* Screen 3: Course Details */}
        {activeView === 'course-details' && (
          <CourseDetails
            course={selectedCourse}
            onBack={() => handleNavigate('courses')}
            onOpenPricing={() => handleOpenPricingWithPlan('quarterly')}
            onStartLearning={handleStartLearning}
            onOpenPaywall={handleOpenPaywall}
            user={currentUser}
          />
        )}

        {/* Screen 4: Comprehensive Course Notes & Study Materials Reader */}
        {(activeView === 'learn' || activeView === 'notes') && (
          <CourseNotesReader
            course={selectedCourse}
            user={currentUser}
            onBack={() => handleSelectCourse(selectedCourse)}
            onOpenPricing={() => handleOpenPricingWithPlan('quarterly')}
            onOpenPaywall={handleOpenPaywall}
          />
        )}

        {/* Screen 5: Student Dashboard */}
        {(activeView === 'dashboard' ||
          activeView === 'dashboard-quizzes' ||
          activeView === 'dashboard-certificates') && (
          <StudentDashboard
            courses={COURSES_DATA}
            onSelectCourse={handleSelectCourse}
            onStartLearning={handleStartLearning}
            onOpenPricing={() => handleOpenPricingWithPlan('quarterly')}
            onOpenPaywall={handleOpenPaywall}
            user={currentUser}
            onOpenAuth={handleOpenAuth}
            onNavigateLanding={() => handleNavigate('landing')}
            initialTab={
              activeView === 'dashboard-quizzes'
                ? 'quizzes'
                : activeView === 'dashboard-certificates'
                ? 'certificates'
                : 'dashboard'
            }
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        isBackendOnline={healthState.ok}
        latencyMs={healthState.latencyMs}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
      />

      {/* Screen 6: Pricing and Pro Upgrade Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onPaymentSuccess={handlePaymentSuccess}
        initialPlanId={pricingPlanToOpen}
      />

      {/* Fascinating Pro Paywall Modal */}
      <ProPaywallModal
        isOpen={isPaywallModalOpen}
        onClose={() => setIsPaywallModalOpen(false)}
        course={paywallCourse}
        user={currentUser}
        onOpenPricing={handleOpenPricingWithPlan}
        onOpenAuth={handleOpenAuth}
      />

      {/* API Health Diagnostics Modal */}
      <HealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        healthState={healthState}
        onRefresh={runHealthCheck}
      />

      {/* Real Authentication Modal (Registration & Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        promptReason={authPromptReason}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Screen 7: Responsive Mobile Navigation Bar */}
      <MobileNav
        activeView={activeView}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
