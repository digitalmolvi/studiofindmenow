"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Case } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import Link from "next/link";
import Image from "next/image";
import { Eye, Download } from "lucide-react";
import { daysAgo, formatDate } from "@/lib/utils";

interface CaseListTableProps {
  cases: Case[];
}

export default function CaseListTable({ cases }: CaseListTableProps) {
  if (cases.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No cases found matching your criteria.</p>;
  }

  return (
    <div className="rounded-lg border shadow-sm bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Photo</TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Days Ago</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Status & Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((c) => (
            <TableRow key={c.case_id}>
              <TableCell>
                <Image
                  src={c.photoUrl || "https://placehold.co/60x60.png"}
                  alt={c.full_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  data-ai-hint="person photo"
                />
              </TableCell>
              <TableCell className="font-medium">{c.case_id}</TableCell>
              <TableCell>{c.full_name}</TableCell>
              <TableCell>{formatDate(c.date_last_seen, "MMM dd, yyyy")}</TableCell>
              <TableCell>{daysAgo(c.date_last_seen)}</TableCell>
              <TableCell>{c.region}</TableCell>
              <TableCell>
                <StatusBadge status={c.status} priority={c.priority_level} />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/case/${c.case_id}`}>
                    <Eye className="mr-1 h-3.5 w-3.5" /> View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
