import httpx
import math
from app.core.config import settings

def transcribe_audio_chunk(audio_bytes: bytes) -> str:
    """
    Sends raw audio stream chunk to Deepgram for speech-to-text.
    In development/mock mode, this acts as a placeholder or receives
    transcripts from simulated clients.
    """
    if not settings.DEEPGRAM_API_KEY:
        # Mock mode
        return ""
        
    try:
        # For real-time streaming, Deepgram is typically connected via direct WebSocket.
        # This is a fallback HTTP request representation.
        # Exotel streams 8000Hz 16-bit Linear PCM
        url = "https://api.deepgram.com/v1/listen?model=nova-2&detect_language=true&encoding=linear16&sample_rate=8000"
        headers = {
            "Authorization": f"Token {settings.DEEPGRAM_API_KEY}",
            "Content-Type": "audio/x-raw"
        }
        response = httpx.post(url, headers=headers, content=audio_bytes, timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            return data.get("results", {}).get("channels", [{}])[0].get("alternatives", [{}])[0].get("transcript", "")
    except Exception as e:
        print(f"Deepgram STT error: {e}")
    return ""


def synthesize_speech(text: str, voice_style: str = "Professional Female") -> bytes:
    """
    Converts text response into audio bytes (16-bit Linear PCM, 8000Hz, Mono, Little-Endian) for Exotel.
    If ElevenLabs API is not configured, generates a mock sine-wave sound pattern in 16-bit PCM.
    """
    if not settings.ELEVENLABS_API_KEY:
        # Return mock 16-bit PCM audio stream chunk (sine wave)
        return generate_mock_pcm_sine_wave(duration_seconds=1.5)
        
    try:
        # Map voice settings to ElevenLabs free-tier premade voice IDs
        voice_id = "EXAVITQu4vr4xnSDxMaL"  # Sarah (Premade Female)
        if "Male" in voice_style:
            voice_id = "IKne3meq5aSn9XLyUdCD"  # Charlie (Premade Male)
            
        # Request pcm_8000 format from ElevenLabs
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream?output_format=pcm_8000"
        headers = {
            "xi-api-key": settings.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "accept": "audio/pcm"
        }
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        # Fetch PCM audio from ElevenLabs
        response = httpx.post(url, json=payload, headers=headers, timeout=10.0)
        if response.status_code == 200:
            print(f"✅ ElevenLabs TTS Success! Generated {len(response.content)} bytes of PCM audio.")
            return response.content
        else:
            print(f"❌ ElevenLabs TTS Failed! Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        print(f"❌ ElevenLabs TTS Exception: {e}")
        
    print("⚠️ Playing fallback mock beep sound...")
    return generate_mock_pcm_sine_wave(duration_seconds=1.5)


def generate_mock_pcm_sine_wave(duration_seconds: float = 1.0) -> bytes:
    """
    Generates a mock 16-bit linear PCM encoded sine wave (8000Hz, mono, little-endian).
    This outputs a beep tone so the user can verify call flow audio connectivity.
    """
    import math
    sample_rate = 8000
    frequency = 440  # A4 note
    num_samples = int(sample_rate * duration_seconds)
    pcm_data = bytearray()
    
    for i in range(num_samples):
        # Generate PCM sine wave value between -32768 and 32767
        t = i / sample_rate
        sample = int(32767 * math.sin(2 * math.pi * frequency * t))
        # Pack 16-bit signed integer in little-endian format (2 bytes)
        pcm_data.extend(sample.to_bytes(2, byteorder='little', signed=True))
        
    return bytes(pcm_data)
