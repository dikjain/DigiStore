"use client"
import axios from "axios"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import ImageUpload from "./_components/imageUpload";
import { useUser } from "@clerk/nextjs"; 
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddProduct() {
    const { user } = useUser(); 
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [category, setCategory] = useState(["COOKING TUTORIALS", "CODING TUTORIALS", "VIDEO EDITING TUTORIALS", "GAME DEVELOPMENT TUTORIALS"])

    const [formData, setFormData] = useState()
    const handleInputChange = (name, value) => {
        setFormData({...formData, [name]: value})
    }
    
    
    const handleAddProduct = async () => {
      setLoading(true)
      try {
            const formDataToSend = new FormData();
            formDataToSend.append("image", formData.image)
            formDataToSend.append("file", formData.file)
            formDataToSend.append("data", JSON.stringify({ ...formData, createdBy: user?.primaryEmailAddress?.emailAddress }))
            const response = await axios.post("/api/products", formDataToSend,{
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if(response.status === 200){
              router.push("/dashboard")
            }
            toast.success('Product Added Successfully')
        } catch (error) {
          if(formData?.description.length > 250){
            toast.error("Description should be less than 250 characters")
          }else{
            toast.error("Something went wrong")
          }
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className="mt-10 p-">
      <h2 className="text-3xl font-bold">Add New Product</h2>
      <p className="text-gray-500 mt-2">
        Start adding products details to sell your item
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        <div>
            <ImageUpload onImageUpload={(file) => handleInputChange("image", file)}/>
            <div className="flex flex-col gap-2 mt-2">
            <p className="text-xl font-bold mt-2">Upload File You Want To Sell  </p>
            <Input type="file" id="image" accept="image/*" className=" bg-secondary" onChange={(e) => handleInputChange("file", e.target.files[0])}/>
            </div>
            <div className="mt-5">
                <p className="text-xl font-bold">Message For Buyers</p>
                <Textarea placeholder="Write Thank You Message For Buyers" className="bg-primary max-h-[200px] h-[120px]" value={formData?.message} onChange={(e) => handleInputChange("message", e.target.value)}/>
            </div>

        </div>
        <div className="flex flex-col gap-4">
          <div>
            <h4>Product Title</h4>
            <Input
              className="bg-primary"
              name="title"
              placeholder="Enter Product Title"
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          <div>
            <h4>Price</h4>
            <Input
              className="bg-secondary"
              type="number"
              name="price"
              placeholder="Enter Product Price"
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>
          <div>
            <h4>Category</h4>
            <Select value={formData?.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="min-w-[180px] bg-tertiary">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger >
              <SelectContent>
                {category.map((item, index) => (
                    <SelectItem key={index} value={item}>{item}</SelectItem>
                ))}

              </SelectContent>
            </Select>
          </div>
          <div>
            <h4>Description</h4>
            <Textarea 
              placeholder="Enter Product Description" 
              className="bg-primary h-[200px] max-h-[300px]" 
              value={formData?.description} 
              onChange={(e) => handleInputChange("description", e.target.value.slice(0, 250))}
            />
          </div>
          <div>
            <h4>Product Details(Optional)</h4>
            <Textarea placeholder="Enter Product Details (Optional)" className="bg-secondary max-h-[200px] h-[100px]" value={formData?.details} onChange={(e) => handleInputChange("details", e.target.value)}/>
          </div>
          <Button className="bg-tertiary hover:bg-tertiary/80 mt-2 w-full" onClick={handleAddProduct}>{loading ? <Loader2Icon className="animate-spin"/> : "Add Product"}</Button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
