import React, { useState, useEffect, useRef, useMemo } from 'react';
import TechIcon from './TechIcon';
import { getCourseNotesTopic } from '../data/notesContent';
import {
  fetchCourseProgress,
  toggleTopicCompleted,
  toggleTopicBookmark,
  setLastReadTopic,
  verifyCourseAccess,
} from '../services/api';

export default function CourseNotesReader({
  course,
  user,
  onBack,
  onOpenPricing,
  onOpenPaywall,
  initialModIndex = 0,
  initialTopicIndex = 0,
}) {
  const [activeModIndex, setActiveModIndex] = useState(initialModIndex);
  const [activeTopicIndex, setActiveTopicIndex] = useState(initialTopicIndex);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'code' | 'quiz' | 'personal-notes'
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [expandedModules, setExpandedModules] = useState({ [initialModIndex]: true });
  
  // Progress & Bookmarks (Backend MongoDB backed + localStorage fallback)
  const [completedTopics, setCompletedTopics] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [percentComplete, setPercentComplete] = useState(0);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [backendAccess, setBackendAccess] = useState({
    checked: false,
    accessible: !course?.isPro,
    reason: course?.isPro ? 'checking' : 'free_course',
  });

  // Student personal notes per topic
  const [studentNotes, setStudentNotes] = useState('');
  const [notesSaveStatus, setNotesSaveStatus] = useState('Saved');

  // Code editor state for topic sandbox
  const [userCode, setUserCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const isPro = user?.subscription?.status === 'pro';

  // Calculate total topic count across course
  const totalTopicsCount = useMemo(() => {
    if (!course?.modules) return 1;
    return course.modules.reduce((acc, m) => acc + (m.lessons?.length || m.lessonsCount || 4), 0);
  }, [course]);

  // Current active topic key (e.g. "m0_t0")
  const currentTopicKey = `m${activeModIndex}_t${activeTopicIndex}`;

  // Get active topic notes
  const topicData = useMemo(() => {
    return getCourseNotesTopic(course, activeModIndex, activeTopicIndex);
  }, [course, activeModIndex, activeTopicIndex]);

  // 1. Verify Pro Entitlement via Backend
  useEffect(() => {
    let isMounted = true;
    async function checkAccess() {
      if (!course) return;
      const res = await verifyCourseAccess(course.id);
      if (isMounted) {
        setBackendAccess({
          checked: true,
          accessible: res.accessible,
          reason: res.reason,
        });
      }
    }
    checkAccess();
    return () => { isMounted = false; };
  }, [course, user]);

  // Check if current module/topic is locked
  const isCurrentModuleLocked = useMemo(() => {
    if (!course?.isPro) return false; // Free course
    const mod = course.modules?.[activeModIndex];
    if (mod?.isFree) return false; // Free introductory module
    return !backendAccess.accessible;
  }, [course, activeModIndex, backendAccess.accessible]);

  // 2. Fetch User Reading Progress & Bookmarks from Database
  useEffect(() => {
    let isMounted = true;
    async function loadProgress() {
      if (!course?.id) return;
      const res = await fetchCourseProgress(course.id);
      if (isMounted && res.ok && res.progress) {
        setCompletedTopics(res.progress.completedTopics || []);
        setBookmarks(res.progress.bookmarks || []);
        setPercentComplete(res.progress.percentComplete || 0);

        // Resume reading from last saved topic if starting at default (0, 0)
        if (initialModIndex === 0 && initialTopicIndex === 0 && res.progress.lastReadTopic) {
          const match = res.progress.lastReadTopic.match(/^m(\d+)_t(\d+)$/);
          if (match) {
            const mIdx = parseInt(match[1], 10);
            const tIdx = parseInt(match[2], 10);
            if (course.modules?.[mIdx]) {
              setActiveModIndex(mIdx);
              setActiveTopicIndex(tIdx);
              setExpandedModules(prev => ({ ...prev, [mIdx]: true }));
            }
          }
        }
      }
    }
    loadProgress();
    return () => { isMounted = false; };
  }, [course?.id]);

  // 3. Save Last Read Topic when active topic changes
  useEffect(() => {
    if (course?.id) {
      setLastReadTopic(course.id, currentTopicKey);
    }
  }, [course?.id, currentTopicKey]);

  // 4. Load & Synchronize Code, Quiz, and Personal Notes when topic changes
  useEffect(() => {
    if (topicData) {
      // Set starter code from topic or default snippet (prefer executable JS/JSX)
      const starter = topicData.syntaxAndCode?.find(s => s.language !== 'bash')?.code || topicData.syntaxAndCode?.[0]?.code || topicData.codeSnippet || '';
      setUserCode(starter);
      setConsoleOutput(null);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);

      // Load personal notes from localStorage
      const storageKey = `aptivella_student_notes_${course?.id}_${currentTopicKey}`;
      try {
        const saved = localStorage.getItem(storageKey);
        setStudentNotes(saved || '');
        setNotesSaveStatus('Saved');
      } catch {
        setStudentNotes('');
      }
    }
  }, [course?.id, currentTopicKey, topicData]);

  // Toggle Completion
  const handleToggleComplete = async () => {
    setIsSavingProgress(true);
    const res = await toggleTopicCompleted(course.id, currentTopicKey, totalTopicsCount);
    if (res.ok) {
      setCompletedTopics(res.completedTopics || []);
      setPercentComplete(res.percentComplete || 0);
    }
    setIsSavingProgress(false);
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    const res = await toggleTopicBookmark(course.id, currentTopicKey);
    if (res.ok) {
      setBookmarks(res.bookmarks || []);
    }
  };

  // Navigate to specific topic with paywall protection check
  const handleSelectTopic = (mIdx, tIdx) => {
    const targetMod = course.modules?.[mIdx];
    const isTargetLocked = course.isPro && !targetMod?.isFree && !backendAccess.accessible;

    if (isTargetLocked) {
      if (onOpenPaywall) onOpenPaywall(course);
      else if (onOpenPricing) onOpenPricing();
      return;
    }

    setActiveModIndex(mIdx);
    setActiveTopicIndex(tIdx);
    setExpandedModules(prev => ({ ...prev, [mIdx]: true }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Previous Topic
  const handlePrevTopic = () => {
    if (activeTopicIndex > 0) {
      handleSelectTopic(activeModIndex, activeTopicIndex - 1);
    } else if (activeModIndex > 0) {
      const prevMod = course.modules[activeModIndex - 1];
      const prevTopicsCount = prevMod.lessons?.length || prevMod.lessonsCount || 4;
      handleSelectTopic(activeModIndex - 1, prevTopicsCount - 1);
    }
  };

  // Next Topic
  const handleNextTopic = () => {
    const currentMod = course.modules[activeModIndex];
    const currentModTopicsCount = currentMod.lessons?.length || currentMod.lessonsCount || 4;

    if (activeTopicIndex < currentModTopicsCount - 1) {
      handleSelectTopic(activeModIndex, activeTopicIndex + 1);
    } else if (activeModIndex < course.modules.length - 1) {
      handleSelectTopic(activeModIndex + 1, 0);
    }
  };

  // Personal Notes auto-save
  const handleNotesChange = (e) => {
    const val = e.target.value;
    setStudentNotes(val);
    setNotesSaveStatus('Saving...');
    try {
      const storageKey = `aptivella_student_notes_${course?.id}_${currentTopicKey}`;
      localStorage.setItem(storageKey, val);
      setNotesSaveStatus(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch {
      setNotesSaveStatus('Saved locally');
    }
  };

  // Transform simple JSX into React.createElement
  const transformSimpleJSX = (code) => {
    let transformed = code;
    // Replace self-closing tags like <img ... /> or <hr />
    transformed = transformed.replace(/<([A-Za-z0-9_]+)\s*([^>]*)\/>/g, (match, tag) => {
      return `React.createElement("${tag}", null)`;
    });
    // Replace paired tags up to 6 passes for nested JSX
    for (let pass = 0; pass < 6; pass++) {
      const next = transformed.replace(/<([A-Za-z0-9_]+)\s*([^>]*)>([^<]*)<\/\1>/g, (match, tag, rawAttrs, children) => {
        const cleanChildren = JSON.stringify(children.trim());
        return `React.createElement("${tag}", null, ${cleanChildren})`;
      });
      if (next === transformed) break;
      transformed = next;
    }
    return transformed;
  };

  // Run Code in Playground (Supports Terminal CLI, React JSX, ES Modules, and Vanilla JS)
  const handleRunCode = () => {
    setIsRunningCode(true);
    setConsoleOutput({ status: 'running', logs: ['Executing isolated sandbox runtime...'] });

    setTimeout(() => {
      try {
        const logs = [];
        const terminalLogs = [];
        const lines = userCode.split('\n');
        const jsLines = [];
        let hasShellCommands = false;

        for (let i = 0; i < lines.length; i++) {
          const rawLine = lines[i];
          const trimmed = rawLine.trim();

          // 1. Shell Comments: # comment
          if (trimmed.startsWith('#')) {
            hasShellCommands = true;
            terminalLogs.push(trimmed);
            jsLines.push('// ' + rawLine);
            continue;
          }

          // 2. Shell / CLI Commands
          const isShellCmd = /^(npm|npx|yarn|pnpm|cd|mkdir|git|node|docker|pip|python|cargo)\b/i.test(trimmed);
          if (isShellCmd) {
            hasShellCommands = true;
            terminalLogs.push('$ ' + trimmed);
            if (trimmed.includes('run dev') || trimmed.includes('vite') || trimmed.includes('start')) {
              terminalLogs.push('> vite@5.4.0 dev');
              terminalLogs.push('➜  Local:   http://localhost:5173/');
              terminalLogs.push('➜  Network: use --host to expose');
              terminalLogs.push('✓  ready in 118ms');
            } else if (trimmed.includes('install') || trimmed.includes('add')) {
              terminalLogs.push('✔ added 42 packages in 1.1s');
            } else if (trimmed.includes('create') || trimmed.includes('init')) {
              terminalLogs.push('✔ Scaffolding project in ./my-aptivella-app...');
              terminalLogs.push('✔ Done.');
            } else if (trimmed.startsWith('cd ')) {
              terminalLogs.push('Changed directory to ' + trimmed.slice(3));
            } else {
              terminalLogs.push('✓ Command executed successfully.');
            }
            jsLines.push('// [Shell]: ' + rawLine);
            continue;
          }

          // 3. Handle ES Module Imports
          if (/^\s*import\s+/i.test(trimmed)) {
            jsLines.push('// ' + rawLine);
            continue;
          }

          // 4. Handle ES Module Exports
          if (/^\s*export\s+default\s+/i.test(trimmed)) {
            const expr = trimmed.replace(/^\s*export\s+default\s+/, '').replace(/;?\s*$/, '');
            jsLines.push('var __default_export = ' + expr + ';');
            continue;
          }

          if (/^\s*export\s+/i.test(trimmed)) {
            jsLines.push(rawLine.replace(/^\s*export\s+/, ''));
            continue;
          }

          jsLines.push(rawLine);
        }

        let codeToRun = jsLines.join('\n');
        try {
          codeToRun = transformSimpleJSX(codeToRun);
        } catch {
          // Keep as is
        }

        const customConsole = {
          log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
          error: (...args) => logs.push(`[ERROR] ${args.join(' ')}`),
          warn: (...args) => logs.push(`[WARN] ${args.join(' ')}`),
          info: (...args) => logs.push(`[INFO] ${args.join(' ')}`),
        };

        // Safe DOM mock so imperative DOM queries never throw null errors
        const createMockElement = (id = 'element') => ({
          id,
          textContent: '',
          innerHTML: '',
          value: '',
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
            toggle: () => {},
            contains: () => false,
          },
          addEventListener: (evt) => {
            logs.push(`[Event Attached]: Listener registered for event "${evt}" on #${id}`);
          },
          removeEventListener: () => {},
          click: function() {
            logs.push(`[Event Triggered]: Clicked #${id}`);
          },
          appendChild: () => {},
          removeChild: () => {},
          setAttribute: () => {},
          getAttribute: () => null,
        });

        const customDocument = {
          getElementById: (id) => createMockElement(id),
          querySelector: (sel) => createMockElement(sel.replace(/[^a-zA-Z0-9_-]/g, '') || 'elem'),
          querySelectorAll: () => [createMockElement('elem_1')],
          createElement: (tag) => createMockElement(tag),
          body: createMockElement('body'),
          title: 'APTIVELLA Sandbox',
          addEventListener: (evt) => {
            logs.push(`[Document Event]: Listener registered for "${evt}"`);
          },
          removeEventListener: () => {},
        };

        const mockUseState = (initialVal) => {
          let val = typeof initialVal === 'function' ? initialVal() : initialVal;
          const setter = (next) => {
            val = typeof next === 'function' ? next(val) : next;
          };
          return [val, setter];
        };

        const mockUseEffect = (cb) => {
          try {
            const cleanup = cb();
            if (typeof cleanup === 'function') {}
          } catch(e) {}
        };

        const mockUseMemo = (cb) => {
          try { return cb(); } catch (e) { return null; }
        };

        const mockUseCallback = (cb) => cb;
        const mockUseRef = (initial) => ({ current: initial });
        const mockUseContext = () => ({});
        const mockUseReducer = (reducer, initial) => [initial, () => {}];

        const customWindow = {
          document: customDocument,
          addEventListener: () => {},
          removeEventListener: () => {},
          alert: (msg) => logs.push(`[Alert]: ${msg}`),
          prompt: () => '',
          confirm: () => true,
          setTimeout: (fn) => { try { fn(); } catch(e) {} return 1; },
          clearTimeout: () => {},
          location: { href: 'http://localhost:5173/' },
          localStorage: {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          },
        };

        const sandboxReact = {
          ...React,
          useState: mockUseState,
          useEffect: mockUseEffect,
          useMemo: mockUseMemo,
          useCallback: mockUseCallback,
          useRef: mockUseRef,
          useContext: mockUseContext,
          useReducer: mockUseReducer,
        };

        const nonCommentCode = codeToRun
          .split('\n')
          .filter(l => !l.trim().startsWith('//') && l.trim().length > 0)
          .join('\n')
          .trim();

        if (nonCommentCode.length > 0) {
          const wrapped = `
            ${codeToRun}

            // Automatically find and evaluate any component defined in the sandbox
            var __foundComp = typeof __default_export === 'function' ? __default_export
              : typeof ModernCounter === 'function' ? ModernCounter
              : typeof Hello === 'function' ? Hello
              : typeof App === 'function' ? App
              : typeof Counter === 'function' ? Counter
              : null;

            if (__foundComp) {
              try {
                var __res = __foundComp({});
                if (__res && typeof __res === 'object' && __res.type) {
                  var __childStr = '';
                  if (__res.props && __res.props.children) {
                    if (typeof __res.props.children === 'string') __childStr = __res.props.children;
                    else if (Array.isArray(__res.props.children)) {
                      __childStr = __res.props.children.map(function(c) {
                        return (c && typeof c === 'object' && c.type) ? '<' + c.type + '/>' : String(c || '');
                      }).join(' ');
                    }
                  }
                  console.log('✓ Rendered React Component <' + (__foundComp.name || 'Component') + ' />: <' + __res.type + '>' + __childStr + '</' + __res.type + '>');
                } else if (__res !== undefined) {
                  console.log('Component Return value:', String(__res));
                }
              } catch(e) {
                console.log('Component initialized:', __foundComp.name || 'Anonymous');
              }
            } else if (typeof __default_export !== 'undefined') {
              console.log('Exported value:', JSON.stringify(__default_export, null, 2));
            }
          `;

          try {
            const runner = new Function(
              'console',
              'React',
              'document',
              'window',
              'useState',
              'useEffect',
              'useMemo',
              'useCallback',
              'useRef',
              'useContext',
              'useReducer',
              wrapped
            );
            runner(
              customConsole,
              sandboxReact,
              customDocument,
              customWindow,
              mockUseState,
              mockUseEffect,
              mockUseMemo,
              mockUseCallback,
              mockUseRef,
              mockUseContext,
              mockUseReducer
            );
          } catch (err) {
            if (hasShellCommands && terminalLogs.length > 0 && logs.length === 0) {
              setConsoleOutput({
                status: 'success',
                logs: terminalLogs,
                timestamp: new Date().toLocaleTimeString(),
              });
              setIsRunningCode(false);
              return;
            }
            throw err;
          }
        }

        const allLogs = [];
        if (terminalLogs.length > 0) {
          allLogs.push(...terminalLogs);
        }
        if (logs.length > 0) {
          if (terminalLogs.length > 0) allLogs.push('----------------------------------------');
          allLogs.push(...logs);
        }

        if (allLogs.length === 0) {
          allLogs.push('Execution completed successfully. (Return void, no console.log output)');
        }

        setConsoleOutput({
          status: 'success',
          logs: allLogs,
          timestamp: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        setConsoleOutput({
          status: 'error',
          logs: [`Runtime Error: ${err.message}`],
          timestamp: new Date().toLocaleTimeString(),
        });
      } finally {
        setIsRunningCode(false);
      }
    }, 280);
  };

  // Download Notes (.md file)
  const handleDownloadNotes = () => {
    if (!topicData) return;
    const content = `# ${course.title}
## Module ${activeModIndex + 1}: ${course.modules[activeModIndex]?.title}
### Topic: ${topicData.title}
Duration: ${topicData.readTime || topicData.duration} | Last Updated: ${topicData.lastUpdated || '2026'}

---

## 🎯 Learning Objectives
${topicData.learningObjectives?.map(obj => `- ${obj}`).join('\n') || 'N/A'}

## 📖 Overview & Deep Dive
${topicData.overviewExplanation || 'N/A'}

## 💻 Code Reference
${topicData.syntaxAndCode?.map(sc => `### ${sc.title}\n\`\`\`${sc.language || 'jsx'}\n${sc.code}\n\`\`\`\n${sc.explanation || ''}\n`).join('\n') || ''}

## ⚡ Best Practices
${topicData.bestPractices?.map(bp => `- ${bp}`).join('\n') || 'N/A'}

## 🚨 Common Mistakes
${topicData.commonMistakes?.map(cm => `### ❌ Mistake: ${cm.mistake}\n**Why**: ${cm.why}\n**Fix**: ${cm.fix}\n`).join('\n') || 'N/A'}

## 💡 Quick Revision Summary
${topicData.quickRevisionSummary?.map(qs => `- ${qs}`).join('\n') || 'N/A'}

---
Generated by APTIVELLA Learning Platform — Premium Skill Development
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.id}_module${activeModIndex + 1}_topic${activeTopicIndex + 1}_notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print Notes (Invokes browser print with clean print CSS)
  const handlePrintNotes = () => {
    window.print();
  };

  // Copy code snippet to clipboard
  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopyFeedback(index);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const isCompleted = completedTopics.includes(currentTopicKey);
  const isBookmarked = bookmarks.includes(currentTopicKey);

  return (
    <div className="notes-reader-container" id="notes-reader-root">
      {/* Top Reader Navigation Bar */}
      <header className="notes-reader-topbar no-print">
        <div className="reader-topbar-left">
          <button
            className="reader-back-btn"
            onClick={onBack}
            id="reader-back-to-course-btn"
            title="Back to Course Details"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Syllabus</span>
          </button>

          <div className="reader-breadcrumbs">
            <span className="breadcrumb-course">{course.title}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-module">Mod {activeModIndex + 1}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-topic">{topicData?.title}</span>
          </div>
        </div>

        <div className="reader-topbar-right">
          {/* Reading Progress Indicator */}
          <div className="reader-progress-stat" title={`${completedTopics.length} of ${totalTopicsCount} topics mastered`}>
            <div className="progress-stat-header">
              <span className="progress-stat-label">Progress</span>
              <span className="progress-stat-val">{percentComplete}%</span>
            </div>
            <div className="reader-progress-track">
              <div
                className="reader-progress-fill"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            className={`reader-tool-btn ${isBookmarked ? 'active-bookmark' : ''}`}
            onClick={handleToggleBookmark}
            id="reader-bookmark-btn"
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Topic'}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill={isBookmarked ? '#d4af37' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {/* Download Notes */}
          <button
            className="reader-tool-btn"
            onClick={handleDownloadNotes}
            id="reader-download-btn"
            title="Download Notes (.md)"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Notes</span>
          </button>

          {/* Print Friendly */}
          <button
            className="reader-tool-btn"
            onClick={handlePrintNotes}
            id="reader-print-btn"
            title="Print-friendly study sheet"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Grid (Sidebar + Notes Reading Stage) */}
      <div className="notes-reader-workspace">
        {/* Left Sidebar: Modules & Topics Navigator */}
        <aside className="notes-sidebar no-print" id="notes-sidebar-nav">
          <div className="sidebar-header-box">
            <div className="sidebar-course-title-row">
              <TechIcon tech={course.tech} size={22} />
              <h3 className="sidebar-course-title">{course.title}</h3>
            </div>
            <p className="sidebar-course-sub">{course.level} • {course.modulesCount || course.modules?.length} Modules</p>

            {/* Topic Search Input */}
            <div className="sidebar-search-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search topics, hooks, syntax..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="sidebar-search-input"
                id="notes-topic-search-input"
              />
              {sidebarSearch && (
                <button
                  className="sidebar-search-clear"
                  onClick={() => setSidebarSearch('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Module List Accordion */}
          <div className="sidebar-modules-scroll">
            {course.modules?.map((mod, mIdx) => {
              const isModOpen = expandedModules[mIdx] ?? (mIdx === activeModIndex);
              const isModLocked = course.isPro && !mod.isFree && !backendAccess.accessible;
              const lessons = mod.lessons || [
                { title: `${mod.title} — Study Guide`, duration: '15 min read' }
              ];

              // Filter lessons based on search query
              const filteredLessons = lessons.filter(l => 
                !sidebarSearch || l.title?.toLowerCase().includes(sidebarSearch.toLowerCase())
              );

              if (sidebarSearch && filteredLessons.length === 0) return null;

              return (
                <div key={mod.id || mIdx} className="sidebar-module-group">
                  <button
                    className={`sidebar-module-header ${mIdx === activeModIndex ? 'active-mod' : ''}`}
                    onClick={() => setExpandedModules(prev => ({ ...prev, [mIdx]: !isModOpen }))}
                  >
                    <div className="module-header-text">
                      <span className="mod-number-badge">M{mIdx + 1}</span>
                      <span className="mod-title-text">{mod.title}</span>
                    </div>

                    <div className="module-header-status">
                      {isModLocked && <span className="mod-lock-crown" title="Pro Locked">👑</span>}
                      <span className="mod-chevron">{isModOpen ? '▾' : '▸'}</span>
                    </div>
                  </button>

                  {/* Topics in Module */}
                  {isModOpen && (
                    <div className="sidebar-topics-list">
                      {filteredLessons.map((lesson, tIdx) => {
                        const topicKey = `m${mIdx}_t${tIdx}`;
                        const isSelected = mIdx === activeModIndex && tIdx === activeTopicIndex;
                        const isTopCompleted = completedTopics.includes(topicKey);
                        const isTopBookmarked = bookmarks.includes(topicKey);

                        return (
                          <button
                            key={tIdx}
                            className={`sidebar-topic-row ${isSelected ? 'selected-topic' : ''} ${isTopCompleted ? 'completed-topic' : ''}`}
                            onClick={() => handleSelectTopic(mIdx, tIdx)}
                            id={`topic-row-${topicKey}`}
                          >
                            <span className="topic-status-icon">
                              {isTopCompleted ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : isModLocked ? (
                                <span style={{ fontSize: '0.75rem' }}>🔒</span>
                              ) : (
                                <span className="topic-dot" />
                              )}
                            </span>

                            <span className="topic-name-label">{lesson.title}</span>

                            <div className="topic-pills-row">
                              {isTopBookmarked && <span className="topic-bookmark-dot" title="Bookmarked">★</span>}
                              <span className="topic-time-label">
                                {lesson.duration?.includes('read') ? lesson.duration : `${lesson.duration?.split(':')[0] || '15'}m`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Stage: Notes Content, Table of Contents & Tools */}
        <main className="notes-content-stage" id="notes-content-area">
          {/* Topic Header Bar */}
          <div className="topic-headline-banner">
            <div className="topic-meta-row">
              <span className="badge-level">Module {activeModIndex + 1} • Chapter {activeTopicIndex + 1}</span>
              <span className="topic-read-badge">⏱ {topicData?.readTime || topicData?.duration}</span>
              <span className="topic-edition-badge">⚡ Curated 2026 Edition</span>
              {isCompleted && <span className="topic-completed-pill">✓ Mastered</span>}
            </div>

            <h1 className="topic-headline-title">{topicData?.title}</h1>
            <p className="topic-headline-sub">
              {course.title} Masterclass — Architectural notes, code blueprints, and debugging guidelines.
            </p>

            {/* Action Bar: Mark Complete, Switch Tabs */}
            <div className="topic-control-actions no-print">
              <div className="reader-tabs-pillbox">
                <button
                  className={`reader-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notes')}
                >
                  📖 Study Notes & Guide
                </button>
                <button
                  className={`reader-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                  onClick={() => setActiveTab('code')}
                >
                  💻 Code Playground
                </button>
                <button
                  className={`reader-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quiz')}
                >
                  🎯 Quiz & Challenge
                </button>
                <button
                  className={`reader-tab-btn ${activeTab === 'personal-notes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal-notes')}
                >
                  📝 My Notes
                </button>
              </div>

              <button
                className={`btn ${isCompleted ? 'btn-glass' : 'btn-gold'} btn-sm complete-toggle-btn`}
                onClick={handleToggleComplete}
                disabled={isSavingProgress}
                id="toggle-topic-complete-btn"
              >
                {isCompleted ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Locked Paywall Guard State */}
          {isCurrentModuleLocked ? (
            <div className="notes-locked-paywall-banner">
              <div className="paywall-crown-icon">👑</div>
              <h2>Pro Study Guide Material</h2>
              <p>
                Module {activeModIndex + 1} ({course.modules[activeModIndex]?.title}) is part of the Aptivella Pro Curriculum.
                Unlock full access to comprehensive architecture notes, interactive sandbox runners, verified resume certificates, and direct mentor Q&A.
              </p>
              <div className="paywall-pricing-callout">
                Plans start at <strong>₹399/month</strong> or <strong>₹999/quarter</strong> (Save 17%).
              </div>
              <button
                className="btn btn-gold btn-lg paywall-cta-btn"
                onClick={() => (onOpenPaywall ? onOpenPaywall(course) : onOpenPricing())}
                id="unlock-notes-paywall-btn"
              >
                Unlock Pro Access from ₹399 ➔
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: STUDY NOTES & GUIDE */}
              {activeTab === 'notes' && (
                <div className="notes-reading-body">
                  {/* In-page Table of Contents Quick Nav */}
                  <div className="notes-toc-card no-print">
                    <div className="toc-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      <span>Table of Contents</span>
                    </div>
                    <div className="toc-links-row">
                      <a href="#sec-objectives" className="toc-link">Objectives</a>
                      <a href="#sec-overview" className="toc-link">Overview & Deep Dive</a>
                      {topicData?.syntaxAndCode && <a href="#sec-code" className="toc-link">Syntax & Code</a>}
                      {topicData?.diagram && <a href="#sec-diagram" className="toc-link">Architecture Diagram</a>}
                      {topicData?.comparisonTable && <a href="#sec-comparison" className="toc-link">Comparison Table</a>}
                      {topicData?.commonMistakes && <a href="#sec-mistakes" className="toc-link">Debugging & Pitfalls</a>}
                      {topicData?.bestPractices && <a href="#sec-bestpractices" className="toc-link">Best Practices</a>}
                      {topicData?.interviewQuestions && <a href="#sec-interview" className="toc-link">Interview Q&A</a>}
                      <a href="#sec-summary" className="toc-link">Quick Revision</a>
                    </div>
                  </div>

                  {/* Editorial Coming-Soon Notice for unauthored topics */}
                  {!topicData?.hasDetailedNotes && (
                    <div className="notes-editorial-status-banner">
                      <div className="editorial-icon">📋</div>
                      <div className="editorial-content">
                        <h4>Curated Study Notes in Editorial Review</h4>
                        <p>
                          The detailed textbook-level study notes for this topic are currently undergoing peer review by our senior engineers.
                          Below is the curated syllabus overview, learning objectives, architectural patterns, and interview reference questions.
                        </p>
                        <div className="editorial-pill">
                          💡 <em>Tip</em>: Explore <strong>React for Beginners</strong> to experience our fully authored pilot notes with deep diagrams, code walkthroughs, and practice challenges.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section 1: Learning Objectives */}
                  <section className="notes-section" id="sec-objectives">
                    <h2 className="section-title">
                      <span className="section-title-icon">🎯</span>
                      <span>Learning Objectives & Prerequisites</span>
                    </h2>
                    
                    {topicData?.prerequisites && topicData.prerequisites.length > 0 && (
                      <div className="prereq-box">
                        <strong className="prereq-label">Prerequisites:</strong>
                        <ul className="prereq-list">
                          {topicData.prerequisites.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="objectives-grid">
                      {topicData?.learningObjectives?.map((obj, idx) => (
                        <div key={idx} className="objective-card">
                          <span className="obj-number">0{idx + 1}</span>
                          <span className="obj-text">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section 2: Detailed Overview & Explanation */}
                  <section className="notes-section" id="sec-overview">
                    <h2 className="section-title">
                      <span className="section-title-icon">📖</span>
                      <span>In-depth Explanation & Core Concepts</span>
                    </h2>
                    <div className="notes-markdown-prose">
                      {topicData?.overviewExplanation?.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('###')) {
                          return <h3 key={idx} className="prose-subheading">{paragraph.replace(/^###\s*/, '')}</h3>;
                        }
                        if (paragraph.startsWith('####')) {
                          return <h4 key={idx} className="prose-subheading-4">{paragraph.replace(/^####\s*/, '')}</h4>;
                        }
                        if (paragraph.startsWith('>')) {
                          return (
                            <blockquote key={idx} className="prose-blockquote">
                              {paragraph.replace(/^>\s*/, '')}
                            </blockquote>
                          );
                        }
                        return <p key={idx} className="prose-paragraph">{paragraph}</p>;
                      })}
                    </div>
                  </section>

                  {/* Section 3: Syntax & Code Examples */}
                  {topicData?.syntaxAndCode && topicData.syntaxAndCode.length > 0 && (
                    <section className="notes-section" id="sec-code">
                      <h2 className="section-title">
                        <span className="section-title-icon">💻</span>
                        <span>Syntax & Code Implementation</span>
                      </h2>

                      {topicData.syntaxAndCode.map((block, idx) => (
                        <div key={idx} className="code-example-container">
                          <div className="code-example-header">
                            <div>
                              <h4 className="code-example-title">{block.title}</h4>
                              {block.explanation && (
                                <p className="code-example-sub">{block.explanation}</p>
                              )}
                            </div>
                            <button
                              className="btn btn-secondary btn-sm copy-code-btn"
                              onClick={() => handleCopyCode(block.code, idx)}
                            >
                              {copyFeedback === idx ? '✓ Copied' : 'Copy Code'}
                            </button>
                          </div>
                          <pre className="code-syntax-stage">
                            <code>{block.code}</code>
                          </pre>
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Section 4: Architecture Diagram & Workflows */}
                  {topicData?.diagram && (
                    <section className="notes-section" id="sec-diagram">
                      <h2 className="section-title">
                        <span className="section-title-icon">📊</span>
                        <span>Architecture Diagram & Execution Flow</span>
                      </h2>
                      <div className="diagram-container">
                        <h4 className="diagram-title">{topicData.diagram.title}</h4>
                        <pre className="diagram-ascii-stage">
                          {topicData.diagram.ascii}
                        </pre>
                      </div>
                    </section>
                  )}

                  {/* Section 5: Comparison Table */}
                  {topicData?.comparisonTable && (
                    <section className="notes-section" id="sec-comparison">
                      <h2 className="section-title">
                        <span className="section-title-icon">⚖️</span>
                        <span>Architectural Comparison & Trade-offs</span>
                      </h2>
                      <div className="table-responsive-wrapper">
                        <table className="notes-comparison-table">
                          <thead>
                            <tr>
                              {topicData.comparisonTable.headers.map((h, idx) => (
                                <th key={idx}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {topicData.comparisonTable.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className={cIdx === 0 ? 'table-highlight-cell' : ''}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {/* Section 6: Real-World Use Cases */}
                  {topicData?.practicalUseCases && topicData.practicalUseCases.length > 0 && (
                    <section className="notes-section" id="sec-usecases">
                      <h2 className="section-title">
                        <span className="section-title-icon">🌐</span>
                        <span>Real-World Production Scenarios</span>
                      </h2>
                      <div className="use-cases-grid">
                        {topicData.practicalUseCases.map((uc, idx) => (
                          <div key={idx} className="use-case-card">
                            <h4 className="use-case-title">{uc.title}</h4>
                            <p className="use-case-scenario">
                              <strong>Scenario: </strong>{uc.scenario}
                            </p>
                            <p className="use-case-solution">
                              <strong>Aptivella Architecture: </strong>{uc.solution}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Section 7: Common Mistakes & Debugging Pitfalls */}
                  {topicData?.commonMistakes && topicData.commonMistakes.length > 0 && (
                    <section className="notes-section" id="sec-mistakes">
                      <h2 className="section-title">
                        <span className="section-title-icon">🚨</span>
                        <span>Common Mistakes & Debugging Pitfalls</span>
                      </h2>
                      <div className="mistakes-stack">
                        {topicData.commonMistakes.map((cm, idx) => (
                          <div key={idx} className="mistake-item-card">
                            <div className="mistake-header">
                              <span className="mistake-cross">✕</span>
                              <strong className="mistake-title">{cm.mistake}</strong>
                            </div>
                            <div className="mistake-why">
                              <span className="mistake-label">Why it fails: </span>{cm.why}
                            </div>
                            <div className="mistake-fix">
                              <span className="fix-label">✓ The Fix: </span>{cm.fix}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Section 8: Best Practices & Security */}
                  {topicData?.bestPractices && topicData.bestPractices.length > 0 && (
                    <section className="notes-section" id="sec-bestpractices">
                      <h2 className="section-title">
                        <span className="section-title-icon">🛡️</span>
                        <span>Best Practices & Security Considerations</span>
                      </h2>
                      <ul className="best-practices-checklist">
                        {topicData.bestPractices.map((bp, idx) => (
                          <li key={idx} className="best-practice-row">
                            <svg className="check-icon-gold" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Section 9: Interview Questions & Answers */}
                  {topicData?.interviewQuestions && topicData.interviewQuestions.length > 0 && (
                    <section className="notes-section" id="sec-interview">
                      <h2 className="section-title">
                        <span className="section-title-icon">💼</span>
                        <span>Technical Interview Questions & Model Answers</span>
                      </h2>
                      <div className="interview-qa-stack">
                        {topicData.interviewQuestions.map((qa, idx) => (
                          <div key={idx} className="interview-card">
                            <h4 className="interview-q">Q: {qa.question}</h4>
                            <div className="interview-a">
                              <strong>Answer: </strong>{qa.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Section 10: Quick Revision Summary */}
                  {topicData?.quickRevisionSummary && topicData.quickRevisionSummary.length > 0 && (
                    <section className="notes-section" id="sec-summary">
                      <h2 className="section-title">
                        <span className="section-title-icon">⚡</span>
                        <span>Quick Revision Summary</span>
                      </h2>
                      <div className="revision-summary-box">
                        <ul className="revision-summary-list">
                          {topicData.quickRevisionSummary.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  )}

                  {/* Bottom Navigation Buttons */}
                  <div className="reader-bottom-nav-row no-print">
                    <button
                      className="btn btn-secondary btn-lg nav-prev-btn"
                      onClick={handlePrevTopic}
                      disabled={activeModIndex === 0 && activeTopicIndex === 0}
                      id="reader-prev-topic-btn"
                    >
                      ← Previous Topic
                    </button>

                    <button
                      className="btn btn-gold btn-lg nav-next-btn"
                      onClick={handleNextTopic}
                      id="reader-next-topic-btn"
                    >
                      <span>Next Topic ➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CODE PLAYGROUND & SANDBOX */}
              {activeTab === 'code' && (
                <div className="reader-code-playground-tab">
                  <div className="playground-header-bar">
                    <div>
                      <h3 className="playground-title">Interactive {course.tech} Code Playground</h3>
                      <p className="playground-sub">Experiment with live snippets directly in your browser session.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const starter = topicData?.syntaxAndCode?.find(s => s.language !== 'bash')?.code || topicData?.syntaxAndCode?.[0]?.code || topicData?.codeSnippet || '';
                          setUserCode(starter);
                          setConsoleOutput(null);
                        }}
                      >
                        Reset Starter Code
                      </button>
                      <button
                        className="btn btn-gold btn-sm"
                        onClick={handleRunCode}
                        disabled={isRunningCode}
                        id="run-code-playground-btn"
                      >
                        {isRunningCode ? 'Running...' : '▶ Run Code'}
                      </button>
                    </div>
                  </div>

                  <div className="code-editor-area">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="code-editor-textarea"
                      placeholder="// Write or edit your code here..."
                      spellCheck="false"
                      id="playground-code-textarea"
                    />
                  </div>

                  <div className="code-terminal-output">
                    <div className="terminal-header">
                      <span>Execution Console</span>
                      {consoleOutput?.timestamp && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          Executed at {consoleOutput.timestamp}
                        </span>
                      )}
                    </div>
                    <div className="terminal-body">
                      {consoleOutput ? (
                        consoleOutput.logs.map((log, idx) => (
                          <div
                            key={idx}
                            style={{
                              color: consoleOutput.status === 'error' ? '#ef4444' : '#10b981',
                              fontFamily: 'monospace',
                              fontSize: '0.88rem',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {log}
                          </div>
                        ))
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                          Click "Run Code" above to execute this script in an isolated JavaScript runtime.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QUIZ & PRACTICE CHALLENGE */}
              {activeTab === 'quiz' && (
                <div className="reader-quiz-tab">
                  <div className="glass-card quiz-card-box">
                    <h3 className="quiz-card-title">Comprehension Check: {topicData?.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                      Test your understanding of the core architectural patterns covered in this study guide.
                    </p>

                    {topicData?.quiz ? (
                      <div className="quiz-question-container">
                        <h4 className="quiz-q-text">{topicData.quiz.question}</h4>
                        <div className="quiz-options-list">
                          {topicData.quiz.options?.map((opt, oIdx) => {
                            const isSelected = selectedQuizAnswer === oIdx;
                            const isCorrect = oIdx === topicData.quiz.correctIndex;
                            let optClass = 'quiz-opt-btn';
                            if (quizSubmitted) {
                              if (isCorrect) optClass += ' opt-correct';
                              else if (isSelected) optClass += ' opt-wrong';
                            } else if (isSelected) {
                              optClass += ' opt-selected';
                            }

                            return (
                              <button
                                key={oIdx}
                                className={optClass}
                                onClick={() => !quizSubmitted && setSelectedQuizAnswer(oIdx)}
                                disabled={quizSubmitted}
                              >
                                <span className="opt-marker">{String.fromCharCode(65 + oIdx)}.</span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {!quizSubmitted ? (
                          <button
                            className="btn btn-gold btn-md submit-quiz-btn"
                            disabled={selectedQuizAnswer === null}
                            onClick={() => setQuizSubmitted(true)}
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <div className="quiz-explanation-box">
                            <strong style={{ color: selectedQuizAnswer === topicData.quiz.correctIndex ? '#10b981' : '#ef4444' }}>
                              {selectedQuizAnswer === topicData.quiz.correctIndex ? '✓ Correct Answer!' : '✕ Not quite right.'}
                            </strong>
                            <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                              {topicData.quiz.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)' }}>No quiz available for this topic yet.</p>
                    )}
                  </div>

                  {/* Practice Exercise Challenge */}
                  {topicData?.practiceExercise && (
                    <div className="glass-card exercise-card-box" style={{ marginTop: '24px' }}>
                      <h3 style={{ color: 'var(--gold-light)', marginBottom: '10px' }}>Hands-on Coding Challenge</h3>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        {topicData.practiceExercise.instructions}
                      </p>
                      <pre className="code-syntax-stage" style={{ marginBottom: '16px' }}>
                        <code>{topicData.practiceExercise.solutionCode || topicData.practiceExercise.starterCode}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MY PERSONAL NOTES */}
              {activeTab === 'personal-notes' && (
                <div className="reader-student-notes-tab">
                  <div className="student-notes-header">
                    <div>
                      <h3 style={{ color: '#fff', margin: 0 }}>My Personal Study Notes</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Private notes saved for {topicData?.title}. Auto-saved to your browser.
                      </p>
                    </div>
                    <span className="notes-status-badge">{notesSaveStatus}</span>
                  </div>

                  <textarea
                    value={studentNotes}
                    onChange={handleNotesChange}
                    className="student-notes-editor"
                    placeholder="Type your personal observations, questions, or revision bullet points here..."
                    id="student-personal-notes-textarea"
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
