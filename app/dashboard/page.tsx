import AdminPage from "@/app/admin/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardPage({ searchParams }: { searchParams: { event?: string } }) {
  return <AdminPage searchParams={searchParams} />;
}
