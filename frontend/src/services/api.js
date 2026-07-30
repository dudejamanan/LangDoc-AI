// services/api.js
//
// Talks to the backend that explains an uploaded document.

const API_BASE = "https://langdoc-ai.onrender.com";

/**
 * Sends a photographed document to the backend for explanation.
 * @param {File|null} imageFile
 * @param {'ta'|'hi'} language
 */
export async function explainDocument(imageFile, language) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("language", language);

  const response = await fetch(`${API_BASE}/api/explain`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to explain document");
  }

  const data = await response.json();

  return {
    session_id: data.session_id,
    document_type: data.document?.document_type || "",
    summary: data.document?.summary || "",
    action_required: data.document?.action_required || "",
    deadline: data.document?.deadline || "",
    priority: data.document?.priority || "",
    urgency_reason: data.document?.urgency_reason || "",
    estimated_time: data.document?.estimated_time || "",
    documents_required: data.document?.documents_required || "",
    key_points: Array.isArray(data.document?.key_points)
      ? data.document.key_points.join(". ")
      : data.document?.key_points || "",
    english_gloss: data.document?.english_gloss || "",
    audio_url: data.audio_url || "",
    sections: data.document?.sections || [],
    document_category: data.document?.document_category || "document",
  };
}

/**
 * Sends a follow-up question about an already-explained document.
 * @param {string} question
 * @param {string} sessionId
 */
export async function askQuestion(question, sessionId) {
  const response = await fetch(`${API_BASE}/api/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      question,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get an answer");
  }

  const data = await response.json();

  return {
    answer_text: data.answer || "",
    audio_url: data.audio_url || "",
  };
}

/**
 * Starts or continues the step-by-step guide.
 * @param {string} sessionId
 * @param {"start"|"next"} action
 */
export async function guideForm(sessionId, action) {
  const response = await fetch(`${API_BASE}/api/guide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      action,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get guide step");
  }

  return await response.json();
}
