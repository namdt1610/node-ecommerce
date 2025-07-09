import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { ShoppingCart } from 'lucide-react'

interface Category {
    id: string
    name: string
}

interface CategoryCarouselProps {
    categories: Category[]
}

export default function CategoryCarousel({
    categories,
}: CategoryCarouselProps) {
    if (!categories || categories.length === 0) return null
    return (
        <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
                {categories.map((category) => (
                    <CarouselItem
                        key={category.id}
                        className="basis-1/2 md:basis-1/4 px-2"
                    >
                        <Link href={`/products?category=${category.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <ShoppingCart className="h-8 w-8 text-primary" />
                                    </div>
                                    <h4 className="font-semibold">
                                        {category.name}
                                    </h4>
                                </CardContent>
                            </Card>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
