import { Card, CardContent } from "@/components/ui/card"
import { Code2, VideoIcon, BookOpen } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">DSA Problems Solved</h3>
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Recordings</h3>
              <VideoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">7</div>
              <p className="text-xs text-muted-foreground mt-1">
                +1 from last week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Study Materials</h3>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">32</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5 from last week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card className="w-full md:col-span-2">
          <CardContent className="p-6 min-h-[400px]">
          
          </CardContent>
        </Card>
        <Card className="w-full md:col-span-1">
          <CardContent className="p-6 min-h-[400px]">
           
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
