import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ManualInput } from "@/components/ManualInput";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Image, Settings, BarChart2 } from "lucide-react";
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

const severityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-primary/10 text-primary border-primary/20",
};

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setResult(null);
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
        title: "Analysis complete",
        description: `Detected: ${data.pestName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Couldn't process that image. Please try again.",
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
        description: "Couldn't process that data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AgroVision</span>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Pest ID · Yield · Fertilizer guidance
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="container max-w-5xl py-10 sm:py-14 space-y-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Identify crop pests, predict yield, plan fertilizer
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-[60ch]">
              Upload a photo of the pest affecting your crop, or enter field conditions
              manually. We'll identify the pest and suggest pesticides, or estimate yield
              and fertilizer needs.
            </p>
          </div>

          <Tabs defaultValue="image" className="w-full">
            <TabsList className="h-auto w-full max-w-xl justify-start gap-1 rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="image"
                className="gap-2 rounded-none border-b-2 border-transparent px-3 py-2.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Image className="h-4 w-4" />
                Image upload
              </TabsTrigger>
              <TabsTrigger
                value="fertilizer"
                className="gap-2 rounded-none border-b-2 border-transparent px-3 py-2.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Settings className="h-4 w-4" />
                Manual input
              </TabsTrigger>
              <TabsTrigger
                value="yield"
                className="gap-2 rounded-none border-b-2 border-transparent px-3 py-2.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <BarChart2 className="h-4 w-4" />
                Yield prediction
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="mt-8">
              <div className="space-y-6">
                <ImageUpload onImageUpload={handleImageUpload} isLoading={loading} />

                {loading && (
                  <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6 space-y-4 animate-fadeIn">
                    <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-5 w-48 rounded bg-muted animate-pulse" />
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="absolute inset-y-0 w-1/3 rounded-full bg-primary/60 animate-indeterminate" />
                    </div>
                    <p className="text-sm text-muted-foreground">Analyzing image…</p>
                  </div>
                )}

                {!loading && result && (
                  <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6 space-y-5 animate-fadeIn">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Detected pest</p>
                        <p className="text-xl font-semibold tracking-tight">{result.pestName}</p>
                      </div>
                      {result.severity && (
                        <span
                          className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${
                            severityStyles[result.severity] ?? severityStyles.low
                          }`}
                        >
                          {result.severity} severity
                        </span>
                      )}
                    </div>

                    {typeof result.confidence === "number" && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Confidence</span>
                          <span className="tabular-nums">{Math.round(result.confidence * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.round(result.confidence * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {result.recommendations?.pesticides.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recommended pesticides</p>
                        <ul className="space-y-2">
                          {result.recommendations.pesticides.map((pesticide, index) => (
                            <li key={index} className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                              <p className="font-medium text-sm">{pesticide.name}</p>
                              <p className="text-sm text-muted-foreground">{pesticide.description}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fertilizer" className="mt-8">
              <div className="max-w-4xl rounded-xl border border-border bg-card p-6">
                <FertilizerRecommendation />
              </div>
            </TabsContent>

            <TabsContent value="yield" className="mt-8">
              <div className="max-w-4xl rounded-xl border border-border bg-card p-6">
                <ManualInput onSubmit={handleManualSubmit} isLoading={loading} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t border-border/60">
        <div className="container py-6 text-sm text-muted-foreground">
          AgroVision · pest identification covers 132 pest classes via a MobileNetV2 model ·
          for educational and research use.
        </div>
      </footer>
    </div>
  );
};

export default Index;
