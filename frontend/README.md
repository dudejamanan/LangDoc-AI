# வாசிப்பு நண்பன் (Vaasippu Nanban) — Reading Friend

Frontend for the GDG VIT Chennai × Gemma 4 Hackathon, track **Intelligence with Purpose**.

A camera-first web app that lets elderly and low-literacy users photograph a government/bank/hospital document and get it explained in simple Tamil or Hindi, read aloud.

## Stack

- React + Vite (JavaScript, no TypeScript)
- Tailwind CSS
- Framer Motion
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`) — on your phone, use the "Network" URL Vite prints, since the camera capture flow is easiest to test on a real device.

## Project structure

```
src/
  components/
    Header.jsx            top banner with app name
    LanguageSelector.jsx  Tamil / Hindi picker
    UploadBox.jsx         take photo / upload photo + preview
    LoadingScreen.jsx     animated "understanding your document" sequence
    ResultCard.jsx        single rounded result card (document type, summary, etc.)
    AudioPlayer.jsx       autoplaying spoken explanation
  services/
    api.js                explainDocument() — currently returns dummy data
  content.js               all on-screen Tamil/Hindi copy in one place
  App.jsx                  screen flow: welcome → language → upload → loading → result
```

## Connecting the real backend

`src/services/api.js` currently resolves with dummy data after a 2.5s delay so the full flow can be demoed without a backend. Once the FastAPI + Gemma 4 backend is ready, replace the body of `explainDocument` with a real `fetch('/api/explain', { method: 'POST', body: formData })` call — the commented-out version is already written at the top of the file. No other file needs to change, since every component only consumes the resolved object:

```js
{
  document_type: string,
  summary: string,
  action_required: string,
  deadline: string,
  english_gloss: string,
  audio_url: string,
}
```

## Notes

- `public/sample.mp3` is referenced by the dummy API response as a placeholder audio file — drop any short mp3 there (or point `audio_url` at a real backend URL) to hear autoplay in action.
- Design targets senior citizens: large 60px+ tap targets, big type, high contrast, minimal scrolling, calm blue/white palette with warm amber and clay accents for emphasis.
- Tested down to a 390px mobile viewport; layout is mobile-first and centers on a max-width column on larger screens.
