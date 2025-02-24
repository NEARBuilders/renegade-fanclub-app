import { getUserProfile } from "@/lib/api/user";
import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const [profile] = await Promise.all([getUserProfile()]);

  return (
    <>
      <Header showtitle={true} showBackButton={true} />
      <Container>
        <div className="px-2 pb-20 space-y-6">
          <SettingsForm profile={profile} />
        </div>
      </Container>
    </>
  );
}
