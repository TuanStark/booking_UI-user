'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function PartnersSection() {
    const partners = [
        { name: 'Đại học sư phạm Đà Nẵng', logo: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1764164974/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_S%C6%B0_ph%E1%BA%A1m__%C4%90%E1%BA%A1i_h%E1%BB%8Dc_%C4%90%C3%A0_N%E1%BA%B5ng.svg_c83toi.png' },
        { name: 'Đại học ngoại ngữ Đà Nẵng', logo: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1764164972/DHNN_balnqs.png' },
        { name: 'Đại học bách khoa Đà Nẵng', logo: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1764164972/logo_DUT_dkzt7b.png' },
        { name: 'Đại học kinh tế Đà Nẵng', logo: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1764164972/Logo_DUE_ydolhf.jpg' },
        { name: 'Đại học kỹ thuật y dược Đà Nẵng', logo: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1764164972/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_K%E1%BB%B9_thu%E1%BA%ADt_Y_-_D%C6%B0%E1%BB%A3c_%C4%90%C3%A0_N%E1%BA%B5ng_icmxok.jpg' },
        { name: 'Đại học kiến trúc Đà Nẵng', logo: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1764164972/logo_DAU_t3wwou.jpg' },
        { name: 'Đại học Duy Tân', logo: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1764164971/logo_DTU_wzwoqc.jpg' },
    ]

    return (
        <div className="relative -mt-24 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="text-gray-500 font-semibold mb-4 md:mb-0 md:mr-8 whitespace-nowrap">
                    OUR PARTNERS:
                </div>

                <div className="flex-1 w-full overflow-hidden">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        slidesPerView={2}
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1024: {
                                slidesPerView: 5,
                            },
                        }}
                        className="items-center"
                    >
                        {partners.map((partner, index) => (
                            <SwiperSlide key={index} className="flex items-center justify-center h-24">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="w-[80%] h-[80%] object-contain"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}
