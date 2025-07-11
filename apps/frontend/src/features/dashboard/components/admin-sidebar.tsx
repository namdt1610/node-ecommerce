'use client'

import * as React from 'react'
import {
    IconDashboard,
    IconUsers,
    IconShoppingBag,
    IconPackage,
    IconCategory,
    IconTruck,
    IconStar,
    IconChartBar,
    IconSettings,
} from '@tabler/icons-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'

const adminData = {
    user: {
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: IconDashboard,
        },
        {
            title: 'Analytics',
            url: '/dashboard/analytics',
            icon: IconChartBar,
        },
        {
            title: 'Products',
            url: '/dashboard/products',
            icon: IconPackage,
        },
        {
            title: 'Orders',
            url: '/dashboard/orders',
            icon: IconShoppingBag,
        },
        {
            title: 'Users',
            url: '/dashboard/users',
            icon: IconUsers,
        },
        {
            title: 'Categories',
            url: '/dashboard/categories',
            icon: IconCategory,
        },
        {
            title: 'Inventory',
            url: '/dashboard/inventory',
            icon: IconTruck,
        },
        {
            title: 'Reviews',
            url: '/dashboard/reviews',
            icon: IconStar,
        },
        {
            title: 'Settings',
            url: '/dashboard/settings',
            icon: IconSettings,
        },
    ],
}

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
    className?: string
}

export function AdminSidebar({ ...props }: AdminSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <IconDashboard className="h-6 w-6" />
                    <span className="font-semibold">Admin Panel</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={adminData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={adminData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
