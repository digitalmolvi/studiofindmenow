
"use client";

import CaseListTable from "@/components/cases/CaseListTable";
import CaseFilters, { type CaseFiltersState } from "@/components/cases/CaseFilters";
import type { Case } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { daysAgo, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

// Mock data for cases with Pakistani regions
const MOCK_CASES: Case[] = [
  {
    case_id: "MP-2025-000147",
    full_name: "Aisha Khan",
    last_known_location: "Clifton Beach, Karachi",
    date_last_seen: "2025-05-28",
    timestamp: "2025-05-29T10:00:00Z",
    days_ago_custom: daysAgo("2025-05-28"),
    region: "Karachi",
    status: "Investigating",
    priority_level: "High",
    age: 7,
    gender: "Female",
    clothing_description: "Pink shalwar kameez, white sandals.",
    appearance_description: "Shoulder-length black hair, brown eyes, small build.",
    distinguishing_features: "Small mole above her left eyebrow.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Aisha Khan, a 7-year-old female, was last seen at Clifton Beach, Karachi on May 28, 2025. She was wearing a pink shalwar kameez and white sandals. She has shoulder-length black hair, brown eyes, a small build, and a mole above her left eyebrow. The case is currently under investigation and is considered high priority due to the child's age.",
    recommendations: "1. Deploy search teams around Clifton Beach. 2. Review CCTV footage from the area and nearby areas. 3. Issue a public alert with Aisha's photo and description. 4. Contact local child welfare services."
  },
  {
    case_id: "MP-2025-000148",
    full_name: "Ali Hassan",
    last_known_location: "Liberty Market, Lahore",
    date_last_seen: "2025-05-20",
    timestamp: "2025-05-21T14:30:00Z",
    days_ago_custom: daysAgo("2025-05-20"),
    region: "Lahore",
    status: "New",
    priority_level: "Medium",
    age: 22,
    gender: "Male",
    clothing_description: "Blue jeans, black t-shirt with a cricket team logo, grey backpack.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Ali Hassan, 22, male, last seen at Liberty Market, Lahore on May 20, 2025. Case priority is medium.",
    recommendations: "Check local markets, contact friends and family."
  },
  {
    case_id: "MP-2025-000149",
    full_name: "Fatima Bibi",
    last_known_location: "Faisal Mosque, Islamabad",
    date_last_seen: "2024-03-15",
    timestamp: "2024-03-16T09:00:00Z",
    days_ago_custom: daysAgo("2024-03-15"),
    region: "Islamabad",
    status: "Found",
    priority_level: "Low",
    age: 35,
    gender: "Female",
    clothing_description: "Green traditional dress, carrying a handbag.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Fatima Bibi, 35, female, last seen at Faisal Mosque, Islamabad on March 15, 2024. Status: Found. Priority: Low.",
    recommendations: "Close case file."
  },
  {
    case_id: "MP-2025-000150",
    full_name: "Usman Malik",
    last_known_location: "Saddar Bazaar, Rawalpindi",
    date_last_seen: "2025-06-01",
    timestamp: "2025-06-02T11:00:00Z",
    days_ago_custom: daysAgo("2025-06-01"),
    region: "Rawalpindi",
    status: "Investigating",
    priority_level: "Medium",
    age: 45,
    gender: "Male",
    clothing_description: "Kurta and pajama.",
    appearance_description: "Salt and pepper hair, wears glasses.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Usman Malik, 45, male, was last seen at Saddar Bazaar, Rawalpindi. He was wearing a kurta and pajama. The case is currently under investigation and is considered medium priority.",
    recommendations: "1. Check local CCTV. 2. Interview shopkeepers. 3. Analyze phone records."
  },
  {
    case_id: "MP-2025-000151",
    full_name: "Zoya Ahmed",
    last_known_location: "Tariq Road, Karachi",
    date_last_seen: "2025-06-05",
    timestamp: "2025-06-06T09:15:00Z",
    days_ago_custom: daysAgo("2025-06-05"),
    region: "Karachi",
    status: "New",
    priority_level: "High",
    age: 16,
    gender: "Female",
    clothing_description: "Red and black college uniform, carrying a blue backpack.",
    appearance_description: "Long black hair, usually in a ponytail, wears glasses.",
    distinguishing_features: "Faint scar on her right forearm.",
    photoUrl: "https://placehold.co/100x100.png",
    generated_summary: "Zoya Ahmed, 16, female, last seen near Tariq Road, Karachi on June 5, 2025. Case is new and high priority.",
    recommendations: "Contact college authorities, check social media activity, inform local police stations covering Tariq Road."
  }
];

// Changed key to ensure fresh data load, avoiding stale localStorage
const LOCAL_STORAGE_KEY = "findmenow_cases_pk_v1";

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
      try {
        const parsedCases = JSON.parse(storedCases);
        if (Array.isArray(parsedCases) && parsedCases.every(c => c.case_id && c.full_name && c.region)) {
          setAllCases(parsedCases);
        } else {
          // Stored data is invalid or doesn't match expected structure, reset with MOCK_CASES
          setAllCases(MOCK_CASES);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_CASES));
        }
      } catch (e) {
        // If parsing fails, reset to default mock cases
        console.error("Failed to parse cases from localStorage, resetting.", e);
        setAllCases(MOCK_CASES);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_CASES));
      }
    } else {
      // No cases in localStorage, initialize with MOCK_CASES
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
