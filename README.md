# AI Voice Calling Application

This project consists of a Next.js frontend dashboard and a FastAPI Python backend that orchestrates automated, multi-lingual AI voice calls via Exotel, Deepgram, ElevenLabs, OpenAI, and Gemini.

## 🚀 How to Run the Frontend

The frontend is a Next.js application using Tailwind CSS.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ How to Run the Backend

The backend is built with Python and FastAPI.

1. Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your Python virtual environment. (If you are using the existing `v` environment in `C:\Faisal\v`):
   ```bash
   C:\Faisal\v\Scripts\activate
   ```
3. Run the FastAPI backend server:
   ```bash
   python -m app.main
   ```
The backend will now be running on `http://127.0.0.1:8000`.

---

## 🌐 How to Expose the Backend to Exotel (Important)

Because Exotel needs a public URL to send the live call audio to your local computer, you **must** run `localtunnel` alongside your backend.

1. Open a **third** terminal and navigate to the root folder.
2. Run localtunnel on port 8000:
   ```bash
   npx localtunnel --port 8000
   ```
3. Copy the URL it generates (e.g., `https://some-random-words.loca.lt`).
4. **Update Exotel Dashboard**:
   - Go to your Exotel Dashboard -> Applets -> **VoiceAi** Applet.
   - Change the Webhook URL to: `https://<YOUR_NEW_URL>/api/v1/exotel/inbound`
   - Save the Applet.

*Note: You must update the Exotel Applet URL every time you restart localtunnel, because localtunnel generates a new random URL each time.*
