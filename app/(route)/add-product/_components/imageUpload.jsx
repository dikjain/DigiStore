"use client"
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

function ImageUpload({onImageUpload, initialImage}) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage)
    }
  }, [initialImage])

  const handleImageUpload = (e) => {
      const file = e.target.files[0]
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file)

        const reader = new FileReader()
        reader.onload = (e) => {
          setImage(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Please upload a valid image file.')
      }
  }
  return (
    <div>
      <p className="text-xl font-bold mt-2">Upload Product Image</p>
      <Input type="file" id="image" className="hidden bg-primary" accept="image/*" onChange={handleImageUpload}/>
      <label htmlFor="image" className="bg-primary cursor-pointer">
        <div className="flex flex-col items-center bg-gray-200 justify-center border-8 cursor-pointer border-dashed border-tertiary p-5 rounded-lg" >
          {image ? (
            <Image 
              src={image} 
              alt="upload" 
              width={300} 
              height={300} 
              className="object-contain h-[300px] w-[300px]"
              unoptimized={true}
            />
          ) : (
            <Image src="/upload.png" alt="upload" width={300} height={300} />
          )}
        </div>
      </label>
    </div>
  )
}

export default ImageUpload