"use client";

import CaseListTable from "@/components/cases/CaseListTable";
import CaseFilters, { type CaseFiltersState } from "@/components/cases/CaseFilters";
import type { Case } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { daysAgo, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

// Mock data for cases
const MOCK_CASES: Case[] = [
  {
    case_id: "MP-2025-000147",
    full_name: "Anaya Singh",
    last_known_location: "Mumbai Central Station",
    date_last_seen: "2025-05-28",
    timestamp: "2025-05-29T10:00:00Z",
    days_ago_custom: daysAgo("2025-05-28"), // For display
    region: "Mumbai",
    status: "Investigating",
    priority_level: "High",
    age: 7,
    gender: "Female",
    clothing_description: "Red frock with white polka dots, white sandals.",
    appearance_description: "Shoulder-length black hair, brown eyes, small build.",
    distinguishing_features: "Small mole above her left eyebrow.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Anaya Singh, a 7-year-old female, was last seen at Mumbai Central Station on May 28, 2025. She was wearing a red frock with white polka dots and white sandals. She has shoulder-length black hair, brown eyes, a small build, and a mole above her left eyebrow. The case is currently under investigation and is considered high priority due to the child's age.",
    recommendations: "1. Deploy search teams around Mumbai Central Station. 2. Review CCTV footage from the station and nearby areas. 3. Issue a public alert with Anaya's photo and description. 4. Contact local child welfare services."
  },
  {
    case_id: "MP-2025-000148",
    full_name: "Rohan Sharma",
    last_known_location: "Pune University Campus",
    date_last_seen: "2025-05-20",
    timestamp: "2025-05-21T14:30:00Z",
    days_ago_custom: daysAgo("2025-05-20"),
    region: "Pune",
    status: "New",
    priority_level: "Medium",
    age: 22,
    gender: "Male",
    clothing_description: "Blue jeans, black t-shirt with a band logo, grey backpack.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Rohan Sharma, 22, male, last seen at Pune University Campus on May 20, 2025. Case priority is medium.",
    recommendations: "Check university records, contact friends and family."
  },
  {
    case_id: "MP-2025-000149",
    full_name: "Priya Patel",
    last_known_location: "Chennai Marina Beach",
    date_last_seen: "2024-03-15",
    timestamp: "2024-03-16T09:00:00Z",
    days_ago_custom: daysAgo("2024-03-15"),
    region: "Chennai",
    status: "Found",
    priority_level: "Low",
    age: 35,
    gender: "Female",
    clothing_description: "Yellow saree, carrying a handbag.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Priya Patel, 35, female, last seen at Chennai Marina Beach on March 15, 2024. Status: Found. Priority: Low.",
    recommendations: "Close case file."
  },
  {
    case_id: "MP-2025-000150",
    full_name: "Vikram Reddy",
    last_known_location: "Hyderabad IT Park",
    date_last_seen: "2025-06-01",
    timestamp: "2025-06-02T11:00:00Z",
    days_ago_custom: daysAgo("2025-06-01"),
    region: "Hyderabad",
    status: "Investigating",
    priority_level: "Medium",
    age: 45,
    gender: "Male",
    clothing_description: "Formal shirt and trousers.",
    appearance_description: "Salt and pepper hair, wears glasses.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Vikram Reddy, 45, male, was last seen at Hyderabad IT Park. He was wearing formal attire. The case is currently under investigation and is considered medium priority.",
    recommendations: "1. Check office CCTV. 2. Interview colleagues. 3. Analyze phone records."
  },
];

// Store mock cases in localStorage to persist new cases from form submission
const LOCAL_STORAGE_KEY = "findmenow_cases";

export default function CaseListPage() {
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [filters, setFilters] = useState<CaseFiltersState>({
    region: "",
    dateRange: undefined,
    status: "all",
  });

  useEffect(() => {
    const storedCases = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCases) {
      setAllCases(JSON.parse(storedCases));
    } else {
      setAllCases(MOCK_CASES);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_CASES));
    }
  }, []);


  const filteredCases = useMemo(() => {
    return allCases.filter((c) => {
      const filterRegion = filters.region.toLowerCase();
      const caseRegion = c.region.toLowerCase();
      const filterStatus = filters.status.toLowerCase();
      const caseStatus = c.status.toLowerCase();

      const regionMatch = filterRegion ? caseRegion.includes(filterRegion) : true;
      const statusMatch = filterStatus !== "all" ? caseStatus === filterStatus : true;
      
      let dateMatch = true;
      if (filters.dateRange?.from) {
        const caseDate = new Date(c.date_last_seen);
        if (filters.dateRange.to) {
          dateMatch = caseDate >= filters.dateRange.from && caseDate <= filters.dateRange.to;
        } else {
          dateMatch = caseDate >= filters.dateRange.from;
        }
      }
      return regionMatch && statusMatch && dateMatch;
    });
  }, [allCases, filters]);

  const handleFilterChange = (newFilters: CaseFiltersState) => {
    setFilters(newFilters);
  };
  
  // Add this effect to listen for custom event when new case is submitted
  useEffect(() => {
    const handleNewCaseReported = (event: Event) => {
      const customEvent = event as CustomEvent<Case>;
      setAllCases(prevCases => {
        const updatedCases = [customEvent.detail, ...prevCases];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCases));
        return updatedCases;
      });
    };

    window.addEventListener('newCaseReported', handleNewCaseReported);
    return () => {
      window.removeEventListener('newCaseReported', handleNewCaseReported);
    };
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-headline text-foreground">Previously Reported Cases</h2>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/report-case">
            <PlusCircle className="mr-2 h-5 w-5" />
            Report New Case
          </Link>
        </Button>
      </div>
      <CaseFilters onFilterChange={handleFilterChange} initialFilters={filters} />
      <CaseListTable cases={filteredCases} />
    </div>
  );
}
