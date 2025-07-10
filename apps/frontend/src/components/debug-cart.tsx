'use client'

import { useCart } from '@/hooks/use-cart'
import { useEffect } from 'react'
import { cartApi } from '@/lib/api/cart'

export default function DebugCart() {
    const { data: cart, isLoading, error, refetch } = useCart()

    const testManualCartQuery = async () => {
        try {
            console.log('Testing manual cart query...')
            const response = await cartApi.getCart()
            console.log('Manual cart query success:', response)
            alert('Manual query success! Check console.')
        } catch (error) {
            console.error('Manual cart query failed:', error)
            alert('Manual query failed! Check console.')
        }
    }

    useEffect(() => {
        console.log('=== CART DEBUG ===')
        console.log('Token in localStorage:', localStorage.getItem('token'))
        console.log('All localStorage keys:', Object.keys(localStorage))
        console.log('Cart loading:', isLoading)
        console.log('Cart error:', error)
        console.log('Cart data:', cart)
        console.log('Cart items:', cart?.items)
        console.log('Cart total items:', cart?.totalItems)

        // Check if we have any tokens with different keys
        console.log('Checking all possible token keys:')
        const possibleKeys = ['token', 'accessToken', 'authToken', 'jwt']
        possibleKeys.forEach((key) => {
            const value = localStorage.getItem(key)
            if (value) {
                console.log(`Found ${key}:`, value.substring(0, 50) + '...')
            }
        })
    }, [cart, isLoading, error])

    if (isLoading) {
        return <div className="p-4 bg-yellow-100">Loading cart debug...</div>
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100">
                <h3>Cart Error:</h3>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
        )
    }

    return (
        <div className="p-4 bg-blue-100">
            <h3 className="font-bold">Cart Debug Info:</h3>
            <div className="mt-2">
                <p>
                    <strong>Token:</strong>{' '}
                    {localStorage.getItem('token')?.substring(0, 50)}...
                </p>
                <p>
                    <strong>All tokens found:</strong>
                </p>
                <ul className="ml-4">
                    {['token', 'accessToken', 'authToken', 'jwt'].map((key) => {
                        const value = localStorage.getItem(key)
                        return value ? (
                            <li key={key} className="text-sm">
                                <strong>{key}:</strong> {value.substring(0, 30)}
                                ...
                            </li>
                        ) : null
                    })}
                </ul>
                <p>
                    <strong>Loading:</strong> {isLoading ? 'YES' : 'NO'}
                </p>
                <p>
                    <strong>Error:</strong> {error ? 'YES' : 'NO'}
                </p>
                <p>
                    <strong>Total Items:</strong> {cart?.totalItems}
                </p>
                <p>
                    <strong>Items Count:</strong> {cart?.items?.length}
                </p>
                <p>
                    <strong>Total Amount:</strong> {cart?.totalAmount}
                </p>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={testManualCartQuery}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Test Manual Cart Query
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Force Refetch Cart
                    </button>
                </div>
            </div>
            <details className="mt-4">
                <summary className="cursor-pointer font-semibold">
                    Full Cart Data
                </summary>
                <pre className="text-xs mt-2 bg-white p-2 rounded">
                    {JSON.stringify(cart, null, 2)}
                </pre>
            </details>
        </div>
    )
}
