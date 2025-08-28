/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, use } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/ui/teacherheader";
import { Button } from "@/components/ui/button";
// import { Input } from "@/app/dashboard/ui/input";
// import { Label } from "@/app/dashboard/ui/label";
// import { Textarea } from "@/app/dashboard/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Pencil,
  Save,
  Upload,
  UserCircle,
  Mail,
  BookOpen,
  GraduationCap,
  Clock,
  Phone,
  MapPin,
  Cpu,
  LockKeyhole,
} from "lucide-react";

import { teacherProfile } from "@/app/lib/teacherProfile";

import { add } from "date-fns";
import { profile } from "console";

export default function TeacherProfile() {
  const [showImageUpload, setShowImageUpload] = useState(false);

  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    branch: "",
    preferences: {
      theme: "dark",
      notifications: true,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await teacherProfile();
        setProfileData(data.teacher);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // const handleSave = () => {
  //   setIsEditing(false);
  //   console.log("Saving profile:", teacherData);
  // };

  return (
    <div className="min-h-screen text-white">
      <Header />
      <div className="mx-auto lg:w-1/2 md:w-3/4  w-full p-6">
        <div className="">
          {/*Basic Info */}
          <Card className="bg-gray-900/50 border-gray-800 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col justify-center align-middle items-center text-center">
                <div className="">
                  <Avatar className="w-32 h-32 border-4 border-blue-600/20">
                    <AvatarImage
                      src="/placeholder-avatar.jpg"
                      alt="profile-image"
                    />
                    <AvatarFallback>
                      <UserCircle className="w-20 h-20" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.branch}</span>
                  </div>
                </div>

                <div className="w-full flex justify-evenly items-center text-lg mt-6 space-y-5">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                      <span>{`${profileData.firstname} ${profileData.lastname}`}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-gray-400" />
                      <span>{`${profileData.branch}`}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-center bg-[#334166] hover:bg-[#334188] text-white"
                      onClick={() => {
                        // function
                      }}
                    >
                      <LockKeyhole className="mr-2 h-4 w-4" />
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
