import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getCourseProgress,
  toggleTopicCompleted,
  toggleTopicBookmark,
  setLastReadTopic,
  submitCourseQuiz,
  getUserAchievements,
} from '../controllers/progressController.js';

const router = express.Router();

// All progress endpoints require authentication
router.use(authenticate);

// Get user achievements (certificates and badges) across all courses
router.get('/user/achievements', getUserAchievements);

// Get progress and bookmarks for course
router.get('/:courseId', getCourseProgress);

// Toggle completion on a topic
router.post('/:courseId/toggle-complete', toggleTopicCompleted);

// Toggle bookmark on a topic
router.post('/:courseId/toggle-bookmark', toggleTopicBookmark);

// Set last read topic
router.post('/:courseId/last-read', setLastReadTopic);

// Submit quiz score and award certificate + badge on pass
router.post('/:courseId/quiz', submitCourseQuiz);

export default router;

