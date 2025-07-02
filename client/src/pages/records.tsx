import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CommentSection } from "@/components/CommentSection";
import { 
  Search, 
  Database, 
  Calendar, 
  User, 
  Heart, 
  Activity, 
  Target, 
  Eye,
  Copy,
  Share,
  ArrowLeft,
  MessageCircle
} from "lucide-react";
import { Link } from "wouter";

interface HealthProfile {
  id: number;
  name: string;
  age: number;
  gender: string;
  bodyWeight: string;
  dietaryHabit: string;
  healthProblem?: string;
  medication?: string;
  dailyActivities: string;
  healthGoal: string;
  aiAdvice: string;
  shareText: string;
  createdAt: string;
}

export default function Records() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<HealthProfile | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { toast } = useToast();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["/api/health-profiles/search", debouncedQuery],
    queryFn: async () => {
      const url = debouncedQuery.trim() 
        ? `/api/health-profiles/search?q=${encodeURIComponent(debouncedQuery.trim())}`
        : "/api/health-profiles";
      const response = await apiRequest("GET", url);
      return response.json();
    },
  });

  const handleCopyShareText = async (shareText: string) => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Share text has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text. Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'CURRENT_TIMESTAMP') {
      return 'Recently generated';
    }
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Date not available';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link href="/">
              <Button variant="outline" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Database className="h-8 w-8 text-secondary mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Health Profile Records</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search and view all saved health profiles and AI dietary recommendations
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, dietary habits, health goals, medications, or any other field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {profiles.length} record{profiles.length !== 1 ? 's' : ''} found
              {debouncedQuery && ` for "${debouncedQuery}"`}
            </p>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading health profiles...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && profiles.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {debouncedQuery ? "No matching records found" : "No health profiles saved yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {debouncedQuery 
                  ? "Try adjusting your search terms or browse all records"
                  : "Start by creating and saving your first health profile from the main page"
                }
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Health Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {!isLoading && profiles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile: HealthProfile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <User className="h-5 w-5 mr-2 text-secondary" />
                      {profile.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      ID: {profile.id}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    AI Result: {formatDate(profile.createdAt)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <span className="font-medium w-16">Age:</span>
                      <span>{profile.age} years old ({profile.gender})</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      <span className="font-medium mr-2">Goals:</span>
                      <span className="truncate">{profile.healthGoal}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Activity className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium mr-2">Activity:</span>
                      <span className="truncate">{profile.dailyActivities}</span>
                    </div>
                    {profile.healthProblem && (
                      <div className="text-sm">
                        <span className="font-medium text-orange-600">Health Concerns:</span>
                        <p className="text-gray-600 truncate">{profile.healthProblem}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => setSelectedProfile(profile)}
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleCopyShareText(profile.shareText)}
                      size="sm"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setSelectedProfile(profile)}
                      size="sm"
                      variant="outline"
                      className="text-secondary"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProfile && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center text-xl">
                    <User className="h-6 w-6 mr-2 text-secondary" />
                    {selectedProfile.name}'s Health Profile
                  </DialogTitle>
                  <DialogDescription>
                    AI Result Generated: {formatDate(selectedProfile.createdAt)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-medium text-gray-700">Age & Gender</label>
                      <p className="text-gray-900">{selectedProfile.age} years old, {selectedProfile.gender}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Body Weight</label>
                      <p className="text-gray-900">{selectedProfile.bodyWeight}</p>
                    </div>
                  </div>

                  {/* Health Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="font-medium text-gray-700">Dietary Habits</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedProfile.dietaryHabit}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Daily Activities</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedProfile.dailyActivities}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Health Goals</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedProfile.healthGoal}</p>
                    </div>
                    {selectedProfile.healthProblem && (
                      <div>
                        <label className="font-medium text-gray-700">Health Problems</label>
                        <p className="text-gray-900 bg-red-50 p-3 rounded">{selectedProfile.healthProblem}</p>
                      </div>
                    )}
                    {selectedProfile.medication && (
                      <div>
                        <label className="font-medium text-gray-700">Current Medications</label>
                        <p className="text-gray-900 bg-blue-50 p-3 rounded">{selectedProfile.medication}</p>
                      </div>
                    )}
                  </div>

                  {/* AI Advice */}
                  <div>
                    <label className="font-medium text-gray-700 flex items-center mb-2">
                      <Target className="h-4 w-4 mr-2 text-secondary" />
                      AI Dietary Recommendations
                    </label>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-gray-900 text-sm">{selectedProfile.aiAdvice}</pre>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => handleCopyShareText(selectedProfile.shareText)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Complete Share Text
                    </Button>
                    <Button
                      onClick={() => setSelectedProfile(null)}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-8 pt-6 border-t">
                    <CommentSection healthProfileId={selectedProfile.id} />
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}