import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    completedTopics: {
      type: [String],
      default: [],
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    lastReadTopic: {
      type: String,
      default: null,
    },
    percentComplete: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizScore: {
      type: Number,
      default: null,
    },
    quizPassed: {
      type: Boolean,
      default: false,
    },
    quizCompletedAt: {
      type: Date,
      default: null,
    },
    certificateEarned: {
      type: Boolean,
      default: false,
    },
    certificateId: {
      type: String,
      default: null,
    },
    certificateIssuedAt: {
      type: Date,
      default: null,
    },
    badgeEarned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
