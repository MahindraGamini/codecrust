import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuestionDisplay({ question }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-500 text-white">
        <CardTitle className="flex justify-between items-center">
          <span>{question.title}</span>
          <span
            className={`px-2 py-1 rounded-full text-sm font-bold ${
              question.difficulty === "Easy"
                ? "bg-green-200 text-green-800"
                : question.difficulty === "Medium"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
            }`}
          >
            {question.difficulty}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4 text-gray-700">{question.description}</p>
        <h3 className="text-lg font-semibold mt-4 mb-2">Examples:</h3>
        {question.examples.map((example, index) => (
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
      </CardContent>
    </Card>
  )
}

