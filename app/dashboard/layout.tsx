import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex container gap-20 mx-auto pt-6 w-full">
      <div>
        <SideNav />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
