import { DashboardLayout } from "@/components/layout/app-layout";
import { FormOrganization } from "./components/form-organization";
import { ListOrganization } from "./components/list-organization";

const OrganizationsPage = () => {
  return (
    <DashboardLayout title="Gerenciamento completo de organizações">
      <div className="space-y-8">
        <FormOrganization />
        <ListOrganization />
      </div>
    </DashboardLayout>
  );
};

export default OrganizationsPage;
