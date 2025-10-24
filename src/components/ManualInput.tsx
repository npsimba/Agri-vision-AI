
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
import { ChartBar, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManualInputProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface YieldPrediction {
  prediction: number;
  unit: string;
}

export const ManualInput = ({ onSubmit, isLoading }: ManualInputProps) => {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<YieldPrediction | null>(null);
  const [formData, setFormData] = useState({
    Crop: "",
    Crop_Year: new Date().getFullYear(),
    Season: "",
    State: "",
    Area: 0,
    Annual_Rainfall: 0,
    Fertilizer: 0,
    Pesticide: 0,
  });

  const cropOptions = [
    "Arecanut", "Arhar/Tur", "Bajra", "Banana", "Barley", "Black pepper", 
    "Cardamom", "Cashewnut", "Castor seed", "Coriander", "Cotton(lint)", 
    "Cowpea(Lobia)", "Dry chillies", "Garlic", "Ginger", "Gram", "Groundnut", 
    "Guar seed", "Horse-gram", "Jowar", "Jute", "Khesari", "Linseed", "Maize", 
    "Masoor", "Mesta", "Moong(Green Gram)", "Moth", "Niger seed", "Oilseeds total", 
    "Onion", "Other Rabi pulses", "Other Cereals", "Other Kharif pulses", 
    "Other Summer Pulses", "Peas & beans (Pulses)", "Potato", "Ragi", 
    "Rapeseed &Mustard", "Rice", "Safflower", "Sannhamp", "Sesamum", 
    "Small millets", "Soyabean", "Sugarcane", "Sunflower", "Sweet potato", 
    "Tapioca", "Tobacco", "Turmeric", "Urad", "Wheat", "other oilseeds"
  ];

  const stateOptions = [
    "Assam", "Karnataka", "Kerala", "Meghalaya", "West Bengal", "Puducherry", 
    "Goa", "Andhra Pradesh", "Tamil Nadu", "Odisha", "Bihar", "Gujarat", 
    "Madhya Pradesh", "Maharashtra", "Mizoram", "Punjab", "Uttar Pradesh", 
    "Haryana", "Himachal Pradesh", "Tripura", "Nagaland", "Chhattisgarh", 
    "Uttarakhand", "Jharkhand", "Delhi", "Manipur", "Jammu and Kashmir", 
    "Telangana", "Arunachal Pradesh", "Sikkim"
  ];

  const seasonOptions = ["Whole Year", "Kharif", "Rabi", "Autumn", "Summer", "Winter"];

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/predict-yield', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to predict yield");
      }

      const data = await response.json();
      setPrediction(data);
      toast({
        title: "Prediction Complete",
        description: `Predicted yield: ${data.prediction.toFixed(2)} ${data.unit}`,
      });
      onSubmit(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to predict yield. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Crop Yield Prediction</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Crop Type */}
          <div className="space-y-2">
            <Label htmlFor="Crop">Crop Type</Label>
            <Select onValueChange={(value) => handleChange("Crop", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {cropOptions.map((crop) => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Crop Year */}
          <div className="space-y-2">
            <Label htmlFor="Crop_Year">Crop Year</Label>
            <Input
              id="Crop_Year"
              type="number"
              value={formData.Crop_Year}
              onChange={(e) => handleChange("Crop_Year", parseInt(e.target.value))}
              required
              min="1980"
              max={new Date().getFullYear()}
              step="1"
            />
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="Season">Season</Label>
            <Select onValueChange={(value) => handleChange("Season", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                {seasonOptions.map((season) => (
                  <SelectItem key={season} value={season}>{season}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="State">State</Label>
            <Select onValueChange={(value) => handleChange("State", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="Area">Area (hectares)</Label>
            <Input
              id="Area"
              type="number"
              placeholder="Enter area"
              value={formData.Area}
              onChange={(e) => handleChange("Area", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>

          {/* Annual Rainfall */}
          <div className="space-y-2">
            <Label htmlFor="Annual_Rainfall">Annual Rainfall (mm)</Label>
            <Input
              id="Annual_Rainfall"
              type="number"
              placeholder="Enter rainfall"
              value={formData.Annual_Rainfall}
              onChange={(e) => handleChange("Annual_Rainfall", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>

          {/* Fertilizer */}
          <div className="space-y-2">
            <Label htmlFor="Fertilizer">Fertilizer (kg/hectare)</Label>
            <Input
              id="Fertilizer"
              type="number"
              placeholder="Enter fertilizer amount"
              value={formData.Fertilizer}
              onChange={(e) => handleChange("Fertilizer", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>

          {/* Pesticide */}
          <div className="space-y-2">
            <Label htmlFor="Pesticide">Pesticide (kg/hectare)</Label>
            <Input
              id="Pesticide"
              type="number"
              placeholder="Enter pesticide amount"
              value={formData.Pesticide}
              onChange={(e) => handleChange("Pesticide", parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Predict Yield"}
        </Button>
      </form>

      {prediction && (
        <Card className="bg-green-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Prediction Results</h3>
            <p className="text-lg">
              Expected Yield:{" "}
              <span className="font-bold">{prediction.prediction.toFixed(2)}</span>{" "}
              {prediction.unit}
            </p>
          </CardContent>
        </Card>
      )}

      {/* <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center space-x-4">
            <Cloud className="w-8 h-8 text-sky-500" />
            <div>
              <h3 className="font-semibold text-lg">Weather Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Impact of weather conditions on crop yield
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center space-x-4">
            <ChartBar className="w-8 h-8 text-emerald-500" />
            <div>
              <h3 className="font-semibold text-lg">Yield Prediction</h3>
              <p className="text-sm text-muted-foreground">
                Estimated crop yield based on inputs
              </p>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};
