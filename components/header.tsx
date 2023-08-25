"use client";

import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return ( 
        <div className="space-y-4 flex flex-row flex-1 py-2 h-full bg-green-500 text-white items-center justify-center">
            <Link href="/dashboard" className="flex items-center justify-center">
                <div className="relative h-9 w-9 mr-2">
                    <Image fill alt="Logo" src="/logo.png" />
                </div>
                <h1 className="md:text-3xl font-bold flex flex-row">
                    GroceryChecklist
                </h1>
            </Link>
        </div>
     );
}
 
export default Header;