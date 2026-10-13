/**
 * APTIVELLA - Mock Data Repository
 * Realistic sample course content, student statistics, and pricing plans.
 * Kept clearly separated from UI logic so it can seamlessly connect to MongoDB in future phases.
 */

export const COURSES_DATA = [
  {
    id: 'react-for-beginners',
    title: 'React for Beginners',
    category: 'Frontend',
    level: 'Beginner',
    tech: 'React',
    modulesCount: 8,
    duration: '12 hours',
    isPro: false,
    rating: 4.9,
    enrolledCount: '14,280',
    shortDescription: 'Learn the fundamentals of React and build your first interactive web app.',
    fullDescription: 'Build interactive web apps with React and learn modern frontend development from scratch. Master component architecture, state management, hooks, and single-page routing with practical real-world exercises.',
    instructor: 'Alex Vance, Senior Frontend Architect',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Understand React components and JSX syntax thoroughly',
      'Manage state and props effectively across component trees',
      'Use modern hooks (useState, useEffect, useContext, useMemo)',
      'Build a complete interactive web application from scratch',
      'Deploy your modern web app to production hosting platforms'
    ],
    courseIncludes: [
      '8 comprehensive modules',
      'Comprehensive module study notes & architecture guides',
      'Hands-on portfolio projects',
      'Certificate of completion',
      'Lifetime access with future updates'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Introduction to Modern React',
        lessonsCount: 4,
        duration: '1h 15m',
        isFree: true,
        lessons: [
          { title: 'Why React in 2026?', duration: '12:40' },
          { title: 'Setting up Vite & Modern Dev Environment', duration: '18:15' },
          { title: 'Understanding the Virtual DOM & JSX', duration: '22:10' },
          { title: 'First React Component Exercise', duration: '22:05' }
        ]
      },
      {
        id: 2,
        title: 'Module 2: Components, Props, and UI Composition',
        lessonsCount: 5,
        duration: '1h 45m',
        isFree: true,
        lessons: [
          { title: 'Functional Components Architecture', duration: '16:30' },
          { title: 'Passing and Destructuring Props', duration: '20:15' },
          { title: 'Children Props & Layout Containers', duration: '25:00' },
          { title: 'Conditional Rendering Patterns', duration: '21:10' },
          { title: 'Interactive Challenge: Card Component System', duration: '22:05' }
        ]
      },
      {
        id: 3,
        title: 'Module 3: State Management with useState',
        lessonsCount: 5,
        duration: '1h 50m',
        isFree: true,
        lessons: [
          { title: 'What is Reactive State?', duration: '15:20' },
          { title: 'Updating Primitive & Object State', duration: '24:10' },
          { title: 'Lifting State Up Between Siblings', duration: '28:40' },
          { title: 'Form Inputs and Controlled Components', duration: '22:15' },
          { title: 'Mini Project: Dynamic Filtering Table', duration: '19:35' }
        ]
      },
      {
        id: 4,
        title: 'Module 4: Side Effects & the useEffect Hook',
        lessonsCount: 4,
        duration: '1h 35m',
        isFree: true,
        lessons: [
          { title: 'The Lifecycle of a React Effect', duration: '18:10' },
          { title: 'Fetching Data from REST APIs cleanly', duration: '28:30' },
          { title: 'Cleanup Functions & Abort Controllers', duration: '24:20' },
          { title: 'Dependency Array Pitfalls & Best Practices', duration: '24:00' }
        ]
      },
      {
        id: 5,
        title: 'Module 5: Custom Hooks & Code Reusability',
        lessonsCount: 4,
        duration: '1h 40m',
        isFree: true,
        lessons: [
          { title: 'Extracting Logic into useFetch', duration: '25:00' },
          { title: 'useLocalStorage & Persistent State', duration: '26:10' },
          { title: 'useDebounce for Fast Search Inputs', duration: '22:40' },
          { title: 'Best Practices for Custom Hook APIs', duration: '26:10' }
        ]
      },
      {
        id: 6,
        title: 'Module 6: Global State with Context API',
        lessonsCount: 3,
        duration: '1h 20m',
        isFree: true,
        lessons: [
          { title: 'When Props Drilling Breaks Down', duration: '20:10' },
          { title: 'Building Auth & Theme Context Providers', duration: '35:20' },
          { title: 'Avoiding Unnecessary Re-renders with Context', duration: '24:30' }
        ]
      },
      {
        id: 7,
        title: 'Module 7: Single-Page Routing & Navigation',
        lessonsCount: 4,
        duration: '1h 25m',
        isFree: true,
        lessons: [
          { title: 'Client-Side Routing Concepts', duration: '16:40' },
          { title: 'Dynamic Route Params & Nested Routes', duration: '24:50' },
          { title: 'Protected Routes & Navigation Guards', duration: '22:10' },
          { title: 'Handling 404s & Fallbacks', duration: '21:20' }
        ]
      },
      {
        id: 8,
        title: 'Module 8: Capstone Project & Production Deployment',
        lessonsCount: 4,
        duration: '2h 10m',
        isFree: true,
        lessons: [
          { title: 'Assembling the TaskFlow Application', duration: '40:00' },
          { title: 'Code Splitting with React.lazy', duration: '25:30' },
          { title: 'Performance Audits with Lighthouse', duration: '28:10' },
          { title: 'Deploying to Vercel/Netlify with CI/CD', duration: '36:20' }
        ]
      }
    ],
    projects: [
      {
        title: 'TaskFlow Productivity Suite',
        description: 'A full-featured kanban productivity board with drag-and-drop, state persistence, and responsive glassmorphism UI.',
        deliverables: 'Live deployed URL, clean GitHub repository, and video walkthrough.'
      }
    ],
    resources: [
      { name: 'React 19 Core Cheatsheet.pdf', type: 'PDF Guide', size: '2.4 MB' },
      { name: 'Starter Template & Configs.zip', type: 'Source Code', size: '1.1 MB' },
      { name: 'UI Component Figma Wireframes', type: 'Design Asset', size: 'Figma Community' }
    ]
  },
  {
    id: 'nodejs-express',
    title: 'Node.js & Express',
    category: 'Backend',
    level: 'Intermediate',
    tech: 'Node.js',
    modulesCount: 10,
    duration: '15 hours',
    isPro: false,
    rating: 4.8,
    enrolledCount: '11,840',
    shortDescription: 'Build REST APIs, handle authentication and work with databases.',
    fullDescription: 'Become proficient in production backend engineering. Build secure, scalable Express microservices, implement JWT authentication, structure clean MVC architectures, and master asynchronous Node.js fundamentals.',
    instructor: 'David Chen, Principal Backend Engineer',
    updatedAt: 'November 2026',
    whatYouWillLearn: [
      'Master Node.js event loop, streams, and non-blocking I/O',
      'Architect robust RESTful APIs with Express router and controllers',
      'Implement JWT token authentication with bcrypt password hashing',
      'Validate payloads with Zod / Joi and write central error middleware',
      'Connect relational and document databases with connection pooling'
    ],
    courseIncludes: [
      '10 structured modules',
      'Deep-dive study notes & architecture guides',
      'Production API boilerplates',
      'API Security checklist guide',
      'Certificate of completion'
    ],
    modules: [
      { id: 1, title: 'Module 1: Node.js Runtime & Event-Driven Architecture', lessonsCount: 4, duration: '1h 20m', isFree: true },
      { id: 2, title: 'Module 2: Building Servers with Express.js', lessonsCount: 5, duration: '1h 35m', isFree: true },
      { id: 3, title: 'Module 3: RESTful API Design & Best Practices', lessonsCount: 4, duration: '1h 30m', isFree: true },
      { id: 4, title: 'Module 4: Request Validation, Sanitization & CORS', lessonsCount: 4, duration: '1h 25m', isFree: true },
      { id: 5, title: 'Module 5: Authentication, Passwords & JWT Tokens', lessonsCount: 5, duration: '1h 50m', isFree: true },
      { id: 6, title: 'Module 6: Database Integration & Query Optimization', lessonsCount: 4, duration: '1h 40m', isFree: true },
      { id: 7, title: 'Module 7: File Uploads & Cloud Storage with S3', lessonsCount: 3, duration: '1h 15m', isFree: true },
      { id: 8, title: 'Module 8: Rate Limiting, Helmet & Security Hardening', lessonsCount: 4, duration: '1h 20m', isFree: true },
      { id: 9, title: 'Module 9: Automated Testing with Vitest & Supertest', lessonsCount: 4, duration: '1h 45m', isFree: true },
      { id: 10, title: 'Module 10: Dockerization, Logging & Production Deployments', lessonsCount: 4, duration: '1h 40m', isFree: true }
    ],
    projects: [
      {
        title: 'FitMind REST API Engine',
        description: 'Robust authentication and wellness tracking backend with rate limiting, swagger docs, and automated integration tests.'
      }
    ],
    resources: [
      { name: 'Express Production Checklist.pdf', type: 'PDF Guide', size: '1.8 MB' },
      { name: 'REST API Postman Collection.json', type: 'Tooling Asset', size: '420 KB' }
    ]
  },
  {
    id: 'python-developers',
    title: 'Python for Developers',
    category: 'Languages',
    level: 'Beginner',
    tech: 'Python',
    modulesCount: 12,
    duration: '16 hours',
    isPro: false,
    rating: 4.9,
    enrolledCount: '18,420',
    shortDescription: 'Master Python from basics to real-world applications.',
    fullDescription: 'From core syntax to object-oriented programming, data manipulation, automation scripting, and asynchronous web scraping. The definitive developer pathway for Python mastery.',
    instructor: 'Priya Sharma, Data & Software Lead',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Write clean, idiomatic Python using PEP8 standards',
      'Master OOP: classes, inheritance, dunder methods, and dataclasses',
      'Work with file systems, JSON, CSV, and SQLite data sources',
      'Build automated CLI utilities and background scrapers',
      'Write unit tests with pytest and debug with pdb'
    ],
    courseIncludes: [
      '12 in-depth modules',
      'Comprehensive module study notes & architecture guides',
      '30+ coding challenges and katas',
      'Automation scripts repository',
      'Certificate of completion'
    ],
    modules: [
      { id: 1, title: 'Module 1: Modern Python 3.12 Environment & Syntax', lessonsCount: 5, duration: '1h 20m', isFree: true },
      { id: 2, title: 'Module 2: Data Structures: Lists, Tuples, Dicts, Sets', lessonsCount: 5, duration: '1h 30m', isFree: true },
      { id: 3, title: 'Module 3: Functions, Lambda Expressions & Decorators', lessonsCount: 4, duration: '1h 25m', isFree: true },
      { id: 4, title: 'Module 4: Object-Oriented Programming Fundamentals', lessonsCount: 5, duration: '1h 45m', isFree: true },
      { id: 5, title: 'Module 5: Exception Handling & Defensive Coding', lessonsCount: 4, duration: '1h 10m', isFree: true },
      { id: 6, title: 'Module 6: File I/O, Serialization & Working with Data', lessonsCount: 4, duration: '1h 15m', isFree: true },
      { id: 7, title: 'Module 7: Working with Virtual Envs & Poetry', lessonsCount: 3, duration: '55m', isFree: true },
      { id: 8, title: 'Module 8: HTTP Requests, APIs & Web Scraping', lessonsCount: 4, duration: '1h 35m', isFree: true },
      { id: 9, title: 'Module 9: Concurrency with Asyncio & Threading', lessonsCount: 4, duration: '1h 40m', isFree: true },
      { id: 10, title: 'Module 10: Pytest Test-Driven Development', lessonsCount: 4, duration: '1h 20m', isFree: true },
      { id: 11, title: 'Module 11: Building Interactive CLI Applications', lessonsCount: 4, duration: '1h 15m', isFree: true },
      { id: 12, title: 'Module 12: Packaging and Publishing to PyPI', lessonsCount: 3, duration: '1h 10m', isFree: true }
    ],
    projects: [
      {
        title: 'PyScraper Insights Pipeline',
        description: 'Multi-threaded data extraction and analysis pipeline generating structured markdown reports.'
      }
    ],
    resources: [
      { name: 'Python Cheat Sheet 2026.pdf', type: 'PDF Guide', size: '3.1 MB' }
    ]
  },
  {
    id: 'mongodb-atlas',
    title: 'MongoDB & Atlas',
    category: 'Database',
    level: 'Intermediate',
    tech: 'MongoDB',
    modulesCount: 8,
    duration: '10 hours',
    isPro: true,
    rating: 4.8,
    enrolledCount: '9,350',
    shortDescription: 'Work with NoSQL databases and deploy with MongoDB Atlas.',
    fullDescription: 'Unlock deep NoSQL mastery. Learn schema design patterns, aggregation pipelines, geospatial queries, indexing strategies for sub-millisecond lookups, and cloud cluster management with MongoDB Atlas.',
    instructor: 'Marcus Brody, Cloud Database Architect',
    updatedAt: 'September 2026',
    whatYouWillLearn: [
      'Architect robust document schemas avoiding anti-patterns',
      'Master advanced Aggregation Framework pipeline stages',
      'Create compound, multikey, and text indexes for optimal query performance',
      'Deploy, secure, and monitor production MongoDB Atlas clusters',
      'Integrate seamlessly with Node.js and Mongoose ODM'
    ],
    courseIncludes: [
      '8 advanced Pro modules',
      'Comprehensive module study notes & guides',
      'Aggregation pipeline interactive workbook',
      'Production Indexing benchmark benchmarks',
      'Verified Pro Credential'
    ],
    modules: [
      { id: 1, title: 'Module 1: Document Model Architecture & BSON Types', lessonsCount: 4, duration: '1h 10m', isFree: false },
      { id: 2, title: 'Module 2: CRUD Operations & Query Operators Deep Dive', lessonsCount: 5, duration: '1h 25m', isFree: false },
      { id: 3, title: 'Module 3: Schema Design Patterns (Embedding vs Referencing)', lessonsCount: 4, duration: '1h 30m', isFree: false },
      { id: 4, title: 'Module 4: The Aggregation Framework Masterclass', lessonsCount: 5, duration: '1h 50m', isFree: false },
      { id: 5, title: 'Module 5: Indexing Strategies & Execution Plans (explain)', lessonsCount: 4, duration: '1h 15m', isFree: false },
      { id: 6, title: 'Module 6: Transactions & ACID Compliance in NoSQL', lessonsCount: 3, duration: '1h 05m', isFree: false },
      { id: 7, title: 'Module 7: MongoDB Atlas Cloud Clusters, VPC & Backups', lessonsCount: 4, duration: '1h 20m', isFree: false },
      { id: 8, title: 'Module 8: Performance Monitoring & Profiler Optimization', lessonsCount: 3, duration: '1h 15m', isFree: false }
    ],
    projects: [
      {
        title: 'High-Volume Analytics Store',
        description: 'Time-series and aggregation query engine storing million-record telemetry events.'
      }
    ],
    resources: [
      { name: 'Aggregation Pipeline Reference Guide.pdf', type: 'Pro PDF', size: '4.2 MB' },
      { name: 'Mongoose Production Schema Templates.js', type: 'Pro Code', size: '580 KB' }
    ]
  },
  {
    id: 'typescript-essentials',
    title: 'TypeScript Essentials',
    category: 'Frontend',
    level: 'Intermediate',
    tech: 'TypeScript',
    modulesCount: 10,
    duration: '14 hours',
    isPro: true,
    rating: 4.9,
    enrolledCount: '13,120',
    shortDescription: 'Write type-safe, scalable JavaScript applications.',
    fullDescription: 'Transform JavaScript uncertainty into rock-solid confidence. Master static typing, union types, generics, conditional types, mapped types, and TypeScript integration in React and Node.js frameworks.',
    instructor: 'Elena Rostova, Principal Software Engineer',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Harness TypeScript compiler configuration (tsconfig.json) for strict safety',
      'Build reusable type utilities using advanced generics and type operators',
      'Understand utility types (Partial, Pick, Omit, Record, ReturnType)',
      'Type React props, hooks, event handlers, and polymorphic components',
      'Structure clean full-stack shared type contracts across client and server'
    ],
    courseIncludes: [
      '10 specialized Pro modules',
      'Comprehensive module study notes & guides',
      '50+ Type challenge puzzles',
      'React + TS Design System boilerplate',
      'Verified Pro Credential'
    ],
    modules: [
      { id: 1, title: 'Module 1: Type Annotations, Primitives & Inferences', lessonsCount: 4, duration: '1h 10m', isFree: false },
      { id: 2, title: 'Module 2: Interfaces vs Type Aliases & Intersection Types', lessonsCount: 5, duration: '1h 25m', isFree: false },
      { id: 3, title: 'Module 3: Functions, Signatures & Overloading', lessonsCount: 4, duration: '1h 15m', isFree: false },
      { id: 4, title: 'Module 4: Generics: From Basic to Advanced', lessonsCount: 5, duration: '1h 45m', isFree: false },
      { id: 5, title: 'Module 5: Utility Types & Built-in Helpers', lessonsCount: 4, duration: '1h 20m', isFree: false },
      { id: 6, title: 'Module 6: Conditional & Mapped Types Wizardry', lessonsCount: 4, duration: '1h 35m', isFree: false },
      { id: 7, title: 'Module 7: Typing Modern React Applications', lessonsCount: 5, duration: '1h 40m', isFree: false },
      { id: 8, title: 'Module 8: Typing Node.js, Express & Database Models', lessonsCount: 4, duration: '1h 20m', isFree: false },
      { id: 9, title: 'Module 9: Monorepos & Shared DTO Types', lessonsCount: 3, duration: '1h 10m', isFree: false },
      { id: 10, title: 'Module 10: Strict Mode Migration Strategies', lessonsCount: 3, duration: '1h 20m', isFree: false }
    ],
    projects: [
      {
        title: 'Type-Safe Headless Component Library',
        description: 'Strict polymorphic UI component kit with comprehensive generic props and zero runtime bundle overhead.'
      }
    ],
    resources: [
      { name: 'TypeScript Advanced Types Cheatsheet.pdf', type: 'Pro PDF', size: '2.9 MB' }
    ]
  },
  {
    id: 'mern-stack-project',
    title: 'MERN Stack Project',
    category: 'Full Stack',
    level: 'Advanced',
    tech: 'Full Stack',
    modulesCount: 12,
    duration: '25 hours',
    isPro: true,
    rating: 5.0,
    enrolledCount: '8,750',
    shortDescription: 'Build a complete full-stack application from scratch.',
    fullDescription: 'The ultimate flagship capstone. Architect and deploy a complete production-grade enterprise application combining React, Node.js, Express, and MongoDB with secure payments, real-time WebSockets, and CI/CD pipelines.',
    instructor: 'Aptivella Senior Architect Team',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Architect a modular monorepo containing client and server codebases',
      'Implement dual-token JWT authentication with HTTP-only cookies and refresh rotation',
      'Build real-time updates and notifications using WebSockets',
      'Integrate payment checkout flow with automated webhook verification',
      'Set up GitHub Actions CI/CD pipeline and automated cloud deployment'
    ],
    courseIncludes: [
      '12 comprehensive capstone modules',
      '25 hours of step-by-step masterclass lectures',
      'Complete production repository access',
      '1-on-1 Code review guidelines & rubrics',
      'Premier Capstone Credential'
    ],
    modules: [
      { id: 1, title: 'Module 1: Architecture Blueprint & System Design', lessonsCount: 4, duration: '1h 45m', isFree: false },
      { id: 2, title: 'Module 2: Project Scaffolding & Shared Types', lessonsCount: 4, duration: '1h 30m', isFree: false },
      { id: 3, title: 'Module 3: Database Schemas & Indexing with Mongoose', lessonsCount: 5, duration: '2h 10m', isFree: false },
      { id: 4, title: 'Module 4: Enterprise REST API & Middleware Engine', lessonsCount: 6, duration: '2h 30m', isFree: false },
      { id: 5, title: 'Module 5: Production Authentication & Session Lifecycle', lessonsCount: 5, duration: '2h 15m', isFree: false },
      { id: 6, title: 'Module 6: React Frontend Architecture & State Stores', lessonsCount: 6, duration: '2h 45m', isFree: false },
      { id: 7, title: 'Module 7: Interactive Dashboards & Real-Time Data Charts', lessonsCount: 5, duration: '2h 00m', isFree: false },
      { id: 8, title: 'Module 8: WebSocket Real-Time Chat & Activity Feed', lessonsCount: 4, duration: '1h 50m', isFree: false },
      { id: 9, title: 'Module 9: Payment Gateway Architecture & Webhook Handlers', lessonsCount: 4, duration: '2h 00m', isFree: false },
      { id: 10, title: 'Module 10: Performance Optimization & Caching with Redis', lessonsCount: 4, duration: '1h 45m', isFree: false },
      { id: 11, title: 'Module 11: End-to-End Testing & Security Audits', lessonsCount: 4, duration: '1h 50m', isFree: false },
      { id: 12, title: 'Module 12: Production Cloud Deployment with Docker & CI/CD', lessonsCount: 5, duration: '2h 40m', isFree: false }
    ],
    projects: [
      {
        title: 'GadgetCart — Modern E-Commerce SaaS',
        description: 'Full-stack commercial storefront with catalog, search, shopping cart, admin telemetry, and payment processing.'
      }
    ],
    resources: [
      { name: 'MERN Enterprise Architecture Blueprint.pdf', type: 'Pro PDF', size: '5.8 MB' },
      { name: 'Full Production Source Code (.zip)', type: 'Pro Code', size: '14.2 MB' }
    ]
  }
,
  {
    id: 'nextjs-fullstack-mastery',
    title: 'Next.js 15 & Fullstack Architecture',
    category: 'Full Stack',
    level: 'Advanced',
    tech: 'Next.js',
    modulesCount: 10,
    duration: '18 hours',
    isPro: true,
    rating: 4.9,
    enrolledCount: '16,420',
    shortDescription: 'Master the App Router, React Server Components, Server Actions, and Edge Deployments.',
    fullDescription: 'From core App Router fundamentals to server actions, parallel routes, streaming SSR with Suspense, full-stack database integrations, and high-performance edge caching.',
    instructor: 'Devon Lee, Next.js Core Contributor',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Master Next.js 15 App Router architecture & nested layout patterns',
      'Leverage React Server Components (RSC) for zero client-bundle overhead',
      'Implement Server Actions with type-safe mutation pipelines & optimistic UI',
      'Integrate Auth.js v5, Mongoose/Prisma, and payment webhooks at the edge',
      'Optimize Web Vitals with Partial Prerendering (PPR) and ISR'
    ],
    courseIncludes: [
      '10 advanced Pro modules',
      '18 hours of production code-alongs',
      'Full Next.js SaaS starter template (.zip)',
      '1-on-1 Mentor code review pass',
      'Verified Pro Credential'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Next.js 15 App Router Foundations',
        lessonsCount: 4,
        duration: '1h 35m',
        isFree: false,
        lessons: [
          {
            title: 'App Router vs Pages Router Architecture',
            duration: '18:20',
            lectureNotes: 'Next.js 15 builds entirely around React Server Components and nested route layouts. Server Components execute solely on the Node/Edge runtime, streaming HTML and the RSC payload directly to the client with zero bundle penalty.',
            codeSnippet: '// app/dashboard/layout.js\nexport default function DashboardLayout({ children, analytics }) {\n  return (\n    <div className="flex min-h-screen">\n      <Sidebar />\n      <main className="flex-1 p-6">\n        {children}\n        {analytics}\n      </main>\n    </div>\n  );\n}',
            exercise: 'Create a nested dashboard layout with a persistent sidebar and an analytical slot.',
            quiz: {
              question: 'Where do React Server Components execute in Next.js 15?',
              options: ['Strictly on the server', 'In the client browser', 'Inside the service worker', 'During Webpack build only'],
              correctIndex: 0,
              explanation: 'React Server Components execute strictly on the server runtime, rendering HTML and streaming RSC payloads to the client without sending component JS code to the browser.'
            }
          },
          {
            title: 'Layouts, Templates & Route Groups',
            duration: '22:15',
            lectureNotes: 'Route groups allow logical organization of routes without affecting the URL pathname. Parent layouts preserve component state and avoid re-renders across route transitions.',
            codeSnippet: '// app/(marketing)/about/page.js\nexport default async function AboutPage() {\n  return <h1>About Aptivella</h1>;\n}',
            exercise: 'Organize routes into (marketing) and (app) route groups with distinct navigation headers.',
            quiz: {
              question: 'How do you prevent a folder from becoming part of the URL pathname in Next.js?',
              options: ['Wrap the folder name in parentheses: (folder)', 'Wrap it in square brackets: [folder]', 'Prefix with an underscore: _folder', 'Use an @ symbol: @folder'],
              correctIndex: 0,
              explanation: 'Wrapping a folder name in parentheses like (marketing) creates a route group without adding to the URL path.'
            }
          },
          {
            title: 'Streaming SSR & Suspense Boundaries',
            duration: '25:30',
            lectureNotes: 'Streaming breaks the page HTML into chunks and streams them progressively. Slow data fetches inside Suspense boundaries no longer block the entire initial page render.',
            codeSnippet: 'import { Suspense } from "react";\nimport CourseFeedSkeleton from "./Skeleton";\n\nexport default function Page() {\n  return (\n    <div>\n      <h1>Courses</h1>\n      <Suspense fallback={<CourseFeedSkeleton />}>\n        <AsyncCourseFeed />\n      </Suspense>\n    </div>\n  );\n}',
            exercise: 'Add Suspense boundaries with skeleton loaders to streaming data tables.',
            quiz: {
              question: 'What is the primary benefit of Suspense streaming in Next.js?',
              options: ['Fast initial TTFB without waiting for slow queries', 'Eliminates CSS loading', 'Replaces client hooks', 'Compiles code to WebAssembly'],
              correctIndex: 0,
              explanation: 'Suspense allows fast initial HTML delivery while dynamic components stream in as their asynchronous data resolves.'
            }
          },
          {
            title: 'Partial Prerendering (PPR) in Next.js 15',
            duration: '29:10',
            lectureNotes: 'Partial Prerendering blends static prerendering and dynamic streaming within a single page, delivering instantaneous static shell rendering alongside live personalized widgets.',
            codeSnippet: 'export const experimental_ppr = true;',
            exercise: 'Configure a marketing landing page with a static hero section and dynamic personalized cart widget using PPR.',
            quiz: {
              question: 'What does Partial Prerendering (PPR) achieve?',
              options: ['Combines static shell loading with dynamic streaming', 'Runs code in Docker', 'Removes the need for JavaScript', 'Converts HTML to PDF'],
              correctIndex: 0,
              explanation: 'PPR delivers an instant static shell while dynamic islands stream into the page asynchronously.'
            }
          }
        ]
      },
      {
        id: 2,
        title: 'Module 2: Server Actions & Type-Safe Mutations',
        lessonsCount: 4,
        duration: '1h 50m',
        isFree: false,
        lessons: [
          {
            title: 'Defining Server Actions with "use server"',
            duration: '24:10',
            lectureNotes: 'Server Actions are asynchronous functions declared with the "use server" directive. They can be invoked directly from client components or native form submissions with zero API boilerplate.',
            codeSnippet: '// app/actions/courseActions.js\n"use server";\nimport { revalidatePath } from "next/cache";\n\nexport async function enrollCourse(courseId) {\n  await db.enrollments.create({ courseId });\n  revalidatePath("/dashboard");\n  return { success: true };\n}',
            exercise: 'Build a server action that updates user profile settings and triggers cache revalidation.',
            quiz: {
              question: 'What directive declares a Server Action?',
              options: ['"use server"', '"use action"', '"use api"', '"use client"'],
              correctIndex: 0,
              explanation: 'Placing "use server" at the top of a file or function body marks it as an executable server action.'
            }
          },
          {
            title: 'Optimistic UI with useOptimistic Hook',
            duration: '26:40',
            lectureNotes: 'useOptimistic gives the user instantaneous feedback by showing the expected mutation result while the network request is still pending on the server.',
            codeSnippet: 'const [optimisticLikes, addOptimisticLike] = useOptimistic(\n  likes,\n  (state, newLike) => state + newLike\n);',
            exercise: 'Implement an optimistic like button that instantly updates before the server responds.',
            quiz: {
              question: 'What happens if a server action fails after an optimistic update?',
              options: ['React reverts to the previous confirmed server state', 'The browser throws a fatal crash', 'The user must refresh the page', 'The DB is corrupted'],
              correctIndex: 0,
              explanation: 'React automatically rolls back the optimistic state to match the true server state if the mutation fails.'
            }
          },
          {
            title: 'Form Validation with Zod & Server Action Return Types',
            duration: '28:15',
            lectureNotes: 'Never trust client input. Parse and validate form data on the server with Zod before database insertion.',
            codeSnippet: 'import { z } from "zod";\nconst schema = z.object({ title: z.string().min(5) });\n\nexport async function createCourse(prevState, formData) {\n  const result = schema.safeParse(Object.fromEntries(formData));\n  if (!result.success) return { errors: result.error.flatten() };\n  // Proceed to DB\n}',
            exercise: 'Validate user checkout addresses using Zod inside a server action.',
            quiz: {
              question: 'Why validate Server Actions with Zod on the server?',
              options: ['Server Actions are public POST endpoints susceptible to forged payloads', 'To make CSS faster', 'To enable cookies', 'Zod is mandatory in React'],
              correctIndex: 0,
              explanation: 'Server Actions expose POST endpoints over HTTP; server-side validation is strictly required for security.'
            }
          },
          {
            title: 'Cache Revalidation: revalidatePath & revalidateTag',
            duration: '31:00',
            lectureNotes: 'Next.js provides on-demand cache purge utilities. revalidateTag purges all fetches tagged with a specific identifier across any number of pages.',
            codeSnippet: 'import { revalidateTag } from "next/cache";\n\nexport async function updatePlan() {\n  revalidateTag("plans");\n}',
            exercise: 'Use cache tags to revalidate course catalogue data on demand.',
            quiz: {
              question: 'Which utility purges cached data tagged with a label in Next.js?',
              options: ['revalidateTag', 'clearCache()', 'flushCookies()', 'purgeRoutes()'],
              correctIndex: 0,
              explanation: 'revalidateTag(tag) purges the Next.js Data Cache for all fetch requests associated with that tag.'
            }
          }
        ]
      }
    ],
    projects: [
      {
        title: 'ProSaaS — Full-Stack Subscription Platform',
        description: 'Complete production SaaS featuring App Router, Auth.js, MongoDB Mongoose, Razorpay subscriptions, and analytics telemetry.'
      }
    ],
    resources: [
      { name: 'Next.js 15 Architecture Blueprint.pdf', type: 'Pro PDF', size: '4.8 MB' },
      { name: 'Complete Next.js 15 Starter Repository (.zip)', type: 'Pro Code', size: '12.4 MB' }
    ]
  },
  {
    id: 'ai-langchain-engineering',
    title: 'AI Engineering & LLM Apps with LangChain',
    category: 'AI & Machine Learning',
    level: 'Advanced',
    tech: 'AI / ML',
    modulesCount: 10,
    duration: '16 hours',
    isPro: true,
    rating: 5.0,
    enrolledCount: '21,180',
    shortDescription: 'Build production AI apps with OpenAI, Vector Databases, RAG, and Autonomous Agents.',
    fullDescription: 'Learn to build production-grade Generative AI applications. Master retrieval-augmented generation (RAG), vector embeddings with Pinecone/Qdrant, LangChain orchestration, and autonomous agent loops.',
    instructor: 'Dr. Aris Thorne, AI Research Fellow & Lead Engineer',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Master prompt engineering, structured outputs, and JSON mode with OpenAI models',
      'Generate embeddings and build vector search pipelines with Pinecone and FAISS',
      'Implement Production Retrieval-Augmented Generation (RAG) with hybrid search',
      'Orchestrate multi-step reasoning agents with LangChain & LangGraph',
      'Evaluate LLM hallucination and latency using Tracing and LangSmith'
    ],
    courseIncludes: [
      '10 specialized Pro modules',
      '16 hours of hands-on code lectures',
      'Complete RAG & Agentic Boilerplate repo',
      'Vector indexing performance playbook',
      'Verified Pro Credential'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: LLM Fundamentals & Prompt Engineering',
        lessonsCount: 4,
        duration: '1h 30m',
        isFree: false,
        lessons: [
          {
            title: 'Transformers, Context Windows & Tokenization',
            duration: '20:10',
            lectureNotes: 'Understand the transformer architecture, self-attention mechanisms, and how tokens map to byte-pair encodings. Learn how context limits impact reasoning quality and inference cost.',
            codeSnippet: 'import { OpenAI } from "openai";\nconst openai = new OpenAI();\n\nconst response = await openai.chat.completions.create({\n  model: "gpt-4o",\n  messages: [{ role: "system", content: "You are an expert tutor." }],\n  response_format: { type: "json_object" }\n});',
            exercise: 'Configure an OpenAI client that reliably outputs structured JSON schemas.',
            quiz: {
              question: 'What is the purpose of tokenization in LLMs?',
              options: ['Converting raw text strings into numerical integer tokens', 'Encrypting passwords', 'Compiling code to machine language', 'Compressing images'],
              correctIndex: 0,
              explanation: 'Tokenization maps text into integer tokens representing word fragments that neural networks process.'
            }
          },
          {
            title: 'Chain-of-Thought & Few-Shot In-Context Learning',
            duration: '22:40',
            lectureNotes: 'Few-shot prompting provides concrete input-output examples before the target query. Chain-of-thought encourages the model to generate intermediate reasoning tokens, vastly improving math and logic accuracy.',
            codeSnippet: 'const prompt = `Problem: A course has 8 modules. A student finishes 3.\nReasoning: Total is 8, completed is 3, remaining is 8 - 3 = 5.\nAnswer: 5\n\nProblem: Course has 12 modules, student finishes 4.\nReasoning: `;',
            exercise: 'Write a few-shot chain-of-thought prompt for code debugging.',
            quiz: {
              question: 'Why does Chain-of-Thought prompting improve complex reasoning?',
              options: ['It gives the model computational steps to think before answering', 'It increases GPU clock speed', 'It bypasses token limits', 'It disables temperature'],
              correctIndex: 0,
              explanation: 'Generating intermediate reasoning tokens allows autoregressive transformers to compute intermediate representations before predicting the final conclusion.'
            }
          },
          {
            title: 'Enforcing Type-Safe Schemas with Zod and JSON Mode',
            duration: '24:15',
            lectureNotes: 'Modern LLMs support Structured Outputs with JSON schemas guaranteed to conform 100% to your provided Zod or Pydantic data models.',
            codeSnippet: 'import { z } from "zod";\nimport { zodResponseFormat } from "openai/helpers/zod";\n\nconst CoursePlan = z.object({\n  title: z.string(),\n  modules: z.array(z.string())\n});\n\nconst completion = await openai.beta.chat.completions.parse({\n  model: "gpt-4o-2024-08-06",\n  messages: [...],\n  response_format: zodResponseFormat(CoursePlan, "plan")\n});',
            exercise: 'Extract key insights from markdown articles into a strongly typed Zod object.',
            quiz: {
              question: 'What feature guarantees that an LLM returns schema-valid output without parsing errors?',
              options: ['OpenAI Structured Outputs with Zod', 'Setting temperature to 2', 'Lowering max_tokens', 'Adding "please output JSON" in prompt'],
              correctIndex: 0,
              explanation: 'OpenAI Structured Outputs constrain generation to follow the grammatical syntax of the target JSON schema.'
            }
          },
          {
            title: 'Managing LLM Context Windows & Cost Optimization',
            duration: '23:00',
            lectureNotes: 'Learn strategies for trimming prompt tokens, semantic caching, and choosing the appropriate model tier (GPT-4o vs GPT-4o-mini).',
            codeSnippet: '// Semantic Cache check with Redis vector index\nconst cached = await redisVectorSearch(queryEmbedding, threshold = 0.95);\nif (cached) return cached.answer;',
            exercise: 'Implement a semantic cache for common user programming questions.',
            quiz: {
              question: 'How does semantic caching reduce LLM expenses?',
              options: ['It answers semantically similar questions using vector lookups without calling the LLM', 'It shortens the query text', 'It reduces database connections', 'It switches to free models'],
              correctIndex: 0,
              explanation: 'Semantic caching stores previous answers indexed by embeddings, returning stored answers when cosine similarity exceeds 0.95+.'
            }
          }
        ]
      },
      {
        id: 2,
        title: 'Module 2: Embeddings, Vector Databases & RAG Pipelines',
        lessonsCount: 4,
        duration: '1h 45m',
        isFree: false,
        lessons: [
          {
            title: 'Vector Embeddings: text-embedding-3-small and Cosine Similarity',
            duration: '25:10',
            lectureNotes: 'Embeddings map text to high-dimensional floating-point vectors where semantic similarity corresponds to geometric angle (cosine distance).',
            codeSnippet: 'const embedding = await openai.embeddings.create({\n  model: "text-embedding-3-small",\n  input: "React state management"\n});\nconsole.log(embedding.data[0].embedding.length); // 1536 floats',
            exercise: 'Calculate cosine similarity between two developer queries in JavaScript.',
            quiz: {
              question: 'What does a cosine similarity of 1.0 between two text embeddings indicate?',
              options: ['The vectors point in the identical direction (maximal semantic similarity)', 'The strings are of identical character length', 'Both texts have zero words', 'They were created at the same timestamp'],
              correctIndex: 0,
              explanation: 'Cosine similarity measures the cosine of the angle between two vectors; 1.0 means identical directional orientation in semantic space.'
            }
          },
          {
            title: 'Document Chunking Strategies: Recursive Text Splitters',
            duration: '26:40',
            lectureNotes: 'Chunking raw documentation into 500-1000 token segments with 100 token overlap ensures context continuity without diluting semantic vector clarity.',
            codeSnippet: 'import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";\n\nconst splitter = new RecursiveCharacterTextSplitter({\n  chunkSize: 800,\n  chunkOverlap: 120\n});\nconst docs = await splitter.splitDocuments(rawDocs);',
            exercise: 'Chunk a 20-page PDF manual into semantically consistent segments.',
            quiz: {
              question: 'Why include chunk overlap when splitting documents for RAG?',
              options: ['To prevent splitting critical thoughts or sentences in half across boundaries', 'To make files larger', 'To decrease search speed', 'To satisfy vector database requirements'],
              correctIndex: 0,
              explanation: 'Overlap preserves semantic continuity across chunk boundaries so context is not lost mid-sentence.'
            }
          },
          {
            title: 'Querying Pinecone & Qdrant with Metadata Filtering',
            duration: '27:20',
            lectureNotes: 'Vector databases index millions of embedding vectors using HNSW graphs for approximate nearest neighbor (ANN) search with sub-50ms latency.',
            codeSnippet: 'const searchResults = await pineconeIndex.query({\n  vector: queryEmbedding,\n  topK: 5,\n  includeMetadata: true,\n  filter: { category: "database" }\n});',
            exercise: 'Execute filtered vector search query across documentation embeddings.',
            quiz: {
              question: 'What indexing algorithm powers sub-second vector search in modern vector databases?',
              options: ['HNSW (Hierarchical Navigable Small World)', 'B-Tree', 'QuickSort', 'SHA-256'],
              correctIndex: 0,
              explanation: 'HNSW builds multi-layered proximity graphs to search millions of high-dimensional vectors in logarithmic time.'
            }
          },
          {
            title: 'Assembling the End-to-End RAG QA Pipeline',
            duration: '26:00',
            lectureNotes: 'Retrieve top-k relevant chunks from vector search, format them into the system prompt as context, and instruct the LLM to synthesize an accurate answer citing sources.',
            codeSnippet: 'const systemPrompt = `Answer the question strictly using the provided context:\n\nContext:\n${retrievedChunks.join("\\n\\n")}`;',
            exercise: 'Build an interactive knowledge assistant over company API docs.',
            quiz: {
              question: 'What is the main purpose of Retrieval-Augmented Generation (RAG)?',
              options: ['Grounding LLM responses in real, proprietary external data without retraining', 'Making models generate code faster', 'Compressing video files', 'Replacing databases completely'],
              correctIndex: 0,
              explanation: 'RAG dynamically injects relevant private facts into the prompt context window to eliminate hallucinations and give up-to-date answers.'
            }
          }
        ]
      }
    ],
    projects: [
      {
        title: 'NexusAI — Intelligent Autonomous Research Analyst',
        description: 'Multi-agent research pipeline that crawls docs, indexes vector stores, and generates comprehensive markdown technical whitepapers.'
      }
    ],
    resources: [
      { name: 'Production RAG Architecture Guide.pdf', type: 'Pro PDF', size: '5.2 MB' },
      { name: 'LangChain & Vector Starter Kit (.zip)', type: 'Pro Code', size: '8.4 MB' }
    ]
  },
  {
    id: 'docker-kubernetes-devops',
    title: 'Docker, Kubernetes & Cloud DevOps Pipeline',
    category: 'DevOps',
    level: 'Intermediate',
    tech: 'Docker',
    modulesCount: 9,
    duration: '15 hours',
    isPro: true,
    rating: 4.8,
    enrolledCount: '12,940',
    shortDescription: 'Containerize microservices, manage Kubernetes clusters, and automate CI/CD with GitOps.',
    fullDescription: 'From local Docker containers to multi-node Kubernetes clusters. Learn image optimization, Helm charts, ingress controllers, persistent volumes, and automated GitHub Actions deployment pipelines.',
    instructor: 'Liam O\'Connor, Senior DevOps & Site Reliability Architect',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Write optimized multi-stage Dockerfiles reducing image size by 80%',
      'Orchestrate local multi-container development with Docker Compose',
      'Deploy pods, deployments, services, and ingress routes on Kubernetes',
      'Manage secrets and configuration with ConfigMaps and SealedSecrets',
      'Automate testing, linting, building, and deployment with GitHub Actions'
    ],
    courseIncludes: [
      '9 specialized Pro modules',
      'Deep-dive study notes & practical code walk-throughs',
      'Kubernetes manifest boilerplates & Helm charts',
      'CI/CD pipeline templates',
      'Verified Pro Credential'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Modern Containerization with Docker',
        lessonsCount: 4,
        duration: '1h 35m',
        isFree: false,
        lessons: [
          {
            title: 'Containers vs Virtual Machines & Namespaces',
            duration: '22:10',
            lectureNotes: 'Containers isolate processes on top of the shared host Linux kernel using cgroups (resource limits) and namespaces (process/network isolation), providing near-zero startup overhead compared to VMs.',
            codeSnippet: '# Inspect container process isolation\ndocker run -d --name web -p 5000:5000 node:20-alpine\ndocker top web',
            exercise: 'Run an isolated Node.js container mapping local port 5000.',
            quiz: {
              question: 'How do containers differ fundamentally from virtual machines?',
              options: ['Containers share the host kernel while VMs run a complete guest OS', 'Containers cannot run Linux', 'VMs do not use RAM', 'Containers require hypervisors'],
              correctIndex: 0,
              explanation: 'Containers share the host operating system kernel and isolate processes using cgroups and namespaces without guest OS overhead.'
            }
          },
          {
            title: 'Multi-Stage Dockerfiles for Node.js & React',
            duration: '26:30',
            lectureNotes: 'Multi-stage builds separate development tooling (compilers, devDependencies) from the production image, minimizing attack surfaces and reducing bundle sizes from 1GB to under 50MB.',
            codeSnippet: 'FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCMD ["node", "dist/server.js"]',
            exercise: 'Convert a single-stage Dockerfile into an optimized multi-stage production build.',
            quiz: {
              question: 'Why are multi-stage Docker builds recommended for production?',
              options: ['They omit build dependencies and reduce final image size drastically', 'They enable dark mode', 'They allow running Windows apps on Mac', 'They make containers run on port 80 only'],
              correctIndex: 0,
              explanation: 'Multi-stage builds leave behind bulky build tools, linters, and source files, copying only compiled assets into a clean minimal runtime image.'
            }
          },
          {
            title: 'Layer Caching Optimization & Security Scans',
            duration: '24:10',
            lectureNotes: 'Docker caches layers from top to bottom. Placing rarely changing files (package.json) before volatile source code maximizes cache hits and slashes CI build times from minutes to seconds.',
            codeSnippet: '# Scan image for known CVE vulnerabilities\ndocker scan my-api:latest',
            exercise: 'Reorder Dockerfile instructions to achieve 100% layer cache hits during code-only updates.',
            quiz: {
              question: 'Why copy package.json and run npm install BEFORE copying application source code in Dockerfiles?',
              options: ['To cache npm dependencies and avoid reinstalling on every minor code edit', 'Because npm requires package.json to be in root', 'To encrypt node_modules', 'Docker commands must be in alphabetical order'],
              correctIndex: 0,
              explanation: 'If package.json has not changed, Docker reuses the cached layer, saving minutes of dependency download time on subsequent builds.'
            }
          },
          {
            title: 'Docker Compose for Full-Stack Local Microservices',
            duration: '22:45',
            lectureNotes: 'Define frontend, Express backend, and MongoDB database inside a single docker-compose.yml file with isolated internal networking and persistent data volumes.',
            codeSnippet: 'services:\n  backend:\n    build: ./backend\n    ports: ["5000:5000"]\n    environment:\n      - MONGODB_URI=mongodb://mongo:27017/aptivella\n  mongo:\n    image: mongo:7\n    volumes:\n      - mongo_data:/data/db\nvolumes:\n  mongo_data:',
            exercise: 'Compose a complete MERN stack local dev environment with hot-reloading.',
            quiz: {
              question: 'How do services communicate with each other in Docker Compose?',
              options: ['Using their defined service names as automatic DNS hostnames', 'Via USB', 'Through public static IPs', 'By writing to shared text files'],
              correctIndex: 0,
              explanation: 'Docker creates an internal DNS network where containers reach each other using their service name (e.g., http://backend:5000).'
            }
          }
        ]
      }
    ],
    projects: [
      {
        title: 'CloudOps — Zero-Downtime Kubernetes Microservices',
        description: 'Complete multi-tier deployment on cloud Kubernetes with ingress controller, auto-scaling, Prometheus monitoring, and GitHub Actions CI/CD.'
      }
    ],
    resources: [
      { name: 'Kubernetes Production Manifests.zip', type: 'Pro Code', size: '3.4 MB' },
      { name: 'Docker Security Hardening Cheatsheet.pdf', type: 'Pro PDF', size: '2.1 MB' }
    ]
  },
  {
    id: 'system-design-distributed-systems',
    title: 'System Design & Distributed Scalability',
    category: 'Architecture',
    level: 'Advanced',
    tech: 'System Design',
    modulesCount: 12,
    duration: '20 hours',
    isPro: true,
    rating: 5.0,
    enrolledCount: '24,800',
    shortDescription: 'Design systems that scale to millions of users: caching, sharding, message queues, and microservices.',
    fullDescription: 'Master high-scale system design. Dive deep into horizontal scaling, CAP theorem, database sharding, distributed caching with Redis, message brokers with Apache Kafka, load balancing, and fault tolerance.',
    instructor: 'Siddharth Rao, Staff Systems Architect (Ex-FAANG)',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Design fault-tolerant architectures handling 100k+ requests per second',
      'Apply CAP theorem, PACELC, and consistency models (Eventual vs Strong)',
      'Implement multi-level caching strategies (CDN, NGINX, Redis write-through)',
      'Architect event-driven systems using Apache Kafka & RabbitMQ message queues',
      'Master database horizontal partitioning, consistent hashing, and read replicas'
    ],
    courseIncludes: [
      '12 masterclass Pro modules',
      '20 hours of interactive architectural whiteboards',
      'System design interview question blueprints',
      'Real-world system breakdowns (Uber, Netflix, Twitter)',
      'Verified Pro Credential'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: High-Availability Fundamentals & Scaling 101',
        lessonsCount: 4,
        duration: '1h 45m',
        isFree: false,
        lessons: [
          {
            title: 'Horizontal vs Vertical Scaling & Single Points of Failure',
            duration: '24:10',
            lectureNotes: 'Vertical scaling (bigger machines) reaches hard physical and financial limits. Horizontal scaling (adding commodity nodes) behind load balancers with stateless service tiers provides near-infinite linear scalability.',
            codeSnippet: '// Stateless server design: Store session tokens in Redis or JWT,\n// never in server local in-memory variables!\nconst session = await redisClient.get(`session:${sessionId}`);',
            exercise: 'Analyze a monolithic architecture and eliminate all single points of failure (SPOFs).',
            quiz: {
              question: 'Why must application servers be stateless to scale horizontally?',
              options: ['So any incoming request can be served by any available server behind the load balancer', 'To reduce electricity consumption', 'To prevent databases from locking', 'To avoid using HTTPS'],
              correctIndex: 0,
              explanation: 'Stateless servers hold no local session state, allowing load balancers to route any user to any server interchangeably.'
            }
          },
          {
            title: 'Load Balancing Algorithms: Round Robin, Least Connections, IP Hash',
            duration: '26:40',
            lectureNotes: 'Load balancers operate at Layer 4 (TCP/UDP transport level) or Layer 7 (HTTP application level). Layer 7 balancers enable intelligent path-based routing, SSL termination, and header-based authentication checks.',
            codeSnippet: '# NGINX upstream configuration with least_conn algorithm\nupstream backend_cluster {\n    least_conn;\n    server backend1.aptivella.internal:5000;\n    server backend2.aptivella.internal:5000;\n    server backend3.aptivella.internal:5000;\n}',
            exercise: 'Configure an NGINX reverse proxy balancing traffic across three upstream microservice instances.',
            quiz: {
              question: 'Which load balancing algorithm routes incoming traffic to the server currently handling the fewest active requests?',
              options: ['Least Connections', 'Round Robin', 'Random', 'IP Hashing'],
              correctIndex: 0,
              explanation: 'Least Connections routes traffic dynamically to the server with the lowest current workload, preventing traffic spikes on busy nodes.'
            }
          },
          {
            title: 'CAP Theorem & Trade-offs in Real Distributed Systems',
            duration: '28:15',
            lectureNotes: 'Under network partitions (P), a distributed data system must choose between Consistency (C) — every read receives the most recent write or errors — and Availability (A) — every request receives a non-error response without guarantee of latest data.',
            codeSnippet: '// CP system (MongoDB / ZooKeeper) will reject writes during partition to preserve consistency.\n// AP system (Cassandra / DynamoDB) accepts writes on available nodes and reconciles later.',
            exercise: 'Evaluate whether an ATM withdrawal system should be CP or AP.',
            quiz: {
              question: 'According to the CAP Theorem, why can a distributed network system never guarantee both Consistency and Availability during a network partition?',
              options: ['Because nodes separated by a partition cannot communicate the latest writes without delaying or blocking reads', 'Because servers run out of disk space', 'Because internet speeds vary', 'Because of SSL latency'],
              correctIndex: 0,
              explanation: 'If partitioned nodes cannot reach each other, an updated node cannot sync with isolated nodes; returning data either risks returning stale data (violates C) or refusing the request (violates A).'
            }
          },
          {
            title: 'Distributed Caching Strategies: Cache-Aside, Write-Through, Write-Behind',
            duration: '26:00',
            lectureNotes: 'Cache-Aside: application queries cache; on miss, loads from DB and repopulates cache. Write-Through: application writes to cache, which synchronously writes to DB. Write-Behind: writes to cache and asynchronously flushes to DB in batches.',
            codeSnippet: 'async function getUser(id) {\n  const cached = await redis.get(`user:${id}`);\n  if (cached) return JSON.parse(cached);\n  const user = await db.users.findById(id);\n  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));\n  return user;\n}',
            exercise: 'Implement a Cache-Aside pattern with TTL expiration for user dashboard stats.',
            quiz: {
              question: 'In the Cache-Aside pattern, what happens when a requested item is NOT present in the cache (cache miss)?',
              options: ['The application queries the database, writes the result to the cache, and returns it', 'An error is returned to the client', 'The cache deletes itself', 'The database goes offline'],
              correctIndex: 0,
              explanation: 'On a cache miss, the application fetches fresh data from the database, stores it in the cache for future requests, and returns it to the client.'
            }
          }
        ]
      }
    ],
    projects: [
      {
        title: 'StreamSphere — Global Distributed Video & Telemetry Engine',
        description: 'Architectural blueprint and reference prototype handling 100k writes/sec with Redis caching, Kafka message ingestion, and partitioned database shards.'
      }
    ],
    resources: [
      { name: 'System Design Interview Cheatsheet.pdf', type: 'Pro PDF', size: '6.4 MB' },
      { name: 'Distributed Architecture Diagrams (Figma / SVG)', type: 'Pro Design', size: '18 MB' }
    ]
  },
  {
    id: 'flutter-crossplatform-apps',
    title: 'Flutter & Dart: Cross-Platform Mobile Apps',
    category: 'Mobile',
    level: 'Beginner',
    tech: 'Flutter',
    modulesCount: 8,
    duration: '14 hours',
    isPro: false,
    rating: 4.8,
    enrolledCount: '15,220',
    shortDescription: 'Build beautiful, native iOS and Android apps with a single modern codebase.',
    fullDescription: 'Master Dart programming, widget composition, responsive layouts, BLoC and Riverpod state management, native device APIs, and publishing to the Google Play Store and Apple App Store.',
    instructor: 'Maya Lin, Senior Mobile Tech Lead',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Master modern Dart 3 language features (records, patterns, sound null safety)',
      'Build responsive, pixel-perfect mobile UIs using Flutter widget trees',
      'Implement scalable state management using Riverpod and BLoC',
      'Integrate REST APIs, SQLite local caching, and offline data sync',
      'Access native cameras, GPS location, and secure storage'
    ],
    courseIncludes: [
      '8 comprehensive modules',
      '14 hours of step-by-step app development',
      '2 production-ready mobile apps',
      'App Store release checklist',
      'Certificate of completion'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Dart Fundamentals & Widget Tree Architecture',
        lessonsCount: 4,
        duration: '1h 25m',
        isFree: true,
        lessons: [
          {
            title: 'Modern Dart: Null Safety, Records & Pattern Matching',
            duration: '20:15',
            lectureNotes: 'Dart 3 enforces sound null safety by default. Types are non-nullable unless explicitly marked with ?. Records provide lightweight, type-safe anonymous tuples.',
            codeSnippet: '(String, int) getUserStats() {\n  return ("Komala", 42);\n}\n\nvoid main() {\n  var (name, score) = getUserStats();\n  print("$name has score $score");\n}',
            exercise: 'Write a Dart function returning a record tuple with course title and completion status.',
            quiz: {
              question: 'In Dart with sound null safety, what does the question mark (?) after a type mean (e.g. String?)?',
              options: ['The variable can store a string or null', 'The variable is immutable', 'The variable is private', 'It is an optional function parameter'],
              correctIndex: 0,
              explanation: 'A question mark denotes a nullable type, explicitly declaring that the variable can hold either an instance of that type or null.'
            }
          },
          {
            title: 'Stateless vs Stateful Widgets in Flutter',
            duration: '22:40',
            lectureNotes: 'Everything in Flutter is a widget. StatelessWidget rebuilds purely from external configuration. StatefulWidget maintains a persistent State object across rebuilds.',
            codeSnippet: 'class CourseCardWidget extends StatelessWidget {\n  final String title;\n  const CourseCardWidget({super.key, required this.title});\n\n  @override\n  Widget build(BuildContext context) {\n    return Card(child: Text(title));\n  }\n}',
            exercise: 'Build a custom course badge widget that accepts title and color as props.',
            quiz: {
              question: 'When should you choose a StatefulWidget over a StatelessWidget?',
              options: ['When the widget holds internal state that changes dynamically during user interaction', 'Only when connecting to databases', 'Whenever you have images', 'StatefulWidget is always required'],
              correctIndex: 0,
              explanation: 'StatefulWidgets are used when internal state changes during the widget\'s lifecycle (e.g. checkboxes, text input, animation controllers).'
            }
          },
          {
            title: 'Building Responsive Layouts: Rows, Columns, Flex, and Stack',
            duration: '21:00',
            lectureNotes: 'Learn layout constraints in Flutter: constraints go down, sizes go up, parents set positions. Master Expanded, Flexible, Wrap, and LayoutBuilder for responsive screens.',
            codeSnippet: 'Row(\n  mainAxisAlignment: MainAxisAlignment.spaceBetween,\n  children: [\n    Text("Module 1"),\n    Icon(Icons.check_circle, color: Colors.amber),\n  ],\n)',
            exercise: 'Create a responsive horizontal course status card with avatar, title, and action button.',
            quiz: {
              question: 'What rule summarizes Flutter\'s core layout engine behavior?',
              options: ['Constraints go down, sizes go up, parent sets position', 'Everything renders as HTML', 'Children decide their own global screen coordinates', 'Sizes must be specified in absolute pixels'],
              correctIndex: 0,
              explanation: 'In Flutter, parents pass constraints down to children; children determine their size within those bounds; parents position the children.'
            }
          },
          {
            title: 'Theme Styling & Google Fonts in Flutter',
            duration: '21:05',
            lectureNotes: 'Configure dark mode obsidian themes with custom color schemes, typography, and elevation styles.',
            codeSnippet: 'ThemeData.dark().copyWith(\n  scaffoldBackgroundColor: const Color(0xFF0A0C10),\n  colorScheme: const ColorScheme.dark(\n    primary: Color(0xFFE5B85A),\n  ),\n)',
            exercise: 'Apply Aptivella obsidian and gold theme colors to a Flutter MaterialApp.',
            quiz: {
              question: 'Where do you define global app styling and color palettes in Flutter?',
              options: ['Inside ThemeData in MaterialApp', 'In index.html', 'In package.json', 'Inside AndroidManifest.xml'],
              correctIndex: 0,
              explanation: 'ThemeData passed to MaterialApp defines the application-wide color scheme, font themes, and component styling.'
            }
          }
        ]
      }
    ],
    projects: [
      {
        title: 'PocketScholar — Native Mobile Learning Client',
        description: 'Complete cross-platform iOS & Android mobile application with video streaming, offline course downloads, and interactive quizzes.'
      }
    ],
    resources: [
      { name: 'Flutter Developer Cheatsheet.pdf', type: 'PDF Guide', size: '3.6 MB' },
      { name: 'Starter Flutter Mobile Project.zip', type: 'Source Code', size: '5.1 MB' }
    ]
  },
  {
    id: 'cybersecurity-ethical-hacking',
    title: 'Cybersecurity & Web App Penetration Testing',
    category: 'Security',
    level: 'Intermediate',
    tech: 'Cybersecurity',
    modulesCount: 10,
    duration: '16 hours',
    isPro: true,
    rating: 4.9,
    enrolledCount: '11,540',
    shortDescription: 'Defend and audit modern web applications against OWASP Top 10 vulnerabilities and exploits.',
    fullDescription: 'Learn ethical hacking from defensive and offensive perspectives. Master SQL injection, Cross-Site Scripting (XSS), CSRF, JWT tampering, broken access control, automated vulnerability scanning with Burp Suite, and enterprise defense.',
    instructor: 'Cassian Vance, Certified Ethical Hacker (CEH) & Security Consultant',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Master the OWASP Top 10 vulnerabilities with real-world exploit labs',
      'Defend against Cross-Site Scripting (Stored, Reflected, DOM-based XSS)',
      'Audit authentication mechanisms against brute force, credential stuffing, and session hijacking',
      'Test APIs for Broken Object Level Authorization (BOLA / IDOR)',
      'Implement Content Security Policy (CSP), CORS, and HTTP security headers'
    ],
    courseIncludes: [
      '10 specialized Pro modules',
      '16 hours of hands-on security labs',
      'Vulnerability audit checklist templates',
      'Penetration testing lab environment guide',
      'Verified Pro Credential'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Web Security Fundamentals & Threat Modeling',
        lessonsCount: 4,
        duration: '1h 35m',
        isFree: false,
        lessons: [
          {
            title: 'The HTTP Security Model: Same-Origin Policy (SOP) & CORS',
            duration: '22:15',
            lectureNotes: 'The Same-Origin Policy prevents scripts running under one origin from reading documents or data loaded from another origin. CORS is a mechanism that allows servers to selectively relax this policy.',
            codeSnippet: '// Express CORS security configuration\napp.use(cors({\n  origin: ["https://aptivella.io"],\n  credentials: true,\n  methods: ["GET", "POST", "PUT", "DELETE"]\n}));',
            exercise: 'Configure strict CORS origin checking that rejects wildcard origins with credentials.',
            quiz: {
              question: 'What constitutes an "Origin" in browser security?',
              options: ['The combination of Protocol, Hostname, and Port', 'The IP address only', 'The URL path', 'The User-Agent header'],
              correctIndex: 0,
              explanation: 'An origin is defined as the tuple (scheme/protocol, host, port). If any of the three differ, it is considered cross-origin.'
            }
          },
          {
            title: 'OWASP Top 10 Overview: The Modern Attack Surface',
            duration: '24:50',
            lectureNotes: 'Review the current OWASP Top 10 vulnerabilities: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, and Vulnerable Components.',
            codeSnippet: '// Security Audit command with npm\nnpm audit\nnpm audit fix',
            exercise: 'Audit a Node.js repository for vulnerable transitive dependencies.',
            quiz: {
              question: 'Which vulnerability holds the #1 spot in the OWASP Top 10?',
              options: ['Broken Access Control (Authorization failures)', 'SQL Injection', 'Weak passwords', 'Cross-site scripting'],
              correctIndex: 0,
              explanation: 'Broken Access Control is ranked #1 in the OWASP Top 10, occurring when users can act outside their intended permissions.'
            }
          },
          {
            title: 'Hardening HTTP Headers: CSP, HSTS, X-Content-Type-Options',
            duration: '24:20',
            lectureNotes: 'Enforce modern browser defenses using Helmet. Content Security Policy (CSP) restricts where scripts, styles, and media can be loaded from, neutralizing XSS attacks.',
            codeSnippet: 'import helmet from "helmet";\napp.use(helmet({\n  contentSecurityPolicy: {\n    directives: {\n      defaultSrc: ["\'self\'"],\n      scriptSrc: ["\'self\'", "https://checkout.razorpay.com"]\n    }\n  }\n}));',
            exercise: 'Configure a Content Security Policy that permits Razorpay scripts while blocking unauthorized inline scripts.',
            quiz: {
              question: 'Which HTTP response header tells browsers to strictly communicate over HTTPS only for a specified duration?',
              options: ['Strict-Transport-Security (HSTS)', 'Content-Type', 'X-Frame-Options', 'Set-Cookie'],
              correctIndex: 0,
              explanation: 'HSTS (HTTP Strict Transport Security) informs browsers that the domain must only ever be accessed using HTTPS.'
            }
          },
          {
            title: 'Setting up Burp Suite & Intercepting Web Traffic',
            duration: '24:00',
            lectureNotes: 'Configure Burp Suite as an HTTP proxy to inspect, modify, and replay client requests to identify parameter tampering and privilege escalation opportunities.',
            codeSnippet: '# Test endpoint with modified authorization header\ncurl -H "Authorization: Bearer forged_jwt" http://localhost:5000/api/premium/verify-entitlement',
            exercise: 'Intercept and test request parameters against server-side authorization checks.',
            quiz: {
              question: 'What is Burp Suite primarily used for in penetration testing?',
              options: ['Intercepting and modifying HTTP traffic between browser and server', 'Compiling React code', 'Hosting databases', 'Writing CSS'],
              correctIndex: 0,
              explanation: 'Burp Suite acts as an interception proxy, allowing security researchers to inspect, alter, and replay HTTP requests in real time.'
            }
          }
        ]
      }
    ],
    projects: [
      {
        title: 'Aegis — Web Application Security Assessment Report',
        description: 'Comprehensive vulnerability audit and remediation plan covering OWASP Top 10 vulnerabilities across a live staging web application.'
      }
    ],
    resources: [
      { name: 'OWASP Top 10 Defense Cheat Sheet.pdf', type: 'Pro PDF', size: '3.8 MB' },
      { name: 'API Security Testing Checklist.xlsx', type: 'Pro Tool', size: '1.2 MB' }
    ]
  },
  {
    id: 'dsa-javascript-mastery',
    title: 'Data Structures & Algorithms in JavaScript',
    category: 'Computer Science',
    level: 'Intermediate',
    tech: 'DSA',
    modulesCount: 10,
    duration: '18 hours',
    isPro: false,
    rating: 4.9,
    enrolledCount: '29,600',
    shortDescription: 'Ace tech coding interviews with algorithmic patterns, trees, graphs, and dynamic programming.',
    fullDescription: 'Comprehensive algorithmic problem-solving for software engineers. Master Big-O space and time complexity, arrays, two-pointer techniques, sliding windows, recursion, trees, graph traversals, and dynamic programming.',
    instructor: 'Kiran Patel, Competitive Programmer & Algorithm Specialist',
    updatedAt: 'October 2026',
    whatYouWillLearn: [
      'Master Big-O time and space complexity analysis like a senior engineer',
      'Implement Arrays, Linked Lists, Stacks, Queues, Hash Maps, and Heaps',
      'Solve two-pointer, sliding window, and binary search interview patterns',
      'Master Tree traversals (DFS, BFS), Binary Search Trees, and Trie prefix trees',
      'Conquer Graph algorithms (Dijkstra, Topological Sort) and Dynamic Programming'
    ],
    courseIncludes: [
      '10 comprehensive modules',
      '18 hours of algorithmic masterclasses',
      '60+ interview coding exercises & solutions',
      'Big-O complexity cheatsheet',
      'Certificate of completion'
    ],
    modules: [
      {
        id: 1,
        title: 'Module 1: Big-O Complexity & Algorithmic Foundations',
        lessonsCount: 4,
        duration: '1h 40m',
        isFree: true,
        lessons: [
          {
            title: 'Understanding Big-O Time & Space Complexity',
            duration: '25:10',
            lectureNotes: 'Big-O notation describes the limiting behavior of an algorithm as input size n grows to infinity. Learn to distinguish O(1), O(log n), O(n), O(n log n), O(n^2), and O(2^n).',
            codeSnippet: '// O(1) constant time vs O(n) linear time\nfunction isFirstEven(arr) {\n  return arr[0] % 2 === 0; // O(1) time, O(1) space\n}\n\nfunction containsTarget(arr, target) {\n  for (let val of arr) { // O(n) time\n    if (val === target) return true;\n  }\n  return false;\n}',
            exercise: 'Calculate the time and space complexity of nested loop search algorithms.',
            quiz: {
              question: 'What is the time complexity of binary search on a sorted array of n elements?',
              options: ['O(log n)', 'O(n)', 'O(1)', 'O(n^2)'],
              correctIndex: 0,
              explanation: 'Binary search halves the search space on each step, resulting in logarithmic O(log n) time complexity.'
            }
          },
          {
            title: 'Two-Pointer Technique: Two Sum on Sorted Arrays',
            duration: '26:40',
            lectureNotes: 'When working with sorted arrays, two pointers starting at opposite ends can find pairs in O(n) time and O(1) space, avoiding slow O(n^2) nested loops.',
            codeSnippet: 'function twoSumSorted(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return null;\n}',
            exercise: 'Implement the two-pointer approach to reverse an array in-place.',
            quiz: {
              question: 'Why does the two-pointer technique achieve O(n) runtime for sorted pair searches?',
              options: ['Because each pointer moves in a single direction and they meet in at most n steps', 'Because it uses recursion', 'Because it sorts the array twice', 'Because JavaScript optimizes while loops'],
              correctIndex: 0,
              explanation: 'Each step increments left or decrements right; the two pointers cross after at most n total movements, giving strict O(n) time.'
            }
          },
          {
            title: 'Sliding Window Pattern: Maximum Subarray of Size K',
            duration: '24:30',
            lectureNotes: 'The sliding window pattern converts nested loop subarray searches into linear time by adding the incoming element and subtracting the outgoing element as the window shifts.',
            codeSnippet: 'function maxSubarraySum(arr, k) {\n  let maxSum = 0;\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}',
            exercise: 'Find the minimum length subarray with a sum greater than or equal to a target value.',
            quiz: {
              question: 'What is the main benefit of the sliding window pattern over brute force for contiguous subarrays?',
              options: ['Reduces time complexity from O(n*k) to O(n) by reusing overlapping sums', 'Uses zero memory', 'Works on unsorted strings only', 'Converts arrays to trees'],
              correctIndex: 0,
              explanation: 'Instead of recalculating the entire window sum from scratch, sliding window adds the new element and drops the oldest in O(1) time per step.'
            }
          },
          {
            title: 'Hash Maps for O(1) Lookups & Frequency Counters',
            duration: '23:40',
            lectureNotes: 'Hash maps provide average O(1) time complexity for insertions, deletions, and lookups. Frequency counters solve anagram, duplicate, and permutation problems cleanly.',
            codeSnippet: 'function isAnagram(s1, s2) {\n  if (s1.length !== s2.length) return false;\n  const counts = {};\n  for (let char of s1) counts[char] = (counts[char] || 0) + 1;\n  for (let char of s2) {\n    if (!counts[char]) return false;\n    counts[char]--;\n  }\n  return true;\n}',
            exercise: 'Use a hash map to find the first non-repeating character in a string in O(n) time.',
            quiz: {
              question: 'What is the average time complexity of looking up a key in a JavaScript Map or Object?',
              options: ['O(1) constant time', 'O(n) linear time', 'O(log n)', 'O(n^2)'],
              correctIndex: 0,
              explanation: 'Hash maps use a hash function to map keys to bucket indices, providing average O(1) constant lookup time.'
            }
          }
        ]
      }
    ],
    projects: [
      {
        title: 'AlgoLab — Interactive Algorithmic Visualizer',
        description: 'Visual algorithm workbench demonstrating step-by-step sorting, tree traversals, and pathfinding in real time.'
      }
    ],
    resources: [
      { name: 'JavaScript DSA Master Cheatsheet.pdf', type: 'PDF Guide', size: '4.1 MB' },
      { name: '75 Essential LeetCode Patterns.pdf', type: 'PDF Guide', size: '2.9 MB' }
    ]
  }
];

export const STUDENT_PROJECTS = [
  {
    id: 'taskflow',
    title: 'TaskFlow',
    stack: 'React + MongoDB',
    status: 'In Progress',
    progress: 75,
    dueDate: 'In 3 days',
    description: 'Collaborative task management board with drag-and-drop mechanics and live status updates.'
  },
  {
    id: 'fitmind',
    title: 'FitMind',
    stack: 'React + MongoDB',
    status: 'In Progress',
    progress: 40,
    dueDate: 'In 1 week',
    description: 'Personal health and habits tracker featuring daily goal tracking and habit streak visualization.'
  },
  {
    id: 'gadgetcart',
    title: 'GadgetCart',
    stack: 'MERN Stack',
    status: 'Completed',
    progress: 100,
    dueDate: 'Completed Oct 8',
    description: 'Full-featured developer hardware e-commerce store with live cart calculation and mock checkout.'
  }
];

export const CURRENT_USER = null;

export const PRICING_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    subText: 'Flexible learning, anytime.',
    priceINR: '399',
    periodText: '/month',
    billedText: 'Billed monthly',
    badge: null,
    saveText: null,
    highlight: false,
    features: [
      'Unlimited course catalog access',
      'Standard community support',
      'Course completion certificates',
      'Cancel anytime with no lock-in'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    subText: 'Best value for focused growth.',
    priceINR: '999',
    periodText: '/3 months',
    billedText: 'Billed quarterly (₹333/month)',
    badge: 'Most Popular',
    saveText: 'Save 17%',
    highlight: true,
    features: [
      'Unlimited course access across all tracks',
      'Project templates & guided portfolios',
      'Premium resources, notes & source code',
      'Priority code reviews & community access'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    subText: 'Maximum value. Long-term growth.',
    priceINR: '2,999',
    periodText: '/year',
    billedText: 'Billed annually (₹250/month)',
    badge: 'Save 40%',
    saveText: 'Save 40%',
    highlight: false,
    features: [
      'Everything in Quarterly plan',
      'Full access to all advanced capstone projects',
      'Verified resume-ready cryptographic certificates',
      'Early access to new roadmaps & technologies',
      'Direct mentor office hours passes'
    ]
  }
];

/**
 * Helper to ensure any lesson in any course has complete interactive learning assets
 * (HTML5 video stream, synchronized transcript with timestamps, executive summary,
 * lecture notes, editable code playground, interactive quiz, and exercise).
 */
import { getCourseNotesTopic } from './notesContent.js';

export { getCourseNotesTopic };
export const getLessonDetails = getCourseNotesTopic;
