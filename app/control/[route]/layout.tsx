import Sidebar from "@/components/admin/Sidebar";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import ThemeToggle from "@/components/ThemeToggle";
export const metadata = { robots: { index: false, follow: false } };
const NAV: [string, string, any][] = [
  ["dashboard", "Dashboard", "dashboard"],
  ["shipments", "Shipments", "shipments.read"],
  ["tracking-lab", "Tracking Lab", "shipments"],
  ["integrations", "Integrations", "carriers"],
  ["carrier-health", "Carrier Health", "carriers"],
  ["api-keys", "API Keys", "apikeys"],
  ["webhooks", "Webhooks", "webhooks"],
  ["users", "Users", "users"],
  ["settings", "Settings", "settings"],
  ["contact-messages", "Contact Messages", "contact"],
  ["audit-logs", "Audit Logs", "logs"],
  ["security", "Security", ""],
];
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ route: string }>;
}) {
  const { route } = await params;
  const s = await getSession();
  if (!s)
    return (
      <div className="admin min-h-screen text-fg">
        <div className="fixed right-4 top-4 z-10">
          <ThemeToggle className="border border-line bg-card" />
        </div>
        {children}
      </div>
    );
  return (
    <div className="admin min-h-screen text-fg md:flex">
      <Sidebar
        route={route}
        email={s.user.email}
        role={s.user.role}
        items={NAV.filter(([, , p]) => !p || can(s.user.role, p)).map(
          ([h, l]) => [h, l],
        )}
      />
      <div className="flex-1 min-w-0 pb-24 md:pb-0">{children}</div>
    </div>
  );
}
