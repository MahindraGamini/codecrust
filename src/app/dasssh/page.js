"use client"

import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertCircle, 
  Briefcase, 
  BarChart, 
  SendHorizontal 
} from "lucide-react";
import { useRouter } from "next/navigation";

function LandingPage() {
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const [errors, setErrors] = useState({
    position: "",
    level: ""
  });

  const route=useRouter();

  const validateForm = () => {
    let formErrors = {
      position: "",
      level: ""
    };

    if (!position.trim()) {
      formErrors.position = "Position is required";
    }

    if (!level) {
      formErrors.level = "Experience level is required";
    }

    setErrors(formErrors);
    return Object.values(formErrors).every(error => error === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        route.push('/')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center justify-center gap-2">
            <Briefcase className="w-6 h-6" />
            Job Search Portal
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Find your next career opportunity
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Position Input */}
            <div className="space-y-2">
              <Label htmlFor="position" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Position
              </Label>
              <Input
                type="text"
                id="position"
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                  setErrors(prev => ({...prev, position: ''}));
                }}
                placeholder="e.g., Frontend Developer"
                className={errors.position ? "border-destructive" : ""}
              />
              {errors.position && (
                <div className="text-destructive text-sm flex items-center gap-2 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.position}
                </div>
              )}
            </div>

            {/* Level Select */}
            <div className="space-y-2">
              <Label htmlFor="level" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Experience Level
              </Label>
              <Select 
                value={level} 
                onValueChange={(value) => {
                  setLevel(value);
                  setErrors(prev => ({...prev, level: ''}));
                }}
              >
                <SelectTrigger className={errors.level ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Career Stage</SelectLabel>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid-Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                    <SelectItem value="lead">Lead (8+ years)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.level && (
                <div className="text-destructive text-sm flex items-center gap-2 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.level}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <SendHorizontal className="mr-2 w-4 h-4" />
              Find Opportunities
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LandingPage;