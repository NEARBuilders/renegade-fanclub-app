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
import { faArrowRight, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ProfileResponse } from "@renegade-fanclub/types";

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

  return (
    <>
      {profile && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
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
