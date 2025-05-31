"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";

export interface CaseFiltersState {
  region: string;
  dateRange: DateRange | undefined;
  status: string;
}

interface CaseFiltersProps {
  onFilterChange: (filters: CaseFiltersState) => void;
  initialFilters?: Partial<CaseFiltersState>;
}

const initialFilterState: CaseFiltersState = {
  region: "",
  dateRange: undefined,
  status: "all",
};

export default function CaseFilters({ onFilterChange, initialFilters }: CaseFiltersProps) {
  const [filters, setFilters] = useState<CaseFiltersState>({
    ...initialFilterState,
    ...initialFilters,
  });

  const handleInputChange = (name: keyof CaseFiltersState, value: any) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleDateRangeChange = (date: DateRange | undefined) => {
    const newFilters = { ...filters, dateRange: date };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
    onFilterChange(initialFilterState);
  };

  const hasActiveFilters = filters.region !== "" || filters.dateRange !== undefined || filters.status !== "all";

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-headline flex items-center">
          <Filter className="mr-2 h-5 w-5 text-primary" />
          Filter Cases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="region-filter">Region</Label>
            <Input
              id="region-filter"
              placeholder="e.g., Mumbai"
              value={filters.region}
              onChange={(e) => handleInputChange("region", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="date-range-filter">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range-filter"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Investigating">Investigating</SelectItem>
                <SelectItem value="Found">Found</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
             <Button onClick={clearFilters} variant="ghost" className="w-full lg:w-auto self-end text-accent hover:text-accent-foreground">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Need to import Card, CardHeader, CardTitle, CardContent from ui/card
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
