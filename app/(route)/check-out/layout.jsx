import React from 'react'

function RouteLayout({children}) {
  return (
    <div className='p-5   sm:px-10 md:px-24 lg:px-32 lg:py-0'>
        {children}
    </div>
  )
}

export default RouteLayout