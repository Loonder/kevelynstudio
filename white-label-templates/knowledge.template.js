// =====================================================
// KNOWLEDGE BASE - Gabriela Kevelyn
// Toda a informação do estúdio em formato estruturado
// =====================================================

const KNOWLEDGE = {
    professional: {
        name: 'Gabriela Kevelyn',
        title: 'Master Lash Designer & Founder',
        phone: '5511967422133',
        website: 'https://kevelynstudio.com.br',
        instagram: '@kevelyn_beauty',
        greeting: 'Olá! 🌸 Bem-vinda ao *Kevelyn Studio*, sua referência em arquitetura do olhar.',
        pixKey: '230.515.438-02',
        pixName: 'Kevelyn Beauty Company',
        pixCity: 'ITAPECERICA DA SERRA'
    },

    services: [
        {
            id: 'lash_design',
            name: 'Lash Design (Extensão)',
            price: 180,
            duration: '120 minutos',
            emoji: '✨',
            description: 'Técnica avançada de realce para um olhar volumoso e sofisticado.',
        },
        {
            id: 'design_estrategico',
            name: 'Design Estratégico',
            price: 60,
            duration: '40 minutos',
            emoji: '📐',
            description: 'Design personalizado respeitando o visagismo do seu rosto.',
        },
        {
            id: 'limpeza_pele',
            name: 'Limpeza de Pele Elite',
            price: 150,
            duration: '60 minutos',
            emoji: '🧼',
            description: 'Cuidado profundo para uma pele radiante e saudável.',
        },
        {
            id: 'visagismo',
            name: 'Consultoria Visagista',
            price: 120,
            duration: '45 minutos',
            emoji: '🎨',
            description: 'Análise completa da estrutura facial para um design exclusivo.',
        }
    ],

    locations: [
        {
            id: 'itapecerica',
            name: 'Itapecerica da Serra',
            address: 'R. Marajó, 9 - Jardim Santa Julia, Itapecerica da Serra - SP, 06867-440',
            emoji: '📍',
        }
    ],

    faq: [
        {
            id: 'cuidados',
            question: 'Quais os cuidados pós-extensão?',
            emoji: '💧',
            answer: 'Evite molhar nas primeiras 24h, higienize com espuma própria e penteie diariamente.',
        }
    ],

    emergency: {
        support: 'https://wa.me/5511967422133',
    },
};

module.exports = KNOWLEDGE;





