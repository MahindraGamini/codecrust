"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Minimize2, Maximize2, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { QuestionDisplay } from "./question-display"
import { VideoRecorder } from "./Video-recording"

export default function InterviewEnvironment() {
  const { topic, id } = useParams()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [code, setCode] = useState("")
  const [thoughtProcess, setThoughtProcess] = useState("")
  const [output, setOutput] = useState("")

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/topic/${topic}/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch question")
        }
        const data = await response.json()
        setQuestion(data)
        setCode(data.starter_code || "")
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchQuestion()
    }
  }, [id, topic])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleRunCode = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/run_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const result = await response.json()
      setOutput(result.output)
    } catch (err) {
      setOutput("Error running code: " + err.message)
    }
  }

  if (loading) return <div className="p-4 text-blue-500">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!question) return <div className="p-4 text-red-500">Question not found.</div>

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800">{topic} Interview</h1>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <QuestionDisplay question={question} />

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Code Editor</span>
                <Button onClick={handleRunCode} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Editor
                height="300px"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{ minimap: { enabled: false } }}
              />
            </CardContent>
          </Card>

          <AnimatePresence>
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">{output}</pre>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card>
            <CardHeader>
              <CardTitle>Thought Process</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your thought process..."
                value={thoughtProcess}
                onChange={(e) => setThoughtProcess(e.target.value)}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <VideoRecorder />

      <div className="fixed bottom-6 right-6 space-y-2">
        <Button onClick={toggleFullscreen} className="rounded-full w-12 h-12 flex items-center justify-center">
          {isFullscreen ? <Minimize2 /> : <Maximize2 />}
        </Button>
      </div>
    </div>
  )
}

