
"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Hospital as HospitalIcon, UserMd, Stethoscope, MapPin, Phone, Globe, Search, Loader2, Lightbulb, Building } from 'lucide-react';
import { getHospitalSuggestions, HospitalSuggestionInputSchema, type HospitalSuggestionInput, type HospitalSuggestionOutput } from '@/ai/flows/hospital-suggestion-flow';
import { hospitalData } from '@/lib/placeholder-data';
import type { Hospital, Doctor, Service } from '@/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = HospitalSuggestionInputSchema;
type FormData = HospitalSuggestionInput;

export default function HospitalsPage() {
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<HospitalSuggestionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptomsOrNeeds: '',
      preferredSpecialty: '',
      locationPreference: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoadingSuggestions(true);
    setAiSuggestions(null);
    setError(null);
    try {
      const result = await getHospitalSuggestions(data);
      setAiSuggestions(result);
    } catch (err) {
      console.error("Error getting hospital suggestions:", err);
      setError("Sorry, we couldn't fetch suggestions at this time. Please try again later.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const renderHospitalCard = (hospital: Hospital) => (
    <Card key={hospital.id} className="shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <Image
          src={hospital.imageUrl}
          alt={hospital.name}
          width={600}
          height={300}
          className="w-full h-48 object-cover rounded-t-lg"
          data-ai-hint={hospital['data-ai-hint'] || 'hospital exterior'}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1">{hospital.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1.5" />
          <span>{hospital.address}</span>
        </div>

        {hospital.phone && (
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Phone className="h-4 w-4 mr-1.5" />
            <a href={`tel:${hospital.phone}`} className="hover:underline">{hospital.phone}</a>
          </div>
        )}
        {hospital.website && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Globe className="h-4 w-4 mr-1.5" />
            <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Website</a>
          </div>
        )}
        
        <Separator className="my-3" />

        <h4 className="font-semibold text-sm mb-1.5">Services:</h4>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hospital.services.slice(0, 3).map(service => (
            <Badge key={service.id} variant="secondary">{service.name}</Badge>
          ))}
          {hospital.services.length > 3 && <Badge variant="outline">+{hospital.services.length - 3} more</Badge>}
        </div>

        <h4 className="font-semibold text-sm mb-1.5">Featured Doctors:</h4>
        <div className="space-y-2">
          {hospital.doctors.slice(0, 2).map(doctor => (
            <div key={doctor.id} className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={doctor.avatarUrl} alt={doctor.name} data-ai-hint={doctor['data-ai-hint'] || 'doctor portrait'} />
                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-10">
        <header className="pb-6 border-b">
          <div className="flex items-center space-x-3">
            <HospitalIcon className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Find Hospitals & Specialists</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Get AI-powered suggestions or browse our directory.
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="lg:col-span-1 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center">
                <Search className="mr-2 h-5 w-5 text-primary" />
                Get AI Suggestions
              </CardTitle>
              <CardDescription>Describe your needs, and our AI will suggest relevant services or specialists.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="symptomsOrNeeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms or Needs</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'persistent knee pain', 'need a pediatrician for my child', 'annual check-up'"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredSpecialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Specialty (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cardiology, Dermatology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Preference (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Anytown, Near downtown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoadingSuggestions}>
                    {isLoadingSuggestions ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting Suggestions...
                      </>
                    ) : (
                      "Find Help"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {isLoadingSuggestions && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="ml-4 text-lg text-muted-foreground">Finding best matches for you...</p>
              </div>
            )}
            {error && (
              <Card className="bg-destructive/10 border-destructive text-destructive-foreground p-6">
                <CardTitle className="text-lg">Error</CardTitle>
                <p>{error}</p>
              </Card>
            )}
            {aiSuggestions && aiSuggestions.suggestions.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-headline flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                    Our AI Recommends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiSuggestions.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold text-md text-primary">{suggestion.serviceOrSpecialty}</h3>
                      {suggestion.relevantHospitalName && (
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Building className="h-3 w-3 mr-1.5"/> Possible facility: {suggestion.relevantHospitalName}
                        </p>
                      )}
                      {suggestion.suggestedDoctorName && (
                        <p className="text-sm text-muted-foreground flex items-center">
                           <UserMd className="h-3 w-3 mr-1.5"/> Consider Dr. {suggestion.suggestedDoctorName}
                        </p>
                      )}
                      <p className="text-sm mt-1">{suggestion.reason}</p>
                    </div>
                  ))}
                  {aiSuggestions.additionalAdvice && (
                    <p className="text-sm text-muted-foreground mt-4 pt-3 border-t">
                      <strong>Note:</strong> {aiSuggestions.additionalAdvice}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
             {aiSuggestions && aiSuggestions.suggestions.length === 0 && !isLoadingSuggestions && (
               <Card className="text-center p-8">
                <CardTitle className="text-xl font-semibold mb-2">No Specific Suggestions Found</CardTitle>
                <p className="text-muted-foreground mb-4">
                  {aiSuggestions.additionalAdvice || "We couldn't pinpoint specific suggestions based on your input. Try rephrasing or explore the general listings below."}
                </p>
              </Card>
            )}
          </div>
        </section>

        <Separator className="my-10" />
        
        <section className="space-y-6">
          <header>
            <h2 className="text-2xl font-bold font-headline text-primary">Browse Hospitals</h2>
            <p className="text-md text-muted-foreground mt-1">
              Explore available hospitals and clinics in our network.
            </p>
          </header>
          {hospitalData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitalData.map(hospital => renderHospitalCard(hospital))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HospitalIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">No hospitals listed at the moment.</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for new additions.</p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
