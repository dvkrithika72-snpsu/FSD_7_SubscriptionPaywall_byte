/**
 * APTIVELLA - Comprehensive Course Quizzes & Certification Credentials
 * Contains verified assessments, passing benchmarks, badges catalog, and certificate credentials.
 */

export const COURSE_QUIZZES = {
  'react-for-beginners': {
    courseId: 'react-for-beginners',
    courseTitle: 'React for Beginners',
    title: 'React Component & Architecture Certification Assessment',
    category: 'Frontend Engineering',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-react-specialist',
      title: 'React Specialist',
      icon: '⚛️',
      color: '#61dafb',
      tier: 'Mastery',
      description: 'Mastered component lifecycle, reactive state, custom hooks, and JSX reconciliation.'
    },
    certificate: {
      courseCode: 'REACT-01',
      title: 'React Frontend Development Specialist',
      skills: ['Component Architecture', 'Hooks & Reactive State', 'Virtual DOM & Lifecycle', 'Modern JSX & Reconciliation'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'What is the primary architectural purpose of the Virtual DOM in React?',
        options: [
          'To replace native browser JavaScript engines completely',
          'To compute minimal real DOM mutations in memory before batch updating the UI',
          'To encrypt user inputs before sending them to the backend server',
          'To store persistent database records inside browser memory'
        ],
        correctIndex: 1,
        explanation: 'The Virtual DOM allows React to calculate difference trees (reconciliation) in memory and perform batched, high-performance updates to the browser DOM.'
      },
      {
        id: 2,
        question: 'When does the cleanup function returned inside a `useEffect` hook execute?',
        options: [
          'Only when the computer shuts down',
          'Before the component unmounts and before the effect re-runs on dependency changes',
          'Immediately when the JSX markup begins downloading',
          'Only when the browser window is resized'
        ],
        correctIndex: 1,
        explanation: 'Cleanup functions prevent memory leaks by executing prior to component unmounting and right before subsequent runs of the effect.'
      },
      {
        id: 3,
        question: 'Which of the following describes the rule of "Lifting State Up" in React?',
        options: [
          'Moving shared state to the closest common ancestor of the components that need it',
          'Storing all component state exclusively in window.localStorage',
          'Converting functional components into class components',
          'Declaring state variables inside external CSS files'
        ],
        correctIndex: 0,
        explanation: 'Lifting state up is the recommended pattern where state is elevated to the nearest common ancestor to establish a single source of truth.'
      },
      {
        id: 4,
        question: 'Why should you never mutate React state directly like `state.count = 5`?',
        options: [
          'It will delete the code from the server',
          'React relies on shallow reference equality checks; direct mutation skips re-rendering cycles',
          'JavaScript throws a syntax error when variables change',
          'It invalidates SSL security certificates'
        ],
        correctIndex: 1,
        explanation: 'React detects updates via immutable reference changes. Mutating state in place fails to trigger scheduled render passes.'
      },
      {
        id: 5,
        question: 'What is the proper use case for the `useMemo` hook?',
        options: [
          'To trigger network requests on every user keystroke',
          'To cache and memoize the result of expensive calculations across re-renders',
          'To convert strings into numbers automatically',
          'To restart the web server when an error occurs'
        ],
        correctIndex: 1,
        explanation: 'useMemo caches calculated values so intensive computations do not run unnecessarily when unrelated state causes a re-render.'
      }
    ]
  },

  'nodejs-express': {
    courseId: 'nodejs-express',
    courseTitle: 'Node.js & Express Architecture',
    title: 'Node.js Event Loop & Express REST API Assessment',
    category: 'Backend Engineering',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-node-architect',
      title: 'Node.js Services Architect',
      icon: '🟢',
      color: '#22c55e',
      tier: 'Professional',
      description: 'Mastered non-blocking event loop execution, Express middleware pipelines, and API security.'
    },
    certificate: {
      courseCode: 'NODE-02',
      title: 'Node.js & Express Backend Architect',
      skills: ['Non-Blocking Event Loop', 'Express Middleware Pipelines', 'RESTful API Architecture', 'Asynchronous Execution'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'How does the Node.js Event Loop handle asynchronous I/O operations without blocking execution?',
        options: [
          'By creating a separate operating system process for each HTTP request',
          'By utilizing libuv thread pool and non-blocking system calls with an event loop queue',
          'By pausing all server activities until the file is written to disk',
          'By delegating code execution to client-side browsers'
        ],
        correctIndex: 1,
        explanation: 'Node.js delegates I/O to libuv and non-blocking kernel abstractions, allowing a single main thread to process incoming events efficiently.'
      },
      {
        id: 2,
        question: 'What is the significance of the `next()` function in Express middleware?',
        options: [
          'It resets the database connection pool',
          'It passes control to the subsequent middleware function in the request-response stack',
          'It terminates the HTTP request with status code 404',
          'It compiles TypeScript files into ES modules'
        ],
        correctIndex: 1,
        explanation: 'Calling next() hands off control to the next handler; omitting it leaves the client request hanging indefinitely unless a response is sent.'
      },
      {
        id: 3,
        question: 'Why is it critical to handle unhandled promise rejections in production Node.js services?',
        options: [
          'Unhandled rejections can leave the application in an indeterminate state and terminate the process',
          'It causes CSS stylesheets to lose their styling',
          'It automatically downgrades user accounts to guest status',
          'It prevents npm packages from being updated'
        ],
        correctIndex: 0,
        explanation: 'Unhandled rejections cause silent failures or unhandledRejection process terminations, leading to application crashes.'
      },
      {
        id: 4,
        question: 'Which HTTP status code is standard for returning authorization failure when no valid token is provided?',
        options: ['200 OK', '401 Unauthorized', '404 Not Found', '500 Server Error'],
        correctIndex: 1,
        explanation: 'HTTP 401 Unauthorized indicates that the request requires authentication credentials which are absent or invalid.'
      },
      {
        id: 5,
        question: 'What is the role of Streams in Node.js when processing large data payloads?',
        options: [
          'Streaming reads and writes data piece-by-piece in chunks, preventing out-of-memory errors',
          'Streams compress videos into MP4 format automatically',
          'Streams force all network requests to be processed in synchronous mode',
          'Streams convert SQL queries into NoSQL models'
        ],
        correctIndex: 0,
        explanation: 'Node Streams process continuous chunks of data without loading entire files into memory at once.'
      }
    ]
  },

  'python-developers': {
    courseId: 'python-developers',
    courseTitle: 'Python for Developers',
    title: 'Python Advanced OOP & Systems Programming Assessment',
    category: 'Backend & Data',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-python-engineer',
      title: 'Python Systems Engineer',
      icon: '🐍',
      color: '#38bdf8',
      tier: 'Mastery',
      description: 'Demonstrated mastery over Pythonic idioms, generators, decorators, and data structures.'
    },
    certificate: {
      courseCode: 'PYTH-03',
      title: 'Python Software Systems Engineer',
      skills: ['Object-Oriented Design', 'Generators & Iterators', 'Type Annotations & Modules', 'Asyncio & Concurrency'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'What is the difference between a Python list and a generator expression?',
        options: [
          'Lists store all elements in memory immediately; generators produce values lazily on demand',
          'Generators can only hold strings, while lists hold any data type',
          'Lists cannot be iterated with a for loop',
          'Generators are compiled into C++ executables'
        ],
        correctIndex: 0,
        explanation: 'Generators yield one item at a time using iterator protocol, saving massive memory with large sequences.'
      },
      {
        id: 2,
        question: 'What is a Python decorator and what does the `@` syntax do?',
        options: [
          'A CSS selector that formats terminal text',
          'A callable that takes another function and extends its behavior without modifying its source code',
          'A database index on Python dictionaries',
          'A memory garbage collection mechanism'
        ],
        correctIndex: 1,
        explanation: 'Decorators wrap existing functions with reusable cross-cutting logic like authentication, logging, or performance timers.'
      },
      {
        id: 3,
        question: 'What is the purpose of `__init__.py` in Python package directories?',
        options: [
          'It declares the package version and marks the directory as an importable Python package',
          'It clears Python cache bytecode',
          'It encrypts the project files against plagiarism',
          'It establishes an active database connection'
        ],
        correctIndex: 0,
        explanation: '__init__.py initializes package namespaces and exposes module exports for clean imports.'
      },
      {
        id: 4,
        question: 'Which built-in Python module is used for running concurrent code with async/await syntax?',
        options: ['threading', 'asyncio', 'multiprocessing', 'sys'],
        correctIndex: 1,
        explanation: 'asyncio provides the asynchronous event loop and coroutine scheduler for concurrent I/O.'
      },
      {
        id: 5,
        question: 'What is the time complexity of looking up a key in a Python `dict` on average?',
        options: ['O(1) constant time', 'O(n) linear time', 'O(n log n)', 'O(n^2)'],
        correctIndex: 0,
        explanation: 'Python dictionaries are implemented with high-performance hash tables, granting average O(1) lookup speed.'
      }
    ]
  },

  'mongodb-atlas': {
    courseId: 'mongodb-atlas',
    courseTitle: 'MongoDB & Atlas Cloud',
    title: 'MongoDB Aggregations & Cloud Cluster Certification Exam',
    category: 'Database Architecture',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-mongo-dba',
      title: 'MongoDB Cloud Specialist',
      icon: '🍃',
      color: '#10b981',
      tier: 'Professional',
      description: 'Mastered aggregation pipelines, document schema design, indexing, and Atlas sharding.'
    },
    certificate: {
      courseCode: 'MONGO-04',
      title: 'MongoDB & Cloud Database Specialist',
      skills: ['Document Schema Modeling', 'Aggregation Pipelines', 'Compound Indexing & Sharding', 'ACID Multi-Document Transactions'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'What is the primary difference between `$match` and `$filter` in MongoDB Aggregation Pipelines?',
        options: [
          '$match filters documents passing down the pipeline stage; $filter filters elements inside an embedded array',
          '$match is only available on MySQL databases',
          '$filter deletes matching documents from the database',
          'They are completely identical with no functional differences'
        ],
        correctIndex: 0,
        explanation: '$match limits top-level documents entering a stage; $filter subsets elements within an array expression.'
      },
      {
        id: 2,
        question: 'Why should compound indexes follow the Equality, Sort, Range (ESR) rule?',
        options: [
          'To ensure MongoDB optimizes index leaf scans and avoids expensive in-memory sort operations',
          'Because Atlas requires it to keep subscription pricing lower',
          'To automatically convert all numbers to floating point decimals',
          'To disable schema validation in collections'
        ],
        correctIndex: 0,
        explanation: 'The ESR rule optimizes query execution by matching exact fields first, satisfying sort orders next, and filtering ranges last.'
      },
      {
        id: 3,
        question: 'What is the function of the MongoDB Atlas Replica Set?',
        options: [
          'High availability, automatic failover, and redundancy across distributed nodes',
          'Running background machine learning models on video feeds',
          'Formatting JSON documents into HTML web pages',
          'Replacing backend servers with serverless functions'
        ],
        correctIndex: 0,
        explanation: 'Replica sets maintain synchronized copies across primary and secondary nodes for seamless fault tolerance.'
      },
      {
        id: 4,
        question: 'Which aggregation stage allows joining documents from another collection in the same database?',
        options: ['$join', '$lookup', '$mergeCollection', '$crossApply'],
        correctIndex: 1,
        explanation: '$lookup performs a left outer join to an unsharded collection in the same database.'
      },
      {
        id: 5,
        question: 'When is embedding documents preferable over referencing with ObjectIds?',
        options: [
          'When data is always queried together and has a 1-to-few bounded relationship',
          'When the related collection exceeds 16 Megabytes per document',
          'When data must be normalized for a relational MySQL database',
          'Only when using Python instead of JavaScript'
        ],
        correctIndex: 0,
        explanation: 'Embedding optimizes read performance and atomicity when bounded data is consistently accessed alongside the parent.'
      }
    ]
  },

  'typescript-essentials': {
    courseId: 'typescript-essentials',
    courseTitle: 'TypeScript Essentials',
    title: 'TypeScript Type Safety & Generics Assessment',
    category: 'Programming Languages',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-ts-master',
      title: 'TypeScript Type Architect',
      icon: '🔷',
      color: '#3b82f6',
      tier: 'Mastery',
      description: 'Mastered discriminated unions, advanced generics, conditional types, and strict compilation.'
    },
    certificate: {
      courseCode: 'TS-05',
      title: 'TypeScript Systems Architect',
      skills: ['Static Type System', 'Generics & Utility Types', 'Discriminated Unions', 'Compiler Configuration & Strict Mode'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'What is the purpose of the `unknown` type compared to `any` in TypeScript?',
        options: [
          '`unknown` enforces type narrowing or assertions before operations can be safely performed on it',
          '`unknown` turns off all compiler checks permanently',
          '`unknown` can only hold boolean values',
          '`unknown` is deprecated and throws errors in modern TypeScript'
        ],
        correctIndex: 0,
        explanation: 'Unlike any which bypasses safety, unknown is type-safe: you must verify its type before invoking properties.'
      },
      {
        id: 2,
        question: 'What is a "Discriminated Union" in TypeScript?',
        options: [
          'A union of object types sharing a common literal property used for type narrowing',
          'An SQL JOIN statement between two tables',
          'A merge of two GitHub branches',
          'A private class constructor'
        ],
        correctIndex: 0,
        explanation: 'A common discriminant tag (like `kind: "success" | "error"`) lets TypeScript narrow object shapes with 100% type soundness.'
      },
      {
        id: 3,
        question: 'What does the utility type `Partial<T>` do to an interface or type `T`?',
        options: [
          'Deletes half of the properties at runtime',
          'Constructs a type with all properties of T marked as optional (`?`)',
          'Converts all properties to read-only arrays',
          'Extracts only the function methods of T'
        ],
        correctIndex: 1,
        explanation: 'Partial<T> makes every top-level property of T optional, which is essential for update request payloads.'
      },
      {
        id: 4,
        question: 'What does the `keyof` operator produce in TypeScript?',
        options: [
          'A union of literal strings or symbols representing keys of a given type',
          'An array of database foreign keys',
          'A cryptographic hash string',
          'The length of an object'
        ],
        correctIndex: 0,
        explanation: 'keyof T produces a union of all property keys in type T.'
      },
      {
        id: 5,
        question: 'Why are TypeScript types erased during the compilation step?',
        options: [
          'Because TypeScript is compiled to pure JavaScript which has no native static type annotations',
          'Because browsers reject websites that have types',
          'To prevent the computer hard drive from filling up',
          'It is a bug in the TypeScript compiler'
        ],
        correctIndex: 0,
        explanation: 'TypeScript is a build-time development tool; all type annotations are stripped into lightweight, standard JavaScript.'
      }
    ]
  },

  'mern-stack-project': {
    courseId: 'mern-stack-project',
    courseTitle: 'Fullstack MERN Architecture',
    title: 'Enterprise MERN Production Engineering Assessment',
    category: 'Fullstack Systems',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-mern-pro',
      title: 'Fullstack MERN Specialist',
      icon: '🚀',
      color: '#eab308',
      tier: 'Mastery',
      description: 'Mastered end-to-end fullstack engineering with MongoDB, Express, React, and Node.js.'
    },
    certificate: {
      courseCode: 'MERN-06',
      title: 'Fullstack MERN Software Engineer',
      skills: ['End-to-End System Architecture', 'JWT & OAuth Authentication', 'Mongoose ODM Integration', 'Production React Deployment'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'Where should JWT tokens ideally be stored in browser clients to protect against XSS token theft?',
        options: [
          'In plain HTML input tags',
          'In `httpOnly`, `Secure`, and `SameSite` HTTP cookies',
          'Inside window.alert dialogs',
          'In publicly accessible GitHub repositories'
        ],
        correctIndex: 1,
        explanation: 'httpOnly cookies cannot be accessed or extracted by malicious client-side JavaScript scripts (XSS).'
      },
      {
        id: 2,
        question: 'What is CORS (Cross-Origin Resource Sharing) and why does Express configure it?',
        options: [
          'A security mechanism that allows or restricts web applications running on one domain from requesting resources on another',
          'A CSS layout module for arranging flexbox items',
          'A compression algorithm for image files',
          'A database backup protocol'
        ],
        correctIndex: 0,
        explanation: 'CORS governs browser cross-origin HTTP requests and prevents unauthorized origins from accessing API endpoints.'
      },
      {
        id: 3,
        question: 'What is the role of an API Gateway or Reverse Proxy (like NGINX) in a production MERN deployment?',
        options: [
          'SSL termination, rate limiting, static asset caching, and reverse proxy routing',
          'Generating React components from text prompts',
          'Charging user credit cards automatically',
          'Formatting MongoDB records into PDF files'
        ],
        correctIndex: 0,
        explanation: 'Reverse proxies safeguard backend Node servers by handling SSL, caching, and load balancing traffic.'
      },
      {
        id: 4,
        question: 'How do you handle database connection drops gracefully in MERN backend services?',
        options: [
          'Use Mongoose connection events (`error`, `disconnected`, `reconnected`) and automatic reconnection logic',
          'Ignore the error and write data to the console',
          'Restart the client browser automatically',
          'Delete the collections and start over'
        ],
        correctIndex: 0,
        explanation: 'Listening to connection lifecycle events allows the server to buffer commands or safely fail over without unhandled crashes.'
      },
      {
        id: 5,
        question: 'What is Optimistic UI updating in React frontend applications?',
        options: [
          'Updating the UI state immediately before receiving the server confirmation response, rolling back on failure',
          'Hoping that errors never happen in production',
          'Only writing positive reviews in code comments',
          'Delaying all UI renders by 5 seconds'
        ],
        correctIndex: 0,
        explanation: 'Optimistic UI makes interactions feel instantaneous by updating state immediately while the API mutation is in-flight.'
      }
    ]
  },

  'nextjs-fullstack-mastery': {
    courseId: 'nextjs-fullstack-mastery',
    courseTitle: 'Next.js 15 & Fullstack Architecture',
    title: 'Next.js 15 App Router & Server Components Assessment',
    category: 'Fullstack Frameworks',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-nextjs-expert',
      title: 'Next.js 15 Specialist',
      icon: '▲',
      color: '#ffffff',
      tier: 'Mastery',
      description: 'Mastered React Server Components, Server Actions, streaming SSR, and edge deployments.'
    },
    certificate: {
      courseCode: 'NEXT-07',
      title: 'Next.js 15 Fullstack Architect',
      skills: ['React Server Components (RSC)', 'App Router & Nested Layouts', 'Server Actions & Mutations', 'Edge Runtime & Optimization'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'What is the fundamental difference between React Server Components (RSC) and Client Components in Next.js 15?',
        options: [
          'Server Components execute exclusively on the server with zero client JavaScript bundle impact; Client Components hydrate on the client',
          'Server components cannot display any HTML markup',
          'Client components cannot receive props',
          'Server components only work with PHP backends'
        ],
        correctIndex: 0,
        explanation: 'RSC runs on the server, accessing databases directly and streaming HTML without adding client-side JS bundle overhead.'
      },
      {
        id: 2,
        question: 'What directive must be placed at the top of a file to declare a Client Component in Next.js?',
        options: ['"use client"', '"use strict"', '"use server"', '"client:only"'],
        correctIndex: 0,
        explanation: 'The "use client" directive marks a boundary where React hydrates interactivity, hooks, and browser listeners.'
      },
      {
        id: 3,
        question: 'How do Next.js Server Actions mutate backend data securely without writing custom REST endpoints?',
        options: [
          'By defining asynchronous server functions with `"use server"` that can be invoked directly from forms and buttons',
          'By writing raw SQL strings inside CSS stylesheets',
          'By transmitting passwords in plaintext query parameters',
          'By recompiling the browser at runtime'
        ],
        correctIndex: 0,
        explanation: 'Server Actions provide seamless RPC mutations directly from UI components without maintaining boilerplate REST routes.'
      },
      {
        id: 4,
        question: 'What is the purpose of React Suspense and `loading.tsx` in Next.js App Router?',
        options: [
          'Enabling streaming SSR so users see instant skeleton states while data fetches progressively in parallel',
          'Stopping page execution whenever an error occurs',
          'Encrypting the website source code',
          'Forcing all users to pay for a subscription'
        ],
        correctIndex: 0,
        explanation: 'Suspense boundaries allow Next.js to stream parts of the page immediately while slower database queries resolve.'
      },
      {
        id: 5,
        question: 'What is Partial Prerendering (PPR) in Next.js 15?',
        options: [
          'Combining static shell prerendering with dynamic streaming holes in a single HTTP response',
          'Only rendering every second page of the website',
          'Cropping images by 50% to save bandwidth',
          'Rendering only on mobile devices'
        ],
        correctIndex: 0,
        explanation: 'PPR delivers the static shell at CDN speed while streaming personalized dynamic segments into the same response.'
      }
    ]
  },

  'ai-langchain-engineering': {
    courseId: 'ai-langchain-engineering',
    courseTitle: 'AI Engineering & LLM Apps with LangChain',
    title: 'LLM Systems & Vector RAG Certification Assessment',
    category: 'Artificial Intelligence',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-ai-engineer',
      title: 'AI & LLM Solutions Engineer',
      icon: '🧠',
      color: '#a855f7',
      tier: 'Mastery',
      description: 'Mastered vector embeddings, semantic retrieval, RAG architectures, and autonomous AI agents.'
    },
    certificate: {
      courseCode: 'AI-08',
      title: 'AI Engineering & LLM Application Specialist',
      skills: ['Prompt Engineering & Chains', 'Retrieval Augmented Generation (RAG)', 'Vector Stores & Embeddings', 'Autonomous Agent Pipelines'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'What is the primary role of Retrieval-Augmented Generation (RAG) in enterprise AI applications?',
        options: [
          'Providing LLMs with up-to-date, domain-specific external context to eliminate hallucinations and give accurate answers',
          'Retraining the entire foundation model weights from scratch every hour',
          'Converting text documents into audio files',
          'Running graphic animations on web pages'
        ],
        correctIndex: 0,
        explanation: 'RAG retrieves relevant private or updated documents and injects them into the LLM prompt context window.'
      },
      {
        id: 2,
        question: 'What do high-dimensional vector embeddings represent in semantic search?',
        options: [
          'Mathematical coordinate vectors capturing the contextual and semantic meaning of text chunks',
          'Random numbers generated for user passwords',
          'Hex color codes for website themes',
          'Pixel coordinates on computer monitors'
        ],
        correctIndex: 0,
        explanation: 'Embeddings map text to vectors such that concepts with similar meaning reside close to each other in vector space.'
      },
      {
        id: 3,
        question: 'Which similarity metric is most commonly used to measure distance between normalized vectors in Pinecone/Weaviate?',
        options: ['Cosine Similarity', 'Binary XOR', 'Alphabetical Order', 'HTTP Status Codes'],
        correctIndex: 0,
        explanation: 'Cosine similarity measures the angle between two multi-dimensional vectors, evaluating semantic alignment.'
      },
      {
        id: 4,
        question: 'What is an AI "Agent" loop in LangChain/LangGraph?',
        options: [
          'A system where an LLM reasons iteratively, decides which tools to call, inspects outputs, and repeats until a goal is reached',
          'A customer service phone robot',
          'A cron job that deletes user logs',
          'A simple regex string replacement'
        ],
        correctIndex: 0,
        explanation: 'Agents combine reasoning (ReAct pattern) with execution tools to autonomously accomplish multi-step objectives.'
      },
      {
        id: 5,
        question: 'What does "Chunking with Overlap" prevent when ingesting large documentation for RAG?',
        options: [
          'It prevents crucial context from being severed at arbitrary token split boundaries',
          'It prevents computer overheating',
          'It saves disk space by deleting repeated words',
          'It forces the LLM to output responses twice'
        ],
        correctIndex: 0,
        explanation: 'Sliding window overlap ensures semantic cohesion across boundary sentences during vector segmentation.'
      }
    ]
  },

  'docker-kubernetes-devops': {
    courseId: 'docker-kubernetes-devops',
    courseTitle: 'Docker & Kubernetes DevOps',
    title: 'Containerization & Cluster Orchestration Assessment',
    category: 'Cloud & Infrastructure',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-devops-pro',
      title: 'DevOps & Kubernetes Engineer',
      icon: '🐳',
      color: '#06b6d4',
      tier: 'Mastery',
      description: 'Mastered multi-stage Docker builds, Kubernetes Pod architecture, ingress controllers, and CI/CD.'
    },
    certificate: {
      courseCode: 'DEVOPS-09',
      title: 'Cloud DevOps & Container Orchestration Specialist',
      skills: ['Multi-Stage Dockerfiles', 'Kubernetes Pods & Ingress', 'Rolling Deployments', 'Container Networking & ConfigMaps'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'Why are Multi-Stage Docker builds essential in production Node and React applications?',
        options: [
          'They separate build tooling from runtime environments, producing minimal, secure production image layers',
          'They force the container to reboot every 10 minutes',
          'They allow containers to bypass cloud billing',
          'They automatically translate JavaScript to Python'
        ],
        correctIndex: 0,
        explanation: 'Multi-stage builds leave compiler SDKs and build artifacts behind, keeping final containers lightweight and hardened.'
      },
      {
        id: 2,
        question: 'What is a Kubernetes Pod?',
        options: [
          'The smallest deployable unit in Kubernetes, containing one or more tightly coupled containers sharing network and storage',
          'A physical computer in an Amazon data center',
          'A type of USB drive used for backups',
          'A GitHub repository branch'
        ],
        correctIndex: 0,
        explanation: 'Pods wrap container instances, providing shared localhost networking, IPC, and storage volumes.'
      },
      {
        id: 3,
        question: 'What is the role of a Kubernetes Deployment controller?',
        options: [
          'Managing declarative state, desired replica counts, zero-downtime rolling updates, and self-healing restarts',
          'Running unit tests before code is committed to Git',
          'Sending billing invoice emails to customers',
          'Formatting YAML files into JSON'
        ],
        correctIndex: 0,
        explanation: 'Deployments automate replica sets, rolling upgrades, and rollbacks to keep service availability at 99.99%.'
      },
      {
        id: 4,
        question: 'What is the function of a Kubernetes Ingress resource?',
        options: [
          'Routing external HTTP/S traffic to internal cluster Services based on hostnames and URL paths',
          'Managing database backups to local hard drives',
          'Running antivirus scans on Docker images',
          'Translating English documentation into other languages'
        ],
        correctIndex: 0,
        explanation: 'Ingress exposes HTTP/HTTPS routes from outside the cluster to internal services with routing rules.'
      },
      {
        id: 5,
        question: 'What is the purpose of Kubernetes Liveness and Readiness probes?',
        options: [
          'Liveness detects if a pod needs restarting; Readiness ensures a pod is prepared to receive live user network traffic',
          'They measure the speed of the user internet connection',
          'They check whether the developer has paid for their domain name',
          'They verify that code has no syntax errors'
        ],
        correctIndex: 0,
        explanation: 'Probes prevent traffic from hitting uninitialized pods and automatically restart deadlocked container processes.'
      }
    ]
  },

  'system-design-distributed-systems': {
    courseId: 'system-design-distributed-systems',
    courseTitle: 'System Design & Distributed Scalability',
    title: 'High-Scale Distributed Systems Architecture Assessment',
    category: 'Enterprise Architecture',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-sysdesign-architect',
      title: 'Principal Systems Architect',
      icon: '🏛️',
      color: '#f97316',
      tier: 'Executive',
      description: 'Mastered distributed consensus, horizontal partitioning, cache consistency, and CAP theorem.'
    },
    certificate: {
      courseCode: 'ARCH-10',
      title: 'Distributed Systems & Scalability Architect',
      skills: ['High-Throughput Load Balancing', 'Database Sharding & Replication', 'Distributed Caching Strategies', 'CAP Theorem & Eventual Consistency'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'According to the CAP Theorem, what tradeoff must a distributed system make in the presence of a network partition (P)?',
        options: [
          'It must choose between Consistency (all nodes see latest write) and Availability (every request receives a non-error response)',
          'It must choose between free pricing and paid pricing',
          'It must switch from JavaScript to C++',
          'It can achieve 100% Consistency, Availability, and Partition tolerance simultaneously'
        ],
        correctIndex: 0,
        explanation: 'When partitions occur across distributed networks, a system can either reject writes to guarantee consistency (CP) or accept writes risking inconsistency (AP).'
      },
      {
        id: 2,
        question: 'What is Consistent Hashing and why is it used in distributed caching clusters (e.g. Memcached, DynamoDB)?',
        options: [
          'A hashing technique that maps keys and nodes to a ring, minimizing key remapping when nodes join or leave',
          'A password hashing algorithm like bcrypt',
          'A protocol for compressing video files',
          'A method for verifying SSL certificates'
        ],
        correctIndex: 0,
        explanation: 'Consistent hashing avoids full cluster rehashing upon node scale-up or failure by affecting only a fraction (K/N) of keys.'
      },
      {
        id: 3,
        question: 'What is the Cache-Aside (Lazy Loading) pattern?',
        options: [
          'The application checks cache first; on miss, it reads from DB, updates cache, and returns the result',
          'The database writes directly to client browsers without servers',
          'Caching data only when the system is about to shut down',
          'Storing all user passwords in public memory'
        ],
        correctIndex: 0,
        explanation: 'Cache-Aside keeps memory footprint lean by loading only actively requested data into the caching layer.'
      },
      {
        id: 4,
        question: 'What is the purpose of Message Queues (Kafka, RabbitMQ) in distributed systems?',
        options: [
          'Decoupling producer and consumer workloads, smoothing traffic spikes, and ensuring asynchronous message delivery',
          'Formatting emails into HTML',
          'Rendering 3D animations in the browser',
          'Running database migrations automatically'
        ],
        correctIndex: 0,
        explanation: 'Message queues buffer and decouple asynchronous subsystems, isolating services from cascading failure cascades.'
      },
      {
        id: 5,
        question: 'What is the difference between Vertical Scaling and Horizontal Scaling?',
        options: [
          'Vertical adds more CPU/RAM to a single machine; Horizontal adds more commodity machines to distribute the load',
          'Vertical is always free; Horizontal requires credit cards',
          'Horizontal only works on mobile apps',
          'Vertical scaling has zero hardware limits'
        ],
        correctIndex: 0,
        explanation: 'Horizontal scaling achieves unbounded elasticity by distributing stateless workloads across clusters of nodes.'
      }
    ]
  },

  'flutter-crossplatform-apps': {
    courseId: 'flutter-crossplatform-apps',
    courseTitle: 'Flutter & Dart Cross-Platform Mobile',
    title: 'Flutter UI Composition & State Architecture Assessment',
    category: 'Mobile Engineering',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-flutter-engineer',
      title: 'Flutter Mobile Specialist',
      icon: '📱',
      color: '#38bdf8',
      tier: 'Professional',
      description: 'Mastered Flutter widget trees, Dart concurrency, BLoC/Provider state, and native bridge APIs.'
    },
    certificate: {
      courseCode: 'MOBILE-11',
      title: 'Cross-Platform Mobile Engineer',
      skills: ['Native Mobile Components', 'React Navigation Architecture', 'Device Storage & Async APIs', 'Mobile Performance Optimization'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'How does Flutter achieve consistent 60/120fps performance across iOS and Android?',
        options: [
          'It compiles Dart code to native ARM machine code and renders its own widget UI using Impeller/Skia engine',
          'It runs web pages inside a hidden native WebView component',
          'It translates Dart code into Swift or Kotlin at runtime',
          'It delegates all rendering to cloud GPU servers'
        ],
        correctIndex: 0,
        explanation: 'Flutter controls every pixel directly via its native graphics pipeline without depending on native platform OEM widgets.'
      },
      {
        id: 2,
        question: 'What is the difference between a `StatelessWidget` and a `StatefulWidget` in Flutter?',
        options: [
          'StatelessWidget is immutable and never rebuilds on its own; StatefulWidget maintains mutable State that triggers rebuilds via `setState()`',
          'StatelessWidget can only display text; StatefulWidget can only display images',
          'StatelessWidget cannot be compiled to iOS',
          'StatefulWidget does not use Dart'
        ],
        correctIndex: 0,
        explanation: 'StatefulWidget creates a persistent State object whose values can change dynamically during runtime.'
      },
      {
        id: 3,
        question: 'What is the purpose of the BLoC (Business Logic Component) pattern in Flutter?',
        options: [
          'Separating presentation UI from business logic using reactive Streams and Sink events',
          'Compressing Flutter apps into smaller APK sizes',
          'Encrypting local SQLite databases',
          'Generating App Store screenshots automatically'
        ],
        correctIndex: 0,
        explanation: 'BLoC standardizes reactive state by converting inbound user events into predictable outbound state streams.'
      },
      {
        id: 4,
        question: 'What is an `Isolate` in Dart?',
        options: [
          'A separate thread of execution with its own private memory heap, communicating via message ports',
          'A CSS flexbox container in web flutter',
          'A security sandbox for iOS in-app purchases',
          'An offline SQLite database table'
        ],
        correctIndex: 0,
        explanation: 'Dart is single-threaded per isolate. Heavy background CPU computations run inside separate Isolates without dropping UI frames.'
      },
      {
        id: 5,
        question: 'What does the `pubspec.yaml` file configure in a Flutter project?',
        options: [
          'Project metadata, external package dependencies, assets, and custom fonts',
          'The App Store pricing tier',
          'User database login credentials',
          'Server port numbers for HTTP endpoints'
        ],
        correctIndex: 0,
        explanation: 'pubspec.yaml is Flutter’s manifest for packages, asset registrations, environment constraints, and fonts.'
      }
    ]
  },

  'cybersecurity-ethical-hacking': {
    courseId: 'cybersecurity-ethical-hacking',
    courseTitle: 'Cybersecurity & Ethical Hacking',
    title: 'Penetration Testing & Web Security Certification Assessment',
    category: 'Security & Penetration Testing',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-security-specialist',
      title: 'Certified Ethical Security Specialist',
      icon: '🛡️',
      color: '#ef4444',
      tier: 'Professional',
      description: 'Mastered OWASP Top 10 defenses, SQL injection prevention, network analysis, and zero-trust authentication.'
    },
    certificate: {
      courseCode: 'SEC-12',
      title: 'Web Application Security & Penetration Testing Specialist',
      skills: ['OWASP Top 10 Mitigation', 'SQL Injection & XSS Defense', 'Cryptographic Token Security', 'Security Headers & Auditing'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'How do Parameterized Queries (Prepared Statements) prevent SQL Injection attacks?',
        options: [
          'They treat user inputs strictly as literal values rather than executable SQL commands, separating code from data',
          'They encrypt the entire database on every query',
          'They convert all letters in user inputs to lowercase',
          'They block all network requests from outside the country'
        ],
        correctIndex: 0,
        explanation: 'Prepared statements pre-compile the SQL template structure; user input can never alter query logic.'
      },
      {
        id: 2,
        question: 'What is the primary difference between Stored XSS and Reflected XSS?',
        options: [
          'Stored XSS persists malicious scripts permanently in the database; Reflected XSS immediately bounces malicious input off the web server in the current response',
          'Stored XSS only affects mobile phones',
          'Reflected XSS requires physical access to the server room',
          'Stored XSS happens exclusively over Wi-Fi'
        ],
        correctIndex: 0,
        explanation: 'Stored XSS targets all subsequent users viewing database content, whereas Reflected targets individuals clicking crafted links.'
      },
      {
        id: 3,
        question: 'What does the principle of "Least Privilege" mandate in enterprise infrastructure?',
        options: [
          'Every module, user, and service should only possess the minimum access rights strictly necessary to execute its function',
          'All employees should share the root administrator password',
          'Users must not be allowed to use computers during weekends',
          'Websites should have no passwords at all'
        ],
        correctIndex: 0,
        explanation: 'Least Privilege minimizes blast radiuses: if a service or token is breached, the attacker gains minimal leverage.'
      },
      {
        id: 4,
        question: 'What does a Cross-Site Request Forgery (CSRF) token verify?',
        options: [
          'That an incoming state-changing request originated intentionally from the authenticated application UI, not a third-party domain',
          'That the user has paid their monthly subscription',
          'That the user computer has a working camera',
          'That the server has enough free memory'
        ],
        correctIndex: 0,
        explanation: 'CSRF tokens are unpredictable secrets unique to the session that third-party attacker domains cannot read or forge.'
      },
      {
        id: 5,
        question: 'What makes bcrypt resistant to brute-force cracking attacks compared to MD5 or SHA-256?',
        options: [
          'It includes a configurable work factor (cost) and built-in cryptographic salt that makes computation deliberately slow and expensive',
          'It is written in Python instead of C',
          'It deletes the password after 24 hours',
          'It can be decrypted instantly with a master key'
        ],
        correctIndex: 0,
        explanation: 'bcrypt’s adaptive cost parameter forces attackers to spend billions of GPU operations, neutralizing rainbow tables and cracking.'
      }
    ]
  },

  'dsa-javascript-mastery': {
    courseId: 'dsa-javascript-mastery',
    courseTitle: 'Data Structures & Algorithms in JS',
    title: 'Algorithms & Complexity Mastery Assessment',
    category: 'Computer Science',
    passingScore: 80,
    timeMinutes: 10,
    badge: {
      id: 'badge-dsa-master',
      title: 'DSA Algorithm Master',
      icon: '⚡',
      color: '#eab308',
      tier: 'Mastery',
      description: 'Mastered asymptotic analysis, binary search trees, dynamic programming, and graph traversals.'
    },
    certificate: {
      courseCode: 'DSA-13',
      title: 'Data Structures & Algorithms Specialist',
      skills: ['Asymptotic Complexity Analysis', 'Trees, Graphs & Traversals', 'Dynamic Programming', 'Array & Hash Map Algorithmic Patterns'],
      issuer: 'APTIVELLA Platform'
    },
    questions: [
      {
        id: 1,
        question: 'What is the time complexity of searching in a balanced Binary Search Tree (BST) versus an unbalanced degenerate tree?',
        options: [
          'O(log n) for balanced BST; O(n) for degenerate unbalanced tree',
          'O(1) for both cases',
          'O(n^2) for balanced BST; O(log n) for unbalanced tree',
          'O(n!) factorial time'
        ],
        correctIndex: 0,
        explanation: 'A balanced BST halves the search space each step (O(log n)), but an unbalanced tree behaves like a linked list (O(n)).'
      },
      {
        id: 2,
        question: 'What data structure is utilized in Breadth-First Search (BFS) graph traversal?',
        options: ['Queue (FIFO)', 'Stack (LIFO)', 'Min Heap', 'Hash Set only'],
        correctIndex: 0,
        explanation: 'BFS explores vertices level-by-level using a FIFO Queue to ensure all neighbors at depth d are visited before depth d+1.'
      },
      {
        id: 3,
        question: 'What are the two core characteristics of problems suitable for Dynamic Programming (DP)?',
        options: [
          'Overlapping Subproblems and Optimal Substructure',
          'High memory usage and infinite loops',
          'Binary search and sorting',
          'Asynchronous promises and microtasks'
        ],
        correctIndex: 0,
        explanation: 'DP solves subproblems once and caches results when larger optimal solutions are composed of optimal subproblem solutions.'
      },
      {
        id: 4,
        question: 'What is the average time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(1)'],
        correctIndex: 0,
        explanation: 'QuickSort partitions arrays into halves around a pivot, yielding average O(n log n) comparisons.'
      },
      {
        id: 5,
        question: 'Why does finding cycle in a linked list using Floyd’s Cycle-Finding Algorithm (Tortoise & Hare) use O(1) auxiliary space?',
        options: [
          'It uses only two pointers (slow and fast) moving at different speeds without storing visited nodes in a hash set',
          'Because JavaScript automatically frees memory during loops',
          'Because linked lists do not store pointers',
          'It only runs on arrays'
        ],
        correctIndex: 0,
        explanation: 'The fast and slow pointer approach avoids allocating extra memory, detecting loops in O(n) time and O(1) space.'
      }
    ]
  }
};

/**
 * Complete Badges Catalog for the Platform
 */
export const ALL_BADGES = Object.values(COURSE_QUIZZES).map((quiz) => ({
  id: quiz.badge.id,
  courseId: quiz.courseId,
  courseTitle: quiz.courseTitle,
  title: quiz.badge.title,
  icon: quiz.badge.icon,
  color: quiz.badge.color,
  tier: quiz.badge.tier,
  description: quiz.badge.description,
  criteria: `Pass the ${quiz.courseTitle} assessment with ≥ ${quiz.passingScore}% score.`,
  certificateTitle: quiz.certificate.title
}));

/**
 * Retrieve the quiz configuration for a given course ID
 */
export function getQuizForCourse(courseId) {
  return COURSE_QUIZZES[courseId] || null;
}

/**
 * Retrieve the badge configuration for a given course ID
 */
export function getBadgeForCourse(courseId) {
  const quiz = COURSE_QUIZZES[courseId];
  return quiz ? quiz.badge : null;
}
