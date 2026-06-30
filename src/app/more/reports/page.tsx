"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiService } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Download, Plus, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function ReportsContent() {
  const { toast } = useToast();
  const [reports, setReports] = useState<any[]>([]);
  const [template, setTemplate] = useState("Term Academic Performance");
  const [format, setFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");
  const [compiling, setCompiling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await apiService.getReports();
        setReports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    fetchReports();
  }, []);

  const handleCompile = async () => {
    setCompiling(true);
    try {
      const newRep = await apiService.generateReport(template, format);
      setReports(prev => [newRep, ...prev]);
      toast({
        title: "Report Compiled",
        description: `"${newRep.name}" is now ready.`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setCompiling(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Reports Compilation Exporter</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Compile aggregate school logs, class averages, and student progress indices.</p>
      </div>

      {/* Compiler controls */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-205 pb-3">
          <CardTitle className="text-sm font-bold text-gray-800">Generate Audit Document Sheets</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="template" className="text-xs font-bold text-gray-650">Select Audit Template</Label>
              <select
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2.5"
              >
                <option value="Term Academic Performance">Term Academic Performance</option>
                <option value="Attendance Log Summary">Attendance Log Summary</option>
                <option value="At-Risk Retention Audit">At-Risk Retention Audit</option>
                <option value="Platform Engagement Metrics">Platform Engagement Metrics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-650">Output format</Label>
              <div className="flex gap-2">
                {["PDF", "Excel", "CSV"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt as any)}
                    className={cn(
                      "flex-1 h-10 rounded-xl border text-xs font-bold transition-all",
                      format === fmt ? "bg-blue-50 border-blue-500 text-blue-700 font-extrabold" : "bg-white border-gray-300 text-gray-650 hover:bg-secondary/40"
                    )}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleCompile}
            disabled={compiling}
            className="w-full bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-11 px-4 text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
          >
            {compiling ? (
              <>
                <Plus className="h-4 w-4 animate-spin" />
                Compiling database fields...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Compile Audit Sheet
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* History List */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-sm font-bold text-gray-800">Generated Reports History</CardTitle>
          <CardDescription className="text-xs text-gray-500 font-semibold font-mono">Download link access logs</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="w-full animate-pulse">
              <div className="border-b border-gray-200 bg-gray-50/50 h-11 flex items-center px-6">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 w-1/3">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-150 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-10"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4 sm:px-6">Document Name</th>
                    <th className="py-2.5 px-4">Size</th>
                    <th className="py-2.5 px-4">Compiled At</th>
                    <th className="py-2.5 px-4 text-center">Format</th>
                    <th className="py-2.5 px-4 sm:px-6 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 sm:px-6 font-bold text-gray-850 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{rep.name}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-500">{rep.size}</td>
                      <td className="py-3 px-4 font-semibold text-gray-500 font-mono">{rep.generatedAt}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                          {rep.format}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            toast({
                              title: "Saving File",
                              description: `Saving ${rep.name}.${rep.format.toLowerCase()}`,
                            });
                          }}
                          className="h-8 w-8 text-blue-650 hover:bg-blue-50 rounded-lg"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

export default function ReportsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <ReportsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
