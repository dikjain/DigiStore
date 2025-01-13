import React from 'react'

function RouteLayout({children}) {
  return (
    <div className='p-5 sm:px-10 md:px-36 lg:px-48'>
        {children}
    </div>
  )
}

export default RouteLayout