"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/api/user";
import { logout } from "@/lib/auth";
import {
  faArrowRight,
  faCheck,
  faCircleNotch,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ProfileResponse } from "@renegade-fanclub/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(7, {
      message: "Email must be at least 7 characters.",
    })
    .max(50, {
      message: "Email must not exceed 50 characters.",
    }),
});

type FormData = z.infer<typeof FormSchema>;

interface SettingsFormProps {
  profile: ProfileResponse | null;
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: profile?.email || "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!isDirty) return;

    try {
      setIsLoading(true);
      await updateUserProfile({
        email: data.email,
      });
      setIsDirty(false);
      router.refresh();
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
  ) => {
    setIsDirty(event.target.value !== profile?.email);
    onChange(event);
  };

  const avatarSubmit = async () => {
    if (!selectedFile) return;
    const fileUrl = selectedFile; // Upload avatar to Supabase storage then update link here
    try {
      setIsLoading(true);
      await updateUserProfile({
        avatar: fileUrl,
      });
      router.refresh();
      toast({
        title: "Success",
        description: "Avatar updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update avatar. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setSelectedFile(URL.createObjectURL(file));
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Only JPG and PNG files are allowed.",
      });
    }
  };
  return (
    <>
      {profile && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              <Label className="text-sm font-medium text-white">
                Profile Image
              </Label>
              <input
                type="file"
                name="avatar"
                accept="image/png, image/jpeg"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="relative">
                <Avatar
                  className="h-28 w-28 border-2 border-white/10 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AvatarImage
                    src={selectedFile || profile?.avatar || undefined}
                    alt={profile?.username || "User"}
                  />
                  <AvatarFallback className="bg-white/5 text-lg">
                    {profile?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Edit Icon 
                <FontAwesomeIcon
                  icon={faPencil}
                  className="absolute top-1 right-1 h-3 w-3 bg-white/80 p-1 rounded-full text-black shadow-md transition-colors cursor-pointer"
                  title="Edit Avatar"
                  onClick={() => fileInputRef.current?.click()}
                /> */}
              </div>

              {selectedFile && (
                <FontAwesomeIcon
                  icon={isLoading ? faCircleNotch : faCheck}
                  onClick={avatarSubmit}
                  className={`bg-white p-2 rounded-full h-3 w-3 text-black cursor-pointer ${isLoading && "animate-spin"}`}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Email
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="abc@domain.com"
                        className="bg-white/5 rounded-xl px-4 py-6 border-white/10 text-white placeholder:text-white/40"
                        {...field}
                        onChange={(e) => handleInputChange(e, field.onChange)}
                      />
                    </FormControl>
                    {isDirty && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <button
                          className="text-white/60 hover:text-white transition-colors"
                          title="Save changes"
                          type="submit"
                        >
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-sm text-white/60 font-mono break-all">
                ID: {profile?.id}
              </p>
            </div>
          </form>
        </Form>
      )}
      <Button
        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500"
        variant="ghost"
        disabled={isLoading}
        onClick={async () => {
          try {
            await logout();
            router.replace("/");
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to logout. Please try again.",
            });
          }
        }}
      >
        {isLoading ? (
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="animate-spin h-4 w-4"
          />
        ) : (
          "Logout"
        )}
      </Button>
    </>
  );
}
