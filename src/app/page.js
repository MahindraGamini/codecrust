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
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [code, setCode] = useState(`def two_sum(nums, target):\n    # Your solution here\n    pass`);
  const [thoughtProcess, setThoughtProcess] = useState("");

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
      if (err.name === "NotAllowedError") {
        alert("Please grant camera and microphone access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        alert("No camera or microphone found.");
      } else {
        alert("An error occurred while accessing the camera. Please try again later.");
      }
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

  const handleRunCode = () => {
    console.log("Running code:", code);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-grow flex">
        <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{problem.title}</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-bold ${
                    problem.difficulty === "Easy"
                      ? "bg-green-200 text-green-800"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{problem.description}</p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Examples:</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded mb-2">
                  <p>
                    <strong>Input:</strong> {example.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {example.output}
                  </p>
                  {example.explanation && (
                    <p>
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              ))}

              <h3 className="text-lg font-semibold mt-4 mb-2">Constraints:</h3>
              <ul className="list-disc pl-5">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex-grow mb-4 border rounded">
            <Editor
              height="60%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>

        
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

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-black rounded-full shadow-lg overflow-hidden border border-gray-300">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${!isCameraOn ? "hidden" : ""}`}
        />
        {!isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Camera Off
          </div>
        )}
      </div>

    
      <div className="mt-4 flex justify-end space-x-2 px-4">
        <Button
          onClick={isCameraOn ? stopCamera : startCamera}
          variant={isCameraOn ? "destructive" : "default"}
        >
          <Camera className="left-0" />
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </Button>
        <Button onClick={toggleFullscreen} variant="outline">
          {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
        <Button variant="outline" onClick={() => setCode("")}>Reset</Button>
        <Button onClick={handleRunCode}>Run Code</Button>
      </div>
    </div>
  );
}
