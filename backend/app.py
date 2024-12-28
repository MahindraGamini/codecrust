from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy.video.io.VideoFileClip import VideoFileClip
import os
import assemblyai as aai

# Configure AssemblyAI
aai.settings.api_key = "1f33e6a5967d4c90aab5e05f3c34dc53"

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": ""}})
app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024  

@app.route('/extract_audio_video', methods=['POST'])
def extract_audio_and_analyze():
    try:
        # Check if file is provided
        video_file = request.files.get('file')
        if not video_file or video_file.filename == '':
            print("No video file received")
            return jsonify({"error": "No video file provided"}), 400

        # Save uploaded video
        video_path = "uploaded_video.mp4"
        video_file.save(video_path)
        print(f"Video saved at {video_path}")

        # Extract audio from the video
        audio_output_path = "extracted_audio.wav"
        try:
            video = VideoFileClip(video_path)
            video.audio.write_audiofile(audio_output_path)
            print(f"Audio extracted to {audio_output_path}")
        except Exception as e:
            print(f"Error extracting audio: {str(e)}")
            return jsonify({"error": "Error processing video", "details": str(e)}), 500

        # Transcribe audio using AssemblyAI
        try:
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(audio_output_path)
            print(f"Transcription successful: {transcript.text}")
        except Exception as e:
            print(f"Error during transcription: {str(e)}")
            return jsonify({"error": "Transcription failed", "details": str(e)}), 500

        return jsonify({
            "message": "Audio extracted and transcribed successfully",
            "transcription": transcript.text
        })

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':  
    app.run(debug=True)
