// L4: Centralized Strings / Simple i18n
// All user-facing strings should be defined here for easy maintenance
// Ready for future translation support (next-intl, react-i18next, etc.)

export const strings = {
    // Common actions
    actions: {
        save: "Salvar",
        cancel: "Cancelar",
        delete: "Excluir",
        edit: "Editar",
        close: "Fechar",
        confirm: "Confirmar",
        create: "Criar",
        add: "Adicionar",
        remove: "Remover",
        search: "Buscar",
        filter: "Filtrar",
        loading: "Carregando...",
    },

    // Appointment related
    appointments: {
        title: "Agendamento",
        titlePlural: "Agendamentos",
        create: "Novo Agendamento",
        edit: "Editar Agendamento",
        delete: "Cancelar Agendamento",
        deleteConfirm: "Tem certeza que deseja cancelar este agendamento?",
        reschedule: "Reagendar",
        details: "Detalhes do Agendamento",

        // Status
        statusPending: "Pendente",
        statusConfirmed: "Confirmado",
        statusCompleted: "Concluído",
        statusCancelled: "Cancelado",
        statusNoShow: "Falta",

        // Fields
        date: "Data",
        startTime: "Horário de Início",
        endTime: "Horário de Término",
        service: "Serviço",
        professional: "Profissional",
        client: "Cliente",
        status: "Status",
    },

    // Professionals
    professionals: {
        title: "Equipe",
        titleSingular: "Membro",
        add: "Novo Membro",
        edit: "Editar Membro",
        delete: "Excluir Membro",
        deleteConfirm: "Tem certeza que deseja excluir este membro da equipe?",
        name: "Nome",
        role: "Função",
        bio: "Bio",
        color: "Cor da Agenda",
        active: "Ativo",
        inactive: "Inativo",
    },

    // Validation errors
    errors: {
        required: "Campo obrigatório",
        invalidEmail: "E-mail inválido",
        invalidPhone: "Telefone inválido",
        endBeforeStart: "Horário de término deve ser após o horário de início",
        pastDate: "Não é possível agendar no passado",
        conflict: "Conflito de horário! Já existe agendamento neste período.",
        notFound: "Não encontrado",
        generic: "Ocorreu um erro. Tente novamente.",
        unauthorized: "Acesso não autorizado",
        networkError: "Erro de conexão. Verifique sua internet.",
    },

    // Success messages
    success: {
        saved: "Salvo com sucesso!",
        created: "Criado com sucesso!",
        updated: "Atualizado com sucesso!",
        deleted: "Excluído com sucesso!",
        appointmentUpdated: "Agendamento atualizado!",
        statusUpdated: "Status atualizado!",
    },

    // Calendar
    calendar: {
        today: "Hoje",
        week: "Semana",
        day: "Dia",
        month: "Mês",
        previous: "Anterior",
        next: "Próximo",
        noEvents: "Sem agendamentos",
        confirmMove: "Confirmar Alteração",
        movingAppointment: "Você está movendo um agendamento.",
    },

    // Auth
    auth: {
        login: "Entrar",
        logout: "Sair",
        register: "Cadastrar",
        forgotPassword: "Esqueci minha senha",
        email: "E-mail",
        password: "Senha",
        confirmPassword: "Confirmar Senha",
        name: "Nome",
        phone: "Telefone",
    },
} as const;

// Type-safe string accessor
export type StringKey = keyof typeof strings;
