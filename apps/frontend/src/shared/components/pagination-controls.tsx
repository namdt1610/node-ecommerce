import { Button } from '@/components/ui/button'

interface PaginationControlsProps {
    page: number
    totalPages: number
    setPage: (p: number) => void
}

export default function PaginationControls({
    page,
    totalPages,
    setPage,
}: PaginationControlsProps) {
    // Calculate start and end page for max 5 pages
    let start = Math.max(1, page - 2)
    const end = Math.min(totalPages, start + 4)
    if (end - start < 4) {
        start = Math.max(1, end - 4)
    }
    const pages = []
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return (
        <div className="flex justify-center mt-8 gap-2">
            <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
            >
                Previous
            </Button>
            {pages.map((pNum) => (
                <Button
                    key={pNum}
                    variant={page === pNum ? 'default' : 'outline'}
                    onClick={() => setPage(pNum)}
                >
                    {pNum}
                </Button>
            ))}
            <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
            >
                Next
            </Button>
        </div>
    )
}
