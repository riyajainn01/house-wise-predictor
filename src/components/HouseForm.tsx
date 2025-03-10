
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

const formSchema = z.object({
  bedrooms: z.number().min(1).max(10),
  bathrooms: z.number().min(1).max(10),
  squareFeet: z.number().min(500).max(10000),
  lotSize: z.number().min(0.1).max(5),
  yearBuilt: z.number().min(1900).max(new Date().getFullYear()),
  neighborhood: z.string().min(1),
  condition: z.enum(["poor", "fair", "good", "excellent"]),
  hasGarage: z.boolean().default(false),
  hasPool: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const HouseForm = () => {
  const navigate = useNavigate();
  
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    lotSize: 0.25,
    yearBuilt: 2000,
    condition: "good",
    hasGarage: true,
    hasPool: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    // In a real app, we would send this data to the backend
    console.log("Form data:", data);
    
    // For now, we'll simulate a backend request with a timeout
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: "Analyzing property data...",
        success: "Analysis complete!",
        error: "Error analyzing data",
      }
    );
    
    // Store the form data in session storage to use on the results page
    sessionStorage.setItem("houseData", JSON.stringify(data));
    
    // Wait briefly then navigate to results
    setTimeout(() => {
      navigate("/results");
    }, 2000);
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
                    className="w-6 h-6 text-housewise-600 rounded"
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
                  <FormLabel className="text-base">Swimming Pool</FormLabel>
                  <FormDescription>
                    Does the property have a pool?
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-6 h-6 text-housewise-600 rounded"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full">
          Get Price Prediction
        </Button>
      </form>
    </Form>
  );
};

export default HouseForm;
