import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ManualInput } from "@/components/ManualInput";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, ChartBar, Sprout, Image, Settings, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FertilizerRecommendation } from "@/components/FertilizerRecommendation";

interface AnalysisResult {
  pestName?: string;
  confidence?: number;
  severity?: "low" | "medium" | "high";
  recommendations?: {
    pesticides: Array<{ name: string; description: string }>;
    fertilizers: Array<{ name: string; description: string }>;
  };
}

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Detected: ${data.pestName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Backend integration will be added here
      toast({
        title: "Data received",
        description: "Analysis will be integrated soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFF0]">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#1A1A1A]">
            Agricultural Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload an image of the pest affecting your crops or enter crop conditions manually.
            We'll help identify pests and provide sustainable solutions.
          </p>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 bg-white/50">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Image Upload
            </TabsTrigger>
            <TabsTrigger value="fertilizer" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manual Input 
            </TabsTrigger>
            <TabsTrigger value="yield" className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Yield Prediction
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-6">
            <div className="space-y-6">
              <ImageUpload onImageUpload={handleImageUpload} isLoading={loading} />
              {result && (
                <div className="max-w-2xl mx-auto bg-white/80 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Detected Pest</p>
                      <p className="font-medium">{result.pestName}</p>
                    </div>
                    {result.recommendations?.pesticides.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recommended Pesticides</p>
                        <ul className="space-y-2">
                          {result.recommendations.pesticides.map((pesticide, index) => (
                            <li key={index} className="bg-green-50 p-3 rounded">
                              <p className="font-medium">{pesticide.name}</p>
                              <p className="text-sm text-gray-600">{pesticide.description}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fertilizer" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                <FertilizerRecommendation />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="yield" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                <ManualInput onSubmit={handleManualSubmit} isLoading={loading} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <Card className="bg-white/80 hover:bg-white/90 transition-colors">
            <CardContent className="p-6 flex items-center space-x-4">
              <Cloud className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-medium">Weather Forecast</h3>
                <p className="text-sm text-gray-500">Check local weather conditions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 hover:bg-white/90 transition-colors">
            <CardContent className="p-6 flex items-center space-x-4">
              <ChartBar className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-medium">Yield Estimate</h3>
                <p className="text-sm text-gray-500">View predicted crop yield</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
