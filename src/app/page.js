"use client";

import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Minimize2, Maximize2 } from "lucide-react";

export default function InterviewEnvironment() {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [code, setCode] = useState(`def two_sum(nums, target):\n    # Your solution here\n    pass`);
  const [thoughtProcess, setThoughtProcess] = useState("");
  const [output, setOutput] = useState("");

  const problem = {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
    ],
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("An error occurred while accessing the camera. Please try again.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraStream(null);
      setIsCameraOn(false);
    }
  };

  const startRecording = () => {

    const options = { mimeType: "video/webm; codecs=vp9" };
    const mediaRecorder = new MediaRecorder(cameraStream, options);

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = handleRecordingStop;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordingStop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    uploadRecording(blob);
    setRecordedChunks([]);
  };

  const uploadRecording = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
      const response = await fetch(" http://127.0.0.1:5000/extract_audio_video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload recording.");

      alert("Recording uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload recording.");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      stopCamera();
    };
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    console.log("Running code:", code);

    try {
      const result = await mockRunPythonCode(code);
      setOutput(result);
    } catch (err) {
      setOutput("Error running code: " + err.message);
    }
  };

  const mockRunPythonCode = (code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code.includes("two_sum")) {
          resolve("[0, 1]");
        } else {
          reject(new Error("Code execution error"));
        }
      }, 1000);
    });
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-grow flex">
        <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
        </div>

        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex-grow mb-4 border rounded">
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          {output && (
            <div className="mt-6 p-4 border-t bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Output:</h3>
              <pre className="bg-gray-800 text-white p-3 rounded-md">{output}</pre>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Thought Process</h3>
            <Textarea
              placeholder="Write down your problem-solving approach, key insights, and reasoning..."
              value={thoughtProcess}
              onChange={(e) => setThoughtProcess(e.target.value)}
              className="w-full min-h-[150px]"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2 px-4">
        <Button
          onClick={isCameraOn ? stopCamera : startCamera}
          variant={isCameraOn ? "destructive" : "default"}
        >
          <Camera />
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </Button>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"}
          disabled={!isCameraOn}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Button onClick={toggleFullscreen} variant="outline">
          {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
        <Button variant="outline" onClick={() => setCode("")}>
          Reset
        </Button>
        <Button onClick={handleRunCode}>Run Code</Button>
      </div>
    </div>
  );
}
