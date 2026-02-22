export type Professional = {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    instagram: string;
    specialties: string[];
};

export const PROFESSIONALS: Professional[] = [
    {
        id: "kevelyn",
        name: "Gabriela Kevelyn",
        role: "Founder & Master Artist",
        bio: "Pioneira na técnica de Nanopigmentação Fio a Fio. Com mais de 2.000 alunas formadas, Gabriela Kevelyn transformou o mercado de beleza unindo precisão matemática e arte.",
        image: "/assets/images/reveal-portrait.jpg", // Using this existing asset for now
        instagram: "@kevelynbeauty",
        specialties: ["Nanopigmentação", "Micropigmentação Labial", "Cursos"]
    },
    {
        id: "ana",
        name: "Ana",
        role: "Lash Designer Senior",
        bio: "Especialista em visagismo do olhar. Ana cria designs de cílios que não apenas alongam, mas harmonizam com a estrutura facial de cada cliente.",
        image: "/assets/images/hero-parallax-fg.jpg",
        instagram: "@ana.lash",
        specialties: ["Lash Lifting", "Extensão Volume Russo", "Brow Lamination"]
    }
];





