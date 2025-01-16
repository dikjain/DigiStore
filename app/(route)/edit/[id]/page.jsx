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
import React, { useState, useEffect } from "react";
import ImageUpload from "../../add-product/_components/imageUpload";
import { useUser } from "@clerk/nextjs"; 
import { Loader2Icon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

function EditProduct() {
    const { user } = useUser(); 
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { id } = useParams();
    const [category, setCategory] = useState(["COOKING TUTORIALS", "CODING TUTORIALS", "VIDEO EDITING TUTORIALS", "GAME DEVELOPMENT TUTORIALS"])
    const [formData, setFormData] = useState()
    const [originalImage, setOriginalImage] = useState(null);
    const [originalFile, setOriginalFile] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
              if(user?.primaryEmailAddress?.emailAddress){
                const response = await axios.get(`/api/get-product?id=${id}`);
                console.log(response.data)
                if(response.data[0].users.email === user?.primaryEmailAddress?.emailAddress){
                  setFormData(response.data[0].products)
                  setOriginalImage(response.data[0].products.image)
                  setOriginalFile(response.data[0].products.file)
                }else{
                  toast.error("You are not authorized to edit this product")
                  router.push("/dashboard")
                }  
              }else{
                toast.error("Please Login to Edit Product")
              }
            } catch (error) {
              console.log(error)
                toast.error("Failed to fetch product data");
            }
        };
        console.log(formData)
        fetchProduct();
    }, [id, user]);

    const handleInputChange = (name, value) => {
        setFormData({...formData, [name]: value})
    }
    
    const handleEditProduct = async () => {
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("image", formData.image);
        formDataToSend.append("file", formData.file);
        formDataToSend.append("data", JSON.stringify({ 
          ...formData,
          changeInImages: formData.image !== originalImage || formData.file !== originalFile
        }));
        
        const response = await axios.put(`/api/get-product?id=${id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("Product Updated Successfully");
          router.push("/dashboard");
        }
      } catch (error) {
        if (formData?.description.length > 250) {
          toast.error("Description should be less than 250 characters");
        } else if (error.response?.data?.error === "Please select a JPEG or PNG image") {
          toast.error("Please select a JPEG or PNG image");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="mt-10 p-">
      <h2 className="text-3xl font-bold">Edit Product</h2>
      <p className="text-gray-500 mt-2">
        Edit the product details
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        <div>
            <ImageUpload onImageUpload={(file) => handleInputChange("image", file)} initialImage={formData?.image}/>
            <div className="flex flex-col gap-2 mt-2">
            <p className="text-xl font-bold mt-2">Upload File You Want To Sell  </p>
            <div>
              {formData?.file && typeof formData.file === 'string' ? (
                <>
                  <div 
                    className="flex flex-col items-center bg-gray-200 justify-center  cursor-pointer  p-2 lol border-2 border-black "
                  >
                    <a href={formData.file} target="_blank" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">Current File</a>
                    <label htmlFor="fileInput" className="text-sm text-gray-600 hover:text-gray-800 underline cursor-pointer">Click to change file</label>
                  </div>
                  <Input 
                    type="file"
                    id="fileInput" 
                    className="hidden"
                    onChange={(e) => handleInputChange("file", e.target.files[0])}
                  />
                </>
              ) : (
                <Input 
                  type="file" 
                  id="fileInput"
                  className="bg-secondary" 
                  onChange={(e) => handleInputChange("file", e.target.files[0])}
                />
              )}
            </div>
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
              value={formData?.title}
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
              value={formData?.price}
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
            <Textarea placeholder="Enter Product Details (Optional)" className="bg-secondary max-h-[200px] h-[125px]" value={formData?.details} onChange={(e) => handleInputChange("details", e.target.value)}/>
          </div>
          <Button className="bg-tertiary hover:bg-tertiary/80 mt-2 w-full" onClick={handleEditProduct}>{loading ? <Loader2Icon className="animate-spin"/> : "Update Product"}</Button>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
