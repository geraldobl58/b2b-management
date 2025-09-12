# Componentes de Dialog Genéricos

Esta pasta contém componentes de dialog reutilizáveis para diferentes casos de uso no sistema.

## 📋 Componentes Disponíveis

### 1. ConfirmationDialog
Dialog para confirmações simples (excluir, confirmar ação, etc.)

**Variantes disponíveis:**
- `delete` - Para exclusões (vermelho, ícone lixeira)
- `warning` - Para avisos (amarelo, ícone alerta)
- `info` - Para informações (azul, ícone info)
- `confirm` - Para confirmações (verde, ícone check)

**Exemplo de uso:**
```tsx
import { useConfirmationDialog } from '@/components/common';

const MyComponent = () => {
  const deleteDialog = useConfirmationDialog({
    title: "Excluir Item",
    message: "Tem certeza que deseja excluir este item?",
    variant: "delete",
    confirmText: "Sim, excluir"
  });

  return (
    <>
      <button onClick={deleteDialog.showDialog}>
        Excluir
      </button>
      
      <deleteDialog.DialogComponent 
        onConfirm={async () => {
          await deleteItem();
        }}
      />
    </>
  );
};
```

### 2. GenericDialog
Dialog genérico para conteúdo personalizado com botões configuráveis.

**Recursos:**
- Múltiplos botões de ação
- Ações no header
- Diferentes tamanhos e configurações
- Alinhamento customizável dos botões

**Exemplo de uso:**
```tsx
import { useGenericDialog } from '@/components/common';

const MyComponent = () => {
  const dialog = useGenericDialog({
    title: "Configurações Avançadas",
    maxWidth: "md"
  });

  return (
    <>
      <button onClick={dialog.showDialog}>
        Abrir Config
      </button>
      
      <dialog.DialogComponent
        primaryAction={{
          label: "Salvar",
          onClick: () => console.log("Salvando..."),
          color: "primary"
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: dialog.hideDialog
        }}
      >
        <div>Conteúdo personalizado aqui...</div>
      </dialog.DialogComponent>
    </>
  );
};
```

### 3. FormDialog
Dialog específico para formulários com validação e estados de loading.

**Modos disponíveis:**
- `create` - Para criação (botão "Criar" com ícone +)
- `edit` - Para edição (botão "Salvar" com ícone save)
- `view` - Para visualização (somente leitura)

**Exemplo de uso:**
```tsx
import { useFormDialog } from '@/components/common';

const MyComponent = () => {
  const formDialog = useFormDialog({
    title: "Criar Organização",
    mode: "create",
    onSuccess: () => {
      // Atualizar lista ou fazer redirect
      console.log("Criado com sucesso!");
    }
  });

  return (
    <>
      <button onClick={formDialog.showDialog}>
        Nova Organização
      </button>
      
      <formDialog.DialogComponent
        onSubmit={async () => {
          // Lógica de submit do formulário
          await createOrganization(formData);
        }}
      >
        <div>
          {/* Campos do formulário aqui */}
          <input type="text" placeholder="Nome" />
          <input type="text" placeholder="Slug" />
        </div>
      </formDialog.DialogComponent>
    </>
  );
};
```

## 🎨 Personalização

Todos os componentes suportam:
- ✅ Diferentes tamanhos (xs, sm, md, lg, xl)
- ✅ Modo fullscreen
- ✅ Customização de cores
- ✅ Estados de loading
- ✅ Ações personalizadas
- ✅ Hooks para facilitar o uso
- ✅ TypeScript completo

## 🚀 Benefícios

- **Consistência:** UI unificada em todo o sistema
- **Produtividade:** Menos código repetitivo
- **Manutenibilidade:** Mudanças centralizadas
- **Acessibilidade:** Componentes acessíveis por padrão
- **Flexibilidade:** Altamente customizáveis