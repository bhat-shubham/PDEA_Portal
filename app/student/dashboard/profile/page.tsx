"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentHeader } from "@/components/ui/studentheader";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Phone, LockKeyhole, BookOpenCheck } from "lucide-react";
// import { studentProfile } from "@/app/lib/studentProfile";
import { profileHandler } from "@/app/lib/studentHandler";

export default function StudentProfile() {
  

  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    branch: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      const data = await profileHandler("profile", "GET");
      if (data && data.student) {
        setProfileData(data.student);
      } else {
        console.error("Failed to fetch valid student profile");
        setProfileData({
          firstname: "",
          lastname: "",
          email: "",
          branch: "",
          phone: "",
        });
      }
    };

    fetchStudent();
  }, []);

  return (
    <div className="min-h-screen text-white">
      <StudentHeader />
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
                <div className="w-full flex justify-evenly items-center text-lg mt-6 space-y-5">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                      <span>{`${profileData.firstname} ${profileData.lastname}`}</span>
                    </div>
                     <div className="flex items-center gap-3">
                      <BookOpenCheck className="w-5 h-5 text-gray-400" />
                      <span>{`${profileData.branch}`}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{`${profileData.phone}`}</span>
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
