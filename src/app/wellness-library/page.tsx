"use client";

import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import { curatedWellnessResources } from '@/lib/placeholder-data';
import type { WellnessResource } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

export default function WellnessLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = useMemo(() => {
    const allCategories = ['all', ...new Set(curatedWellnessResources.map(r => r.category.toLowerCase()))];
    return allCategories.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
  }, []);
  
  const types = useMemo(() => {
    const allTypes = ['all', ...new Set(curatedWellnessResources.map(r => r.type.toLowerCase()))];
    return allTypes.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }));
  }, []);

  const filteredResources = useMemo(() => {
    return curatedWellnessResources.filter(resource => {
      const matchesSearchTerm = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || resource.category.toLowerCase() === selectedCategory;
      const matchesType = selectedType === 'all' || resource.type.toLowerCase() === selectedType;
      return matchesSearchTerm && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedType]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b">
          <h1 className="text-4xl font-bold font-headline text-primary">Wellness Library</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Explore a rich collection of articles, videos, and tips to support your wellbeing.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-card rounded-lg shadow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
               <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No resources found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
