import React, { useState, useEffect } from 'react';
import { getQuizForCourse } from '../data/quizzesAndCertificates';
import { submitQuizResult } from '../services/api';

export default function QuizModal({
  isOpen,
  onClose,
  course,
  user,
  onQuizCompleted,
  onViewCertificate,
}) {
  const [quizState, setQuizState] = useState('intro'); // 'intro' | 'active' | 'submitting' | 'results'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [resultsData, setResultsData] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  const quiz = course ? getQuizForCourse(course.id) : null;

  useEffect(() => {
    if (isOpen) {
      setQuizState('intro');
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setResultsData(null);
      setSubmissionError(null);
    }
  }, [isOpen, course?.id]);

  if (!isOpen || !course) return null;

  if (!quiz) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '480px' }}>
          <h3 style={{ color: '#ffffff' }}>Assessment Unavailable</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            The quiz for {course.title} is currently being prepared. Check back soon!
          </p>
          <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: '16px' }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (qIdx, optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    setQuizState('submitting');
    setSubmissionError(null);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    try {
      const apiRes = await submitQuizResult(course.id, {
        score,
        totalQuestions,
        passed,
      });

      const resData = {
        score,
        correctCount,
        totalQuestions,
        passed,
        certificateId: apiRes?.certificateId || `APT-2026-${course.id.toUpperCase().slice(0, 5)}-${Math.floor(10000 + Math.random() * 90000)}`,
        certificateIssuedAt: apiRes?.certificateIssuedAt || new Date().toISOString(),
        badge: quiz.badge,
        certificate: quiz.certificate,
        courseTitle: course.title,
      };

      setResultsData(resData);
      setQuizState('results');

      if (onQuizCompleted) {
        onQuizCompleted({
          courseId: course.id,
          ...resData,
        });
      }
    } catch (err) {
      setSubmissionError('Failed to record quiz results. Please try again.');
      setQuizState('active');
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setResultsData(null);
    setQuizState('active');
  };

  const handleOpenCertificate = () => {
    if (onViewCertificate && resultsData) {
      onViewCertificate({
        courseTitle: course.title,
        certificateId: resultsData.certificateId,
        issuedAt: new Date(resultsData.certificateIssuedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        skills: quiz.certificate.skills || [],
        courseCode: quiz.certificate.courseCode,
        badgeIcon: quiz.badge.icon,
        badgeTitle: quiz.badge.title,
        score: resultsData.score,
      });
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="quiz-modal-container glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          width: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, #0e121a 0%, #080a0f 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 160, 23, 0.15)',
          padding: '32px',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Quiz"
          style={{ position: 'absolute', top: '20px', right: '20px' }}
        >
          ✕
        </button>

        {/* 1. INTRO SCREEN */}
        {quizState === 'intro' && (
          <div style={{ textAlign: 'center', padding: '12px 8px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(212, 160, 23, 0.15)',
              border: '2px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 20px auto',
              boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)'
            }}>
              {quiz.badge.icon}
            </div>

            <span className="badge-free" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', marginBottom: '8px' }}>
              Accredited Assessment
            </span>

            <h2 style={{ fontSize: '1.65rem', color: '#ffffff', margin: '10px 0' }}>
              {quiz.title}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              Test your knowledge of {course.title}. Achieve a passing score of{' '}
              <strong style={{ color: 'var(--gold-light)' }}>{quiz.passingScore}%</strong> to earn your permanent verified certificate and digital badge!
            </p>

            {/* Assessment Specs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '28px',
              textAlign: 'left'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>QUESTIONS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  {totalQuestions} MCQs
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PASSING MARK</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {quiz.passingScore}% (4/5)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CREDENTIAL</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6ee7b7' }}>
                  Verified Seal
                </div>
              </div>
            </div>

            {/* Rewards Preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 18px',
              background: 'rgba(212, 160, 23, 0.08)',
              border: '1px solid rgba(212, 160, 23, 0.3)',
              borderRadius: '12px',
              marginBottom: '28px',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '2rem' }}>🏆</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  Unlock "{quiz.badge.title}" &amp; Official Certificate
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {quiz.badge.description}
                </div>
              </div>
            </div>

            <button
              className="btn btn-gold btn-block"
              style={{ fontSize: '1rem', padding: '14px' }}
              onClick={() => setQuizState('active')}
              id="start-assessment-btn"
            >
              Start Assessment Now ➔
            </button>
          </div>
        )}

        {/* 2. ACTIVE QUIZ RUNNER */}
        {quizState === 'active' && currentQuestion && (
          <div>
            {/* Header / Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Question {currentQuestionIdx + 1} of {totalQuestions}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {answeredCount} of {totalQuestions} Answered
                </span>
              </div>

              {/* Progress bar */}
              <div className="progress-track" style={{ height: '6px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%`,
                    transition: 'width 0.3s ease',
                  }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.18rem',
                color: '#ffffff',
                lineHeight: 1.5,
                fontWeight: 600,
              }}>
                {currentQuestion.question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // 'A', 'B', 'C', 'D'

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: isSelected
                        ? '1.5px solid var(--gold-primary)'
                        : '1px solid var(--border-medium)',
                      background: isSelected
                        ? 'rgba(212, 160, 23, 0.12)'
                        : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      background: isSelected ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#000000' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}>
                      {letter}
                    </div>
                    <span style={{ fontSize: '0.92rem', lineHeight: 1.4 }}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {submissionError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>
                {submissionError}
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIdx === 0}
                style={{ opacity: currentQuestionIdx === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>

              {currentQuestionIdx < totalQuestions - 1 ? (
                <button
                  type="button"
                  className="btn btn-gold btn-sm"
                  onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                  disabled={userAnswers[currentQuestionIdx] === undefined}
                  style={{ opacity: userAnswers[currentQuestionIdx] === undefined ? 0.5 : 1 }}
                  id="next-question-btn"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-gold btn-sm"
                  onClick={handleSubmitQuiz}
                  disabled={userAnswers[currentQuestionIdx] === undefined}
                  style={{ opacity: userAnswers[currentQuestionIdx] === undefined ? 0.5 : 1 }}
                  id="submit-quiz-btn"
                >
                  ✓ Submit Assessment
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. SUBMITTING STATE */}
        {quizState === 'submitting' && (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>
              ⏳
            </div>
            <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>Evaluating Assessment...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Computing score and generating cryptographic verification credentials.
            </p>
          </div>
        )}

        {/* 4. RESULTS SCREEN */}
        {quizState === 'results' && resultsData && (
          <div style={{ textAlign: 'center', padding: '12px 6px' }}>
            {resultsData.passed ? (
              <>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '3px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)'
                }}>
                  🎉
                </div>

                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#6ee7b7',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Assessment Passed
                </span>

                <h2 style={{ fontSize: '1.75rem', color: '#ffffff', margin: '12px 0 6px 0' }}>
                  Congratulations, {user?.name || 'Student'}!
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                  You scored <strong style={{ color: 'var(--gold-light)' }}>{resultsData.score}%</strong> ({resultsData.correctCount}/{resultsData.totalQuestions} correct), exceeding the {quiz.passingScore}% passing threshold!
                </p>

                {/* Unlocked Badge Card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 22px',
                  background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.15) 0%, rgba(10, 12, 17, 0.8) 100%)',
                  border: '1.5px solid var(--gold-primary)',
                  borderRadius: '14px',
                  marginBottom: '20px',
                  textAlign: 'left',
                  boxShadow: '0 0 25px rgba(212, 160, 23, 0.2)'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(212, 160, 23, 0.2)',
                    border: '2px solid var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    flexShrink: 0
                  }}>
                    {resultsData.badge.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--gold-light)', fontSize: '1.05rem' }}>
                        Badge Unlocked: {resultsData.badge.title}
                      </span>
                      <span className="badge-pro" style={{ fontSize: '0.65rem' }}>
                        ★ Verified
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {resultsData.badge.description}
                    </div>
                  </div>
                </div>

                {/* Certificate Action */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  marginBottom: '28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                      Official Certificate of Completion
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Credential ID: {resultsData.certificateId}
                    </div>
                  </div>
                  <button
                    className="btn btn-gold btn-sm"
                    onClick={handleOpenCertificate}
                    id="view-earned-cert-btn"
                  >
                    🎓 View Certificate ➔
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={onClose}
                  >
                    Back to Platform
                  </button>
                  <button
                    className="btn btn-gold btn-block"
                    onClick={handleOpenCertificate}
                  >
                    View Official Certificate
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 16px auto'
                }}>
                  📝
                </div>

                <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: '10px 0' }}>
                  Almost There!
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                  You scored <strong style={{ color: '#ef4444' }}>{resultsData.score}%</strong> ({resultsData.correctCount}/{resultsData.totalQuestions} correct). A score of <strong style={{ color: 'var(--gold-light)' }}>{quiz.passingScore}%</strong> is required to earn this certificate.
                </p>

                {/* Question Review Accordion */}
                <div style={{
                  textAlign: 'left',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                    Assessment Breakdown:
                  </div>

                  {questions.map((q, idx) => {
                    const isCorrect = userAnswers[idx] === q.correctIndex;
                    return (
                      <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isCorrect ? '#6ee7b7' : '#f87171' }}>
                          <span>{isCorrect ? '✓' : '✕'}</span>
                          <strong style={{ color: '#ffffff' }}>Q{idx + 1}: {q.question}</strong>
                        </div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '4px', paddingLeft: '18px' }}>
                          Correct: <span style={{ color: 'var(--gold-light)' }}>{q.options[q.correctIndex]}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px', paddingLeft: '18px' }}>
                          💡 {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary btn-block" onClick={onClose}>
                    Review Course Notes
                  </button>
                  <button className="btn btn-gold btn-block" onClick={handleRetake} id="retake-quiz-btn">
                    🔄 Retake Assessment
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
