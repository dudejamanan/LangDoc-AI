// services/api.js
//
// Talks to the backend that explains an uploaded document.
// Right now the backend isn't ready, so `explainDocument` resolves with
// dummy data after a short delay to simulate a real network + AI call.
//
// When the backend is ready, replace the body of `explainDocument` with:
//
// export async function explainDocument(imageFile, language) {
//   const formData = new FormData()
//   formData.append('image', imageFile)
//   formData.append('language', language)
//
//   const response = await fetch('/api/explain', {
//     method: 'POST',
//     body: formData,
//   })
//
//   if (!response.ok) {
//     throw new Error('Failed to explain document')
//   }
//
//   return response.json()
// }
//
// The shape of the resolved object must match what ResultCard/AudioPlayer
// expect (see DUMMY_RESPONSE below) — that contract will not change.

const DUMMY_RESPONSE = {
  document_type: 'Pension Notice',
  summary:
    'This document is related to your old age pension application.',
  action_required: 'Visit Taluk Office with Aadhaar card.',
  deadline: '15 August 2026',
  priority: 'High',
  urgency_reason: 'Your pension payments will be paused if this is not submitted before the deadline.',
  estimated_time: '20 minutes',
  documents_required: 'Aadhaar card, pension passbook, one passport-size photo.',
  key_points:
    'Bring Aadhaar card and this notice. Visit before the deadline. Pension amount will be updated after verification.',
  english_gloss:
    'This document explains your pension application process.',
  audio_url: '/static/audio/output.wav',
}

/**
 * Sends a photographed document to the backend for explanation.
 * @param {File|null} imageFile - the photographed/uploaded document image
 * @param {'ta'|'hi'} language - the language the explanation should be in
 * @returns {Promise<{document_type:string, summary:string, action_required:string, deadline:string, priority:string, urgency_reason:string, estimated_time:string, documents_required:string, key_points:string, english_gloss:string, audio_url:string}>}
 */
export function explainDocument(imageFile, language) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_RESPONSE)
    }, 2500)
  })
}

// Once the backend is ready, replace the body of `askQuestion` with:
//
// export async function askQuestion(question, documentContext, language) {
//   const response = await fetch('/api/ask', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       question,
//       language,
//       document_type: documentContext?.document_type,
//       summary: documentContext?.summary,
//       action_required: documentContext?.action_required,
//       deadline: documentContext?.deadline,
//       priority: documentContext?.priority,
//       urgency_reason: documentContext?.urgency_reason,
//       estimated_time: documentContext?.estimated_time,
//       documents_required: documentContext?.documents_required,
//       key_points: documentContext?.key_points,
//     }),
//   })
//
//   if (!response.ok) {
//     throw new Error('Failed to get an answer')
//   }
//
//   return response.json()
// }
//
// The shape of the resolved object must match what VoiceQA expects
// (see DUMMY_ANSWER below) — that contract will not change.

const DUMMY_ANSWER = {
  answer_text:
    'You need to bring your Aadhaar card and this notice to the Taluk Office before the deadline shown above.',
  audio_url: '/static/audio/output.wav',
}

/**
 * Sends a follow-up question about an already-explained document to the
 * backend, along with enough of the original explanation to give Gemma
 * context (no need to re-send the image).
 * @param {string} question - the transcribed spoken (or typed) question
 * @param {{document_type:string, summary:string, action_required:string, deadline:string, priority:string, urgency_reason:string, estimated_time:string, documents_required:string, key_points:string}} documentContext
 * @param {'ta'|'hi'|'en'} language - the language the answer should be in
 * @returns {Promise<{answer_text:string, audio_url:string}>}
 */
export function askQuestion(question, documentContext, language) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_ANSWER)
    }, 1800)
  })
}
