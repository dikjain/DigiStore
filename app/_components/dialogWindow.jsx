"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function DialogWindow({children, deleteProduct ,refresh}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    if(refresh){
      setIsOpen(false);
    }
  },[refresh])


  const handleClose = () => {
    setIsOpen(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold bg-red-500 text-white p-3 rounded-md'>Are you absolutely sure?</DialogTitle>
          <DialogDescription className='text-lg'>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
            <div className='flex justify-end mt-5 gap-2'>
              <Button className='bg-red-500 hover:bg-red-500/80' onClick={deleteProduct}>Delete</Button>
              <Button className='bg-primary hover:bg-primary/80' onClick={handleClose}>Close</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default DialogWindow