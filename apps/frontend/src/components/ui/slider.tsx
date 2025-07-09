'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
    value: [number, number]
    onValueChange: (value: [number, number]) => void
    min: number
    max: number
    step?: number
    className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
    (
        { value, onValueChange, min, max, step = 1, className, ...props },
        ref
    ) => {
        const [isDragging, setIsDragging] = React.useState<
            'min' | 'max' | null
        >(null)
        const sliderRef = React.useRef<HTMLDivElement>(null)

        const percentage = React.useCallback(
            (val: number) => {
                return ((val - min) / (max - min)) * 100
            },
            [min, max]
        )

        const valueFromPercentage = React.useCallback(
            (percent: number) => {
                const value = min + (percent / 100) * (max - min)
                return Math.round(value / step) * step
            },
            [min, max, step]
        )

        const handleMouseDown =
            (type: 'min' | 'max') => (e: React.MouseEvent) => {
                e.preventDefault()
                setIsDragging(type)
            }

        const handleMouseMove = React.useCallback(
            (e: MouseEvent) => {
                if (!isDragging || !sliderRef.current) return

                const rect = sliderRef.current.getBoundingClientRect()
                const percent = ((e.clientX - rect.left) / rect.width) * 100
                const newValue = Math.max(
                    min,
                    Math.min(max, valueFromPercentage(percent))
                )

                if (isDragging === 'min') {
                    onValueChange([Math.min(newValue, value[1]), value[1]])
                } else {
                    onValueChange([value[0], Math.max(newValue, value[0])])
                }
            },
            [isDragging, min, max, value, valueFromPercentage, onValueChange]
        )

        const handleMouseUp = React.useCallback(() => {
            setIsDragging(null)
        }, [])

        React.useEffect(() => {
            if (isDragging) {
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
                return () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                }
            }
        }, [isDragging, handleMouseMove, handleMouseUp])

        return (
            <div
                ref={ref}
                className={cn(
                    'relative w-full h-5 flex items-center',
                    className
                )}
                {...props}
            >
                <div
                    ref={sliderRef}
                    className="relative w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                >
                    {/* Track fill */}
                    <div
                        className="absolute h-2 bg-blue-600 rounded-full"
                        style={{
                            left: `${percentage(value[0])}%`,
                            width: `${percentage(value[1]) - percentage(value[0])}%`,
                        }}
                    />

                    {/* Min thumb */}
                    <div
                        className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full cursor-grab active:cursor-grabbing shadow-md"
                        style={{
                            left: `${percentage(value[0])}%`,
                            transform: 'translateX(-50%)',
                            top: '50%',
                            marginTop: '-10px',
                        }}
                        onMouseDown={handleMouseDown('min')}
                    />

                    {/* Max thumb */}
                    <div
                        className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full cursor-grab active:cursor-grabbing shadow-md"
                        style={{
                            left: `${percentage(value[1])}%`,
                            transform: 'translateX(-50%)',
                            top: '50%',
                            marginTop: '-10px',
                        }}
                        onMouseDown={handleMouseDown('max')}
                    />
                </div>
            </div>
        )
    }
)

Slider.displayName = 'Slider'

export { Slider }
