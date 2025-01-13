import React from 'react'

function addProductLayout({children}) {
  return (
    <div className='p-5 sm:px-10 md:px-36 lg:px-48'>
        {children}
    </div>
  )
}

export default addProductLayout