import express from 'express';
import { authenticate, requirePro } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce both authentication and MongoDB-backed Pro subscription status
router.use(authenticate);
router.use(requirePro);

/**
 * @route   GET /api/premium/verify-entitlement
 * @desc    Verify current user has an active Pro subscription in MongoDB
 * @access  Private (Pro only)
 */
router.get('/verify-entitlement', (req, res) => {
  return res.status(200).json({
    ok: true,
    entitled: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
    subscription: req.user.subscription,
    verifiedAt: new Date(),
  });
});

/**
 * @route   GET /api/premium/courses/:courseId/content
 * @desc    Fetch exclusive full course solutions, source code and mentor notes
 * @access  Private (Pro only)
 */
router.get('/courses/:courseId/content', (req, res) => {
  const { courseId } = req.params;

  return res.status(200).json({
    ok: true,
    courseId,
    entitlement: 'pro_unlocked',
    premiumAssets: {
      githubRepository: `https://github.com/aptivella/${courseId}-pro-solutions`,
      starterCodeArchive: `https://assets.aptivella.io/archives/${courseId}-starter.zip`,
      completeSolutionArchive: `https://assets.aptivella.io/archives/${courseId}-complete-solution.zip`,
      mentorOfficeHoursSlots: [
        'Tuesday 18:00 UTC (Frontend Architecture)',
        'Thursday 19:30 UTC (System Design & Code Review)',
      ],
      exclusiveNotesPdf: `https://assets.aptivella.io/docs/${courseId}-master-cheat-sheet.pdf`,
    },
  });
});

/**
 * @route   GET /api/premium/resources
 * @desc    Fetch exclusive enterprise architecture boilerplates & guides
 * @access  Private (Pro only)
 */
router.get('/resources', (req, res) => {
  return res.status(200).json({
    ok: true,
    entitlement: 'pro_unlocked',
    resources: [
      {
        id: 'mern-prod-arch',
        title: 'Production MERN Stack Microservices Architecture Guide',
        format: 'PDF + Boilerplate',
        fileSize: '18.4 MB',
        downloadUrl: 'https://assets.aptivella.io/resources/mern-production-blueprint.zip',
      },
      {
        id: 'dsa-top75-patterns',
        title: 'LeetCode 75 Pattern Matrix & Algorithmic Templates',
        format: 'Interactive Cheat Sheet + Code Snippets',
        fileSize: '4.2 MB',
        downloadUrl: 'https://assets.aptivella.io/resources/dsa-top75-patterns.zip',
      },
      {
        id: 'fullstack-system-design',
        title: 'Enterprise Scalability & Distributed Caching Playbook',
        format: 'PDF Whitepaper',
        fileSize: '9.1 MB',
        downloadUrl: 'https://assets.aptivella.io/resources/distributed-caching-playbook.pdf',
      },
    ],
  });
});

export default router;
