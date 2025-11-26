'use client'

import NewsCard from './NewsCard'
import { NEWS_DATA } from './data'

export default function NewsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {NEWS_DATA.map((item) => (
                <NewsCard key={item.id} {...item} />
            ))}
        </div>
    )
}
