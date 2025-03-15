import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <div className="aspect-video bg-muted">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
