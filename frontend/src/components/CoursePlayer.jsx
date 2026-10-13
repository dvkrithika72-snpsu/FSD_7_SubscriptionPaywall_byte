import React from 'react';
import CourseNotesReader from './CourseNotesReader';

/**
 * CoursePlayer has been replaced by the comprehensive CourseNotesReader.
 * This re-export ensures zero broken imports across any legacy modules.
 */
export default function CoursePlayer(props) {
  return <CourseNotesReader {...props} />;
}
