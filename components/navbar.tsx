"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArConnectButton } from "@/components/arconnect"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { DrillIcon as Drone, Menu, ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { cn } from "./ui/lib/utils"

const features = [
  { title: "Advanced Controls", href: "#features", description: "Precision flight controls with AI assistance." },
  { title: "Camera System", href: "#features", description: "8K Ultra HD camera with stabilization." },
  { title: "Battery Life", href: "#features", description: "Industry-leading 4-hour flight time." },
]

const specs = [
  { title: "Technical Specs", href: "#specs", description: "Detailed drone specifications." },
  { title: "Performance", href: "#specs", description: "Speed and maneuverability metrics." },
  { title: "Comparison", href: "#specs", description: "How we stack up against competitors." },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-sm border-b border-white/10">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Drone className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">
            DroneTech
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {features.map((feature) => (
                      <ListItem key={feature.title} title={feature.title} href={feature.href}>
                        {feature.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10">
                  Specifications
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {specs.map((spec) => (
                      <ListItem key={spec.title} title={spec.title} href={spec.href}>
                        {spec.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* ArConnect Button */}
          <ArConnectButton />

          <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
            Pre-order <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="default" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-gray-900/95 border-white/10 text-white">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Drone className="h-6 w-6 text-cyan-400" />
                  <span className="text-lg font-bold">DroneTech</span>
                </Link>
                <Button variant="default" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold text-gray-400">Features</div>
                  {features.map((feature) => (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg hover:text-cyan-400 transition-colors"
                    >
                      {feature.title}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold text-gray-400">Specifications</div>
                  {specs.map((spec) => (
                    <Link
                      key={spec.title}
                      href={spec.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg hover:text-cyan-400 transition-colors"
                    >
                      {spec.title}
                    </Link>
                  ))}
                </div>
                <ArConnectButton />
                <Button className="bg-cyan-400 hover:bg-cyan-500 text-black mt-4">Pre-order Now</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

const ListItem = ({ className, title, children, href, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-white/70">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
