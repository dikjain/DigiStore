import React from 'react'

function ProductLayout({children}) {
  return (
    <div className='p-5 sm:px-10 md:px-24 lg:px-36'>
        {children}
    </div>
  )
}

export default ProductLayout