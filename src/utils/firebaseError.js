const MESSAGES = {
  'permission-denied': '저장 권한이 없어요. Firebase 콘솔의 Firestore 보안 규칙이 게시됐는지 확인해주세요.',
  unavailable: '네트워크 연결을 확인해주세요.',
  unauthenticated: '로그인이 풀렸어요. 다시 로그인해주세요.'
}

export function describeFirestoreError(err) {
  const code = err?.code?.replace('firestore/', '')
  return MESSAGES[code] || `저장 중 오류가 발생했어요 (${err?.code || err?.message || '알 수 없는 오류'})`
}
