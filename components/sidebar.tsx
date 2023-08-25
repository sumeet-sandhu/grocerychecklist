"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const routes = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      color: "text-sky-500"
    },

    {
      label: 'Conversation',
      href: '/conversation',
      color: "text-violet-500",
    },
    {
      label: 'Image Generation',
      color: "text-pink-700",
      href: '/image',
    },
    {
      label: 'Video Generation',
      color: "text-orange-700",
      href: '/video',
    },
    {
      label: 'Music Generation',
      color: "text-emerald-500",
      href: '/music',
    },
    {
        label: 'Code Generation',
        color: "text-green-700",
        href: '/code',
    },
    {
        label: 'Settings',
        href: '/settings',
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    return ( 
        <div className="space-y-4 py-4 flex flex-col h-full bg-green-500 text-white rounded-lg">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative h-8 w-8 mr-4">
                        <Image fill alt="Logo" src="/logo.png" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        GroceryChecklist
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href} className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition">
                            <div className="flex items-center flex-1">
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
     );
}
 
export default Sidebar;