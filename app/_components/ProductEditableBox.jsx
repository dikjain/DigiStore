"use client"
import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { MoreVerticalIcon } from 'lucide-react'

function ProductEditableBox({children}) {
  return (
    <Popover>
    <PopoverTrigger asChild>
       <MoreVerticalIcon className='text-black hover:text-black/40 cursor-pointer' />
    </PopoverTrigger>
    <PopoverContent className='bg-white max-w-[200px]'>
        {children}
    </PopoverContent>
  </Popover>
  )
}

export default ProductEditableBox