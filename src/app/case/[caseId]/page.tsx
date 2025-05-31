
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Case } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, AlertTriangle, Info, CheckCircle, Search, AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/cases/StatusBadge"; // Ensure this path is correct

// Store mock cases in localStorage to persist new cases from form submission
const LOCAL_STORAGE_KEY = "findmenow_cases";

const MOCK_CASES_FALLBACK: Case[] = [
  {
    case_id: "MP-2025-000147",
    full_name: "Aisha Khan",
    last_known_location: "Clifton Beach, Karachi",
    date_last_seen: "2025-05-28",
    timestamp: "2025-05-29T10:00:00Z",
    region: "Karachi",
    status: "Investigating",
    priority_level: "High",
    age: 7,
    gender: "Female",
    clothing_description: "Pink shalwar kameez, white sandals.",
    appearance_description: "Shoulder-length black hair, brown eyes, small build.",
    distinguishing_features: "Small mole above her left eyebrow.",
    photoUrl: "https://placehold.co/150x150.png",
    generated_summary: "Aisha Khan, a 7-year-old female, was last seen at Clifton Beach, Karachi on May 28, 2025. She was wearing a pink shalwar kameez and white sandals. She has shoulder-length black hair, brown eyes, a small build, and a mole above her left eyebrow. The case is currently under investigation and is considered high priority due to the child's age.",
    recommendations: "1. Deploy search teams around Clifton Beach. 2. Review CCTV footage from the area and nearby areas. 3. Issue a public alert with Aisha's photo and description. 4. Contact local child welfare services."
  },
];


export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      setIsLoading(true);
      const storedCases = localStorage.getItem(LOCAL_STORAGE_KEY);
      let allCases: Case[] = MOCK_CASES_FALLBACK;
      if (storedCases) {
        allCases = JSON.parse(storedCases);
      }
      
      const foundCase = allCases.find(c => c.case_id === caseId);
      
      // If case is from submitted form (might not have case_id yet or a temp one)
      // This part needs careful handling if form submissions don't use the MP-XXXX-YYYYYY format immediately.
      // For simplicity, we assume case_id exists and is unique.
      // If the form submission passes data via query params or state management, that would be handled here too.

      setCaseData(foundCase || null);
      setIsLoading(false);
    }
  }, [caseId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Loading case details...</p></div>;
  }

  if (!caseData) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Case Not Found</h2>
        <p className="text-muted-foreground mb-6">The case ID "{caseId}" does not match any records.</p>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case List
          </Link>
        </Button>
      </div>
    );
  }
  
  const PriorityIcon = ({ level }: { level: Case['priority_level'] }) => {
    switch (level) {
      case 'High': return <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />;
      case 'Medium': return <Info className="h-5 w-5 text-orange-500 mr-2" />; // Changed to orange for medium
      case 'Low': return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />; // Changed to green for low
      default: return <AlertCircleIcon className="h-5 w-5 text-gray-500 mr-2" />;
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case List
        </Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <CardTitle className="font-headline text-3xl mb-2 sm:mb-0">{caseData.full_name}</CardTitle>
            <StatusBadge status={caseData.status} priority={caseData.priority_level} />
          </div>
          <CardDescription className="text-sm">
            Case ID: {caseData.case_id} | Reported on: {formatDate(caseData.timestamp, "PPPp")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1">
              <Image
                src={caseData.photoUrl || "https://placehold.co/300x300.png"}
                alt={`Photo of ${caseData.full_name}`}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full shadow-md"
                data-ai-hint="person photo"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <p><strong>Age:</strong> {caseData.age}</p>
              <p><strong>Gender:</strong> {caseData.gender}</p>
              <p><strong>Region:</strong> {caseData.region}</p>
              <p><strong>Date Last Seen:</strong> {formatDate(caseData.date_last_seen, "PPP")}</p>
              <p><strong>Last Known Location:</strong> {caseData.last_known_location}</p>
              <p><strong>Clothing Description:</strong> {caseData.clothing_description}</p>
              {caseData.appearance_description && <p><strong>Appearance:</strong> {caseData.appearance_description}</p>}
              {caseData.distinguishing_features && <p><strong>Distinguishing Features:</strong> {caseData.distinguishing_features}</p>}
            </div>
          </div>
          
          {caseData.generated_summary && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-xl mb-2 text-primary font-headline">AI Generated Case Report</h3>
              <div className="flex items-center text-md mb-3">
                  <PriorityIcon level={caseData.priority_level} />
                  Priority Level: <span className="font-semibold ml-1">{caseData.priority_level}</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Case Summary:</h4>
                <p className="whitespace-pre-wrap text-muted-foreground">{caseData.generated_summary}</p>
              </div>
            </div>
          )}
          {caseData.recommendations && (
             <div className="pt-2">
                <h4 className="font-semibold text-lg">Recommendations:</h4>
                <p className="whitespace-pre-wrap text-muted-foreground">{caseData.recommendations}</p>
              </div>
          )}

        </CardContent>
        <CardFooter>
          <Button variant="default" onClick={() => window.print()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="mr-2 h-4 w-4" />
            Download / Print Report (Simulated)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
