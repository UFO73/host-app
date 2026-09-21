const viewerOrigin = import.meta.env.VITE_VIEWER_ORIGIN || 'http://localhost:3000';

const studyInstanceUid = '1.3.6.1.4.1.14519.5.2.1.267424821384663813780850856506829388886';

export const viewerConfig = `${viewerOrigin}/viewer?StudyInstanceUIDs=${studyInstanceUid}`;
