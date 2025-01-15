import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return   (  <div className='flex items-center justify-center relative   bg-black/80  h-[calc(100vh-74px)]'>
  <SignUp />
    </div>
  )
}