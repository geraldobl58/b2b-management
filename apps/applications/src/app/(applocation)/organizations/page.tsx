import { DashboardLayout } from "@/components/layout/app-layout";
import { ListOrganization } from "./components/list-organization";
import { OrganizationForm } from "./components/organization-form";

const OrganizationsPage = () => {
  return (
    <DashboardLayout title="Gerenciamento completo de organizações">
      <div className="space-y-8">
        <OrganizationForm />
        <ListOrganization />
      </div>
    </DashboardLayout>
  );
};

export default OrganizationsPage;
