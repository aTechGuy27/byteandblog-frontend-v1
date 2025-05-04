"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { getUserProfile, updateUserProfile, uploadProfilePicture } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"
import { AuthenticatedImage } from "@/components/authenticated-image"

interface UserProfile {
  id: number
  name: string
  email: string
  age: number
  address: string
  profileImage: string | null
  role: string
  createdAt: string
  lastLoginAt: string
}

interface FormData {
  name: string
  age: string
  address: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    address: "",
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile()
        console.log("Profile data received:", data)
        setProfile(data)
        setFormData({
          name: data.name || "",
          age: data.age ? String(data.age) : "", // Convert number to string for form
          address: data.address || "",
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      // Convert age to number before sending to API
      const updatedProfile = {
        name: formData.name,
        age: formData.age ? Number(formData.age) : undefined, // Convert string to number
        address: formData.address,
      }

      const data = await updateUserProfile(updatedProfile)
      setProfile(data)
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file (JPEG, PNG, or GIF).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const data = await uploadProfilePicture(file)
      console.log("Upload response:", data)

      // Update profile with new image URL
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              profileImage: data.imageUrl,
            }
          : null,
      )

      toast({
        title: "Image Uploaded",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to upload image:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-full bg-muted">
              <AuthenticatedImage
                src={profile?.profileImage || null}
                alt="Profile"
                className="h-full w-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-primary text-4xl font-bold text-primary-foreground">
                    {profile?.name ? getInitials(profile.name) : "U"}
                  </div>
                }
              />
            </div>
            <Label htmlFor="picture" className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload New Picture"}
              </div>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </Label>
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number" // Ensure this is type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Account Information Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{profile?.email}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                <p className="capitalize">{profile?.role?.toLowerCase()}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                <p>{profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
