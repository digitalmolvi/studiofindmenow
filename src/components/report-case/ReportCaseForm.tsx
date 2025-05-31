
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Download, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn, fileToDataUri, formatDate } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import { generateCaseSummary, type CaseSummaryInput, type CaseSummaryOutput } from "@/ai/flows/generate-case-summary";
import type { CaseFormData, GeneratedCaseReport } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";


const formSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters."),
  age: z.coerce.number().min(0, "Age must be a positive number.").max(120),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required."}),
  last_known_location: z.string().min(5, "Last known location is required."),
  date_last_seen: z.date({ required_error: "Date last seen is required."}),
  region: z.string().min(2, "Region is required."), // e.g., Province or major city in Pakistan
  clothing_description: z.string().min(10, "Clothing description is required."),
  appearance_description: z.string().optional(),
  photo: z.instanceof(FileList).optional(),
  distinguishing_features: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing.",
  }),
});

export default function ReportCaseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedCaseReport | null>(null);
  const [submittedCaseData, setSubmittedCaseData] = useState<CaseFormData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      age: undefined,
      last_known_location: "",
      region: "",
      clothing_description: "",
      appearance_description: "",
      distinguishing_features: "",
      consent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedReport(null);
    setSubmittedCaseData(values);

    let photoDataUri: string | undefined = undefined;
    if (values.photo && values.photo.length > 0) {
      try {
        photoDataUri = await fileToDataUri(values.photo[0]);
      } catch (error) {
        console.error("Error converting photo to data URI:", error);
        toast({
          variant: "destructive",
          title: "Photo Processing Error",
          description: "Could not process the uploaded photo. Please try again or upload a different photo.",
        });
        setIsLoading(false);
        return;
      }
    }

    const aiInput: CaseSummaryInput = {
      full_name: values.full_name,
      age: values.age,
      gender: values.gender as 'Male' | 'Female' | 'Other', // Zod enum ensures this
      last_known_location: values.last_known_location,
      date_last_seen: formatDate(values.date_last_seen, "yyyy-MM-dd"),
      clothing_description: values.clothing_description,
      appearance_description: values.appearance_description,
      photoDataUri: photoDataUri,
      distinguishing_features: values.distinguishing_features,
      consent: values.consent,
    };

    try {
      const report = await generateCaseSummary(aiInput);
      setGeneratedReport(report);
      toast({
        title: "Report Generated Successfully",
        description: "The case summary and recommendations are now available.",
      });
    } catch (error) {
      console.error("Error generating case summary:", error);
      toast({
        variant: "destructive",
        title: "AI Report Generation Failed",
        description: "An error occurred while generating the case report. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 2MB.",
        });
        setPhotoPreview(null);
        form.setValue('photo', undefined); // Reset file input in form
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };
  
  const PriorityIcon = ({ level }: { level: GeneratedCaseReport['priority_level'] }): ReactNode => {
    switch (level) {
      case 'High': return <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />;
      case 'Medium': return <Info className="h-5 w-5 text-yellow-500 mr-2" />;
      case 'Low': return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />;
      default: return null;
    }
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Report a Missing Person</CardTitle>
          <CardDescription>
            Please provide as much detail as possible. All information is handled with care.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ahmed Ali" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_last_seen"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Last Seen</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_known_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Known Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Anarkali Bazaar, Lahore" {...field} />
                      </FormControl>
                      <FormDescription>Provide as specific location as possible.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region / Province / City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Punjab or Karachi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clothing_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clothing Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Blue shalwar kameez, black shoes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appearance_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appearance Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Short black hair, brown eyes, medium build"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distinguishing_features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distinguishing Features (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Scar on left cheek, birthmark on arm, specific mole"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo (Optional, Max 2MB)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/jpeg, image/png" 
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handlePhotoChange(e);
                        }}
                      />
                    </FormControl>
                    {photoPreview && (
                      <div className="mt-2">
                        <Image src={photoPreview} alt="Photo preview" width={100} height={100} className="rounded-md object-cover" data-ai-hint="person photo" />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to the processing of this data for the purpose of finding the missing person.
                      </FormLabel>
                      <FormDescription>
                        This information will be used in accordance with privacy laws.
                      </FormDescription>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  "Submit and Generate Report"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedReport && submittedCaseData && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Generated Case Report</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
                <PriorityIcon level={generatedReport.priority_level} />
                Priority Level: <span className="font-semibold ml-1">{generatedReport.priority_level}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Case Details:</h3>
              <p><strong>Name:</strong> {submittedCaseData.full_name}</p>
              <p><strong>Age:</strong> {submittedCaseData.age}</p>
              <p><strong>Gender:</strong> {submittedCaseData.gender}</p>
              <p><strong>Region:</strong> {submittedCaseData.region}</p>
              <p><strong>Date Last Seen:</strong> {formatDate(submittedCaseData.date_last_seen, "PPP")}</p>
              <p><strong>Last Known Location:</strong> {submittedCaseData.last_known_location}</p>
              {photoPreview && <Image src={photoPreview} alt="Submitted photo" width={150} height={150} className="rounded-md my-2 object-cover" data-ai-hint="person photo"/>}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Case Summary:</h3>
              <p className="whitespace-pre-wrap">{generatedReport.case_summary}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Recommendations:</h3>
              <p className="whitespace-pre-wrap">{generatedReport.recommendations}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.print()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Download className="mr-2 h-4 w-4" />
              Download / Print Report (Simulated)
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
