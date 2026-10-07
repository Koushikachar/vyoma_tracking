import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import LoginForm from "@/components/admin/LoginForm";
export const dynamic = "force-dynamic"; export const metadata = { title: "Sign in", robots: { index: false, follow: false } };
// Already signed in (valid session cookie)? Skip the form and go to the dashboard, so the login screen never appears next to the admin sidebar.
export default async function LoginPage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  if (await getSession()) redirect(`/control/${route}/dashboard`);
  return <LoginForm />;
}
