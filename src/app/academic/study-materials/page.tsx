"use client";

import { useState } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, Download, Plus, Eye, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockMaterials = [
  { id: 1, name: "Algebra Formulas and Reference Sheet.pdf", subject: "Mathematics", grade: "Grade 10", size: "2.4 MB", type: "PDF" },
  { id: 2, name: "Organic Chemistry Revision Notes.pdf", subject: "Science", grade: "Grade 10", size: "3.1 MB", type: "PDF" },
  { id: 3, name: "Nepal Constitution Summary Notes.docx", subject: "Social Studies", grade: "Grade 9", size: "1.2 MB", type: "DOCX" },
  { id: 4, name: "Java Basics and Syntax Guide.pdf", subject: "Computer Science", grade: "Grade 8", size: "4.5 MB", type: "PDF" }
];

function StudyMaterialsContent() {
  const { toast } = useToast();
  const [list, setList] = useState(mockMaterials);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">Study Materials Library</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Distribute learning assets, reference guides, lecture notes, and syllabus PDFs.</p>
        </div>
        <Button 
          onClick={() => {
            toast({
              title: "Feature Unavailable",
              description: "File uploading is coming in Phase 2 integration.",
            });
          }}
          className="rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-10 px-4 text-xs sm:text-sm shadow-sm flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Directory Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((file) => (
          <Card key={file.id} className="border-gray-300 bg-white hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-250 pb-3 flex flex-row items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <Badge className="bg-blue-50 text-blue-750 border border-blue-200 font-extrabold text-[9px] uppercase rounded px-2">
                  {file.subject}
                </Badge>
                <CardTitle className="text-xs sm:text-sm font-bold text-gray-800 truncate leading-snug">{file.name}</CardTitle>
                <CardDescription className="text-[10px] font-semibold text-gray-500">{file.grade} • {file.size} • {file.type}</CardDescription>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl shrink-0">
                <FolderOpen className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex justify-end gap-2.5">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Opening Previewer",
                    description: `Viewing "${file.name}" online...`,
                  });
                }}
                className="h-9 rounded-lg text-xs font-bold border-gray-300 hover:bg-secondary/40 text-gray-700 bg-white flex items-center gap-1"
              >
                <Eye className="h-3.5 w-3.5 text-gray-500" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Download Dispatched",
                    description: `Downloading "${file.name}"`,
                  });
                }}
                className="h-9 rounded-lg text-xs font-bold border-gray-300 hover:bg-secondary/40 text-gray-700 bg-white flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5 text-gray-500" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

export default function StudyMaterialsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <StudyMaterialsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
