import { DataTable } from "@/components/common/data-table";
import { columns } from "./columns";

const rows = [
  {
    id: 1,
    member: "John Smith",
    email: "john@acme.com",
    role: "Admin",
    dateJoined: "01/01/2025",
  },
];

export const ListMembers = () => {
  return (
    <>
      <DataTable
        data={rows}
        columns={columns}
        height="60vh"
        showPagination={true}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={5}
        dense={false}
        stickyHeader={true}
      />
      {/* Role Information */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Sobre as Funções
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>OWNER:</strong> Acesso total, incluindo exclusão da
            organização
          </p>
          <p>
            <strong>ADMIN:</strong> Gerenciar membros, configurações e todas as
            funcionalidades
          </p>
          <p>
            <strong>MANAGER:</strong> Gerenciar campanhas, leads e conteúdo
          </p>
          <p>
            <strong>ANALYST:</strong> Visualizar relatórios e métricas
          </p>
          <p>
            <strong>VIEWER:</strong> Acesso apenas de leitura
          </p>
        </div>
      </div>
    </>
  );
};
