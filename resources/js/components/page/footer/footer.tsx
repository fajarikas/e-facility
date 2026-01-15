import React from 'react'

type Props = {}

export const Footer = (props: Props) => {
  return (
    <div>
        <div className="bg-[#018fd3] w-full px-4 py-5 lg:px-0 lg:py-14 mb-[50px] mr-[58px] rounded-3xl">
            <div className="mx-auto w-full max-w-[1280px] text-center">
                <h2 className="text-white font-semibold">© 2024 E-Facility. All rights reserved.</h2>
            </div>
        </div>
    </div>
  )
}

export default Footer