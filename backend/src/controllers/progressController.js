import Progress from '../models/Progress.js';

/**
 * Get reading progress, completed topics, and bookmarks for a course
 * GET /api/progress/:courseId
 */
export async function getCourseProgress(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(200).json({
        ok: true,
        courseId,
        completedTopics: [],
        bookmarks: [],
        lastReadTopic: null,
        percentComplete: 0,
        quizScore: null,
        quizPassed: false,
        certificateEarned: false,
        certificateId: null,
        badgeEarned: false,
      });
    }

    return res.status(200).json({
      ok: true,
      courseId,
      completedTopics: progress.completedTopics || [],
      bookmarks: progress.bookmarks || [],
      lastReadTopic: progress.lastReadTopic || null,
      percentComplete: progress.percentComplete || 0,
      quizScore: progress.quizScore,
      quizPassed: progress.quizPassed || false,
      certificateEarned: progress.certificateEarned || false,
      certificateId: progress.certificateId || null,
      certificateIssuedAt: progress.certificateIssuedAt,
      badgeEarned: progress.badgeEarned || false,
      updatedAt: progress.updatedAt,
    });
  } catch (error) {
    console.error('getCourseProgress error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve course reading progress',
    });
  }
}

/**
 * Toggle topic completion status
 * POST /api/progress/:courseId/toggle-complete
 * Body: { topicKey: string, totalTopicsCount?: number }
 */
export async function toggleTopicCompleted(req, res) {
  try {
    const { courseId } = req.params;
    const { topicKey, totalTopicsCount } = req.body;
    const userId = req.user._id;

    if (!topicKey) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'topicKey is required',
      });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedTopics: [topicKey],
        bookmarks: [],
        lastReadTopic: topicKey,
      });
    } else {
      const idx = progress.completedTopics.indexOf(topicKey);
      if (idx > -1) {
        progress.completedTopics.splice(idx, 1);
      } else {
        progress.completedTopics.push(topicKey);
      }
      progress.lastReadTopic = topicKey;
    }

    if (totalTopicsCount && totalTopicsCount > 0) {
      progress.percentComplete = Math.min(
        100,
        Math.round((progress.completedTopics.length / totalTopicsCount) * 100)
      );
    }

    await progress.save();

    return res.status(200).json({
      ok: true,
      courseId,
      completedTopics: progress.completedTopics,
      isCompleted: progress.completedTopics.includes(topicKey),
      percentComplete: progress.percentComplete,
    });
  } catch (error) {
    console.error('toggleTopicCompleted error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update topic completion status',
    });
  }
}

/**
 * Toggle topic bookmark
 * POST /api/progress/:courseId/toggle-bookmark
 * Body: { topicKey: string }
 */
export async function toggleTopicBookmark(req, res) {
  try {
    const { courseId } = req.params;
    const { topicKey } = req.body;
    const userId = req.user._id;

    if (!topicKey) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'topicKey is required',
      });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedTopics: [],
        bookmarks: [topicKey],
        lastReadTopic: topicKey,
      });
    } else {
      const idx = progress.bookmarks.indexOf(topicKey);
      if (idx > -1) {
        progress.bookmarks.splice(idx, 1);
      } else {
        progress.bookmarks.push(topicKey);
      }
    }

    await progress.save();

    return res.status(200).json({
      ok: true,
      courseId,
      bookmarks: progress.bookmarks,
      isBookmarked: progress.bookmarks.includes(topicKey),
    });
  } catch (error) {
    console.error('toggleTopicBookmark error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update topic bookmark',
    });
  }
}

/**
 * Update user's last read topic
 * POST /api/progress/:courseId/last-read
 * Body: { topicKey: string }
 */
export async function setLastReadTopic(req, res) {
  try {
    const { courseId } = req.params;
    const { topicKey } = req.body;
    const userId = req.user._id;

    if (!topicKey) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'topicKey is required',
      });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedTopics: [],
        bookmarks: [],
        lastReadTopic: topicKey,
      });
    } else {
      progress.lastReadTopic = topicKey;
    }

    await progress.save();

    return res.status(200).json({
      ok: true,
      courseId,
      lastReadTopic: progress.lastReadTopic,
    });
  } catch (error) {
    console.error('setLastReadTopic error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to record last read topic',
    });
  }
}

/**
 * Submit quiz score and award certificate + badge on pass
 * POST /api/progress/:courseId/quiz
 * Body: { score: number, totalQuestions: number, passed: boolean }
 */
export async function submitCourseQuiz(req, res) {
  try {
    const { courseId } = req.params;
    const { score, totalQuestions = 5, passed } = req.body;
    const userId = req.user._id;

    if (score === undefined || score === null) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Score is required',
      });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedTopics: [],
        bookmarks: [],
      });
    }

    progress.quizScore = score;
    progress.quizCompletedAt = new Date();

    const isPassed = passed ?? (score >= Math.ceil(totalQuestions * 0.7));
    progress.quizPassed = isPassed;

    if (isPassed) {
      if (!progress.certificateId) {
        const cleanCode = courseId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
        const randId = Math.floor(10000 + Math.random() * 90000);
        progress.certificateId = `APT-2026-${cleanCode}-${randId}`;
        progress.certificateIssuedAt = new Date();
      }
      progress.certificateEarned = true;
      progress.badgeEarned = true;
    }

    await progress.save();

    return res.status(200).json({
      ok: true,
      courseId,
      quizScore: progress.quizScore,
      quizPassed: progress.quizPassed,
      certificateEarned: progress.certificateEarned,
      certificateId: progress.certificateId,
      certificateIssuedAt: progress.certificateIssuedAt,
      badgeEarned: progress.badgeEarned,
    });
  } catch (error) {
    console.error('submitCourseQuiz error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit course quiz and issue certification',
    });
  }
}

/**
 * Get all earned certificates and badges for the user
 * GET /api/progress/user/achievements
 */
export async function getUserAchievements(req, res) {
  try {
    const userId = req.user._id;

    const allProgress = await Progress.find({
      userId,
      $or: [{ certificateEarned: true }, { badgeEarned: true }, { quizPassed: true }],
    });

    const achievements = allProgress.map((p) => ({
      courseId: p.courseId,
      quizScore: p.quizScore,
      quizPassed: p.quizPassed,
      certificateEarned: p.certificateEarned,
      certificateId: p.certificateId,
      certificateIssuedAt: p.certificateIssuedAt,
      badgeEarned: p.badgeEarned,
    }));

    return res.status(200).json({
      ok: true,
      achievements,
    });
  } catch (error) {
    console.error('getUserAchievements error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve achievements',
    });
  }
}

