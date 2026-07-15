import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardSettings() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Settings page coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}