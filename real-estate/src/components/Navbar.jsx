
import React, { useEffect } from 'react'
import {assets} from '../assets/assets'
function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)
  useEffect(() => {
    if(showMobileMenu){
      document.body.style.overflow = 'hidden'
    }else{
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
  };
}
  ,[showMobileMenu])
  return (
    <div className='absolute top-0 left-0 w-full z-10'>
    <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent'>
        <img src={assets.logo} alt="new"/>
        <ul className='hidden md:flex gap-8 text-white'>
            <a href = "#Header" className='cursor-pointer hover:text-gray-400'>Home</a>
            <a href = "#Header" className='cursor-pointer hover:text-gray-400'>About</a>
            <a href = "#Header" className='cursor-pointer hover:text-gray-400'>Projects</a>
            <a href = "#Header" className='cursor-pointer hover:text-gray-400'>Testimonials</a>

        </ul>
        <button className='hidden md:block bg-white px-8 py-2 rounded-full'>Sign up</button>
        <img src = {assets.menu_icon} alt="new" className='md:hidden' onClick={()=>setShowMobileMenu(true)}/>
    </div>
    {/* -------------mobile-menu -------------------- */}
    <div className={`md:hidden ${showMobileMenu? "fixed w-full": "h-0 w-0"}  right-0 top-0 bottom-0 overflow-hidden bg-white transition-all`}>
    <div className='flex justify-end p-6'>
    <img src = {assets.cross_icon} alt="new" className='block md:hidden w-6' onClick={()=>setShowMobileMenu(false)}/>
    </div>
      <ul className='flex flex-col gap-2 text-black items-center mt-5 px-5 text-lg font-medium'>
          <a href = "#Header" className='px-4 p22 rounded-full inine-block ' onClick={()=>setShowMobileMenu(false)}>Home</a>
          <a href = "#Header" className='px-4 py-2 rounded-full inine-block ' onClick={()=>setShowMobileMenu(false)}>About</a>
          <a href = "#Header" className='px-4 py-2 rounded-full inine-block ' onClick={()=>setShowMobileMenu(false)}>Projects</a>
          <a href = "#Header" className='px-4 py-2 rounded-full inine-block ' onClick={()=>setShowMobileMenu(false)}>Testimonials</a>

      </ul>
      <button className='block bg-white px-8 py-2 rounded-full'>Sign up</button>
      
    </div>
    </div>
  )
}

export default Navbar