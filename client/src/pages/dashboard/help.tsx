import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardHelp() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-500">
          Find help articles and contact support.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Help and support content coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}