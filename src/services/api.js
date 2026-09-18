// frontend/src/services/api.js (Client-side upload handler example)
export async function uploadAndGenerateQuiz(file, questionCount, difficulty) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('questionCount', questionCount);
  formData.append('difficulty', difficulty);

  const token = localStorage.getItem('token');
  const response = type => fetch('/api/v1/upload-quiz', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const res = await response();
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to generate quiz');
  }
  
  return data;
}