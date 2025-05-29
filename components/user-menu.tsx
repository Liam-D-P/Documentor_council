"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { User, Settings, LogOut, Shield, FileText } from "lucide-react"

export default function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
  }

  if (!user || !profile) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "reviewer":
        return <FileText className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "reviewer":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ""} />
            <AvatarFallback>{getInitials(profile.full_name || profile.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">{profile.full_name || "User"}</p>
              <Badge variant={getRoleBadgeVariant(profile.role)} className="text-xs">
                {getRoleIcon(profile.role)}
                <span className="ml-1 capitalize">{profile.role}</span>
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
            {profile.organization && (
              <p className="text-xs leading-none text-muted-foreground">{profile.organization}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
