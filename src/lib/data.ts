export type Category = "Brows" | "Lashes" | "Lips" | "Cílios" | "Sobrancelhas";

export interface Service {
    id: string;
    title: string;
    description: string;
    price: string;
    duration?: string;
    image: string;
    category: Category;
}

export const SERVICES: Service[] = [
    {
        id: "s1",
        title: "Volume Russo",
        category: "Cílios",
        price: "R$ 350",
        description: "Técnica artesanal de leques feitos à mão para volume intenso e sofisticação.",
        image: "/assets/images/service-lashes.png"
    },
    {
        id: "s2",
        title: "Wispy Effect",
        category: "Cílios",
        price: "R$ 380",
        description: "O famoso 'efeito Kim K'. Picos intercalados que criam textura e modernidade no olhar.",
        image: "/assets/images/hero-eye.png"
    },
    {
        id: "s3",
        title: "Brow Lamination",
        category: "Sobrancelhas",
        price: "R$ 220",
        description: "Reestruturação dos fios naturais para um efeito wild, encorpado e alinhado.",
        image: "/assets/images/service-brows.png"
    },
    {
        id: "s4",
        title: "Flow Brows",
        category: "Sobrancelhas",
        price: "R$ 680",
        description: "Nanoblading hiper-realista que simula fios naturais em movimento fluido.",
        image: "/assets/images/service-brows.png"
    },
    {
        id: "s5",
        title: "Fox Eyes",
        category: "Cílios",
        price: "R$ 320",
        description: "Alongamento estratégico no canto externo para um olhar alongado e sedutor.",
        image: "/assets/images/service-lashes.png"
    }
];
