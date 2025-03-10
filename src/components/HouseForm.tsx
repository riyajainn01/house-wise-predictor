import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useState } from "react";

const API_URL = "https://housewisepredictor.onrender.com";

const formSchema = z.object({
  bedrooms: z.number().min(1, "At least 1 bedroom required").max(10, "Maximum 10 bedrooms"),
  bathrooms: z.number().min(1, "At least 1 bathroom required").max(10, "Maximum 10 bathrooms"),
  squareFeet: z.number().min(500, "Minimum 500 sq ft").max(10000, "Maximum 10,000 sq ft"),
  lotSize: z.number().min(0.1, "Minimum 0.1 acres").max(5, "Maximum 5 acres"),
  yearBuilt: z.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear(), "Cannot be future year"),
  neighborhood: z.string().min(1, "Please select a neighborhood"),
  condition: z.enum(["poor", "fair", "good", "excellent"]),
  hasGarage: z.boolean().default(false),
  hasPool: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const HouseForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    lotSize: 0.25,
    yearBuilt: 2000,
    neighborhood: "downtown",
    condition: "good",
    hasGarage: true,
    hasPool: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to get prediction' }));
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      
      const result = await response.json();
      
      if (result.status === 'error') {
        throw new Error(result.error);
      }
      
      // Store the prediction result
      sessionStorage.setItem("predictionResult", JSON.stringify(result));
      sessionStorage.setItem("houseData", JSON.stringify(data));
      
      toast.success("Analysis complete!");
      navigate("/results");
      
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get prediction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="squareFeet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Square Feet</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Total interior living space in square feet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lotSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lot Size (acres): {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.05}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Built</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neighborhood</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a neighborhood" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="midtown">Midtown</SelectItem>
                  <SelectItem value="uptown">Uptown</SelectItem>
                  <SelectItem value="suburbanNorth">Suburban North</SelectItem>
                  <SelectItem value="suburbanSouth">Suburban South</SelectItem>
                  <SelectItem value="suburbanEast">Suburban East</SelectItem>
                  <SelectItem value="suburbanWest">Suburban West</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Condition</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="hasGarage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Garage</FormLabel>
                  <FormDescription>
                    Does the property have a garage?
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hasPool"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Pool</FormLabel>
                  <FormDescription>
                    Does the property have a pool?
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Analyzing..." : "Get Price Estimate"}
        </Button>
      </form>
    </Form>
  );
};

export default HouseForm;
