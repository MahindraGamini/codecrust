from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy.video.io.VideoFileClip import VideoFileClip
import cv2
import os
import assemblyai as aai

aai.settings.api_key = "1f33e6a5967d4c90aab5e05f3c34dc53"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/extract_audio_video', methods=['POST'])
def extract_audio_and_analyze():
    try:
        video_file = request.files.get('file')
        if not video_file:
            return jsonify({"error": "No video file provided"}), 400

        video_path = "uploaded_video.mp4"
        video_file.save(video_path)

        audio_output_path = "extracted_audio.wav"
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_output_path)

        cap = cv2.VideoCapture(video_path)
        frame_dir = "frames"

        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
          
            
            frame_count += 1

        cap.release()

        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(audio_output_path)

        if transcript.status == aai.TranscriptStatus.error:
            return jsonify({"error": "Transcription failed", "details": transcript.error}), 500

        word_confidences = [word.confidence for word in transcript.words if word.confidence is not None]
        average_confidence = sum(word_confidences) / len(word_confidences) if word_confidences else 0

        confidence_feedback = "Good" if average_confidence > 0.8 else "Needs Improvement"

        return jsonify({
            "message": "Audio and frames extracted successfully.",
            "audio_transcription": transcript.text,
            "average_confidence": average_confidence * 100,
            "confidence_feedback": confidence_feedback,
            "frame_count": frame_count,
            "frame_directory": frame_dir
        })

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)