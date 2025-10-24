import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { useToast } from "@/hooks/use-toast";

interface RecommendationResponse {
  predicted_pest?: {
    name: string;
    explanation: string;
  };
  pesticides?: Array<{
    name: string;
    description: string;
    dosage: string;
  }>;
  fertilizers?: Array<{
    name: string;
    description: string;
    dosage: string;
  }>;
  error?: string;
  raw?: string;
}

export const FertilizerRecommendation = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    crop_name: "",
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recommend-fertilizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
  
      const data = await response.json();
      console.log("Received data:", data); // Debug log
  
      // Extract the nested recommendations if available
      setRecommendations(data.recommendations || data);
      toast({
        title: "Analysis Complete",
        description: "Pest prediction and recommendations generated successfully",
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Pest Prediction & Recommendation</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Crop Name */}
          <div className="space-y-2">
            <Label htmlFor="crop_name">Crop Name</Label>
            <Input
              id="crop_name"
              value={formData.crop_name}
              onChange={(e) => handleChange("crop_name", e.target.value)}
              placeholder="Enter crop name"
              required
            />
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label htmlFor="soil_type">Soil Type</Label>
            <Select onValueChange={(value) => handleChange("soil_type", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="loamy">Loamy</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              value={formData.temperature}
              onChange={(e) => handleChange("temperature", e.target.value)}
              placeholder="Enter temperature"
              required
            />
          </div>

          {/* Humidity */}
          <div className="space-y-2">
            <Label htmlFor="humidity">Humidity (%)</Label>
            <Input
              id="humidity"
              type="number"
              value={formData.humidity}
              onChange={(e) => handleChange("humidity", e.target.value)}
              placeholder="Enter humidity"
              required
            />
          </div>

          {/* Moisture */}
          <div className="space-y-2">
            <Label htmlFor="moisture">Moisture (%)</Label>
            <Input
              id="moisture"
              type="number"
              value={formData.moisture}
              onChange={(e) => handleChange("moisture", e.target.value)}
              placeholder="Enter moisture level"
              required
            />
          </div>

          {/* Nitrogen */}
          <div className="space-y-2">
            <Label htmlFor="nitrogen">Nitrogen (N) Level</Label>
            <Input
              id="nitrogen"
              type="number"
              value={formData.nitrogen}
              onChange={(e) => handleChange("nitrogen", e.target.value)}
              placeholder="Enter nitrogen level"
              required
            />
          </div>

          {/* Phosphorus */}
          <div className="space-y-2">
            <Label htmlFor="phosphorus">Phosphorus (P) Level</Label>
            <Input
              id="phosphorus"
              type="number"
              value={formData.phosphorus}
              onChange={(e) => handleChange("phosphorus", e.target.value)}
              placeholder="Enter phosphorus level"
              required
            />
          </div>

          {/* Potassium */}
          <div className="space-y-2">
            <Label htmlFor="potassium">Potassium (K) Level</Label>
            <Input
              id="potassium"
              type="number"
              value={formData.potassium}
              onChange={(e) => handleChange("potassium", e.target.value)}
              placeholder="Enter potassium level"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Get Recommendations"}
        </Button>
      </form>

      {/* Display the recommendations response */}
      {recommendations && (
        recommendations.error ? (
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4">Error</h4>
              <p className="text-sm text-gray-600">{recommendations.error}</p>
              {recommendations.raw && (
                <pre className="text-sm text-gray-600">{recommendations.raw}</pre>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4">Prediction & Recommendations</h4>
              
              {/* Predicted Pest Section */}
              {recommendations.predicted_pest ? (
                <div className="mb-4">
                  <h5 className="font-semibold">Predicted Pest</h5>
                  <p className="text-sm text-gray-600">
                    {recommendations.predicted_pest.name} – {recommendations.predicted_pest.explanation}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No pest prediction available.</p>
              )}

              {/* Pesticides Section */}
              {recommendations.pesticides && recommendations.pesticides.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold">Recommended Pesticides</h5>
                  {recommendations.pesticides.map((item, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg mb-2">
                      <h6 className="font-semibold">{item.name}</h6>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600">Dosage: {item.dosage}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Fertilizers Section */}
              {recommendations.fertilizers && recommendations.fertilizers.length > 0 && (
                <div>
                  <h5 className="font-semibold">Recommended Fertilizers</h5>
                  {recommendations.fertilizers.map((item, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg mb-2">
                      <h6 className="font-semibold">{item.name}</h6>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600">Dosage: {item.dosage}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};
