export type ContentBlock =
    | { type: 'paragraph'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'h3'; text: string }
    | { type: 'image'; url: string; alt: string; caption?: string }
    | { type: 'blockquote'; text: string; author?: string }
    | { type: 'list'; items: string[] };

export interface BlogPost {
    title: string;
    slug: string;
    excerpt: string;
    coverImageUrl: string;
    category: 'Lashes' | 'Brows' | 'Lifestyle' | 'Studio' | 'Academy' | 'Business' | 'Dicas' | 'News' | 'Lips';
    date: string;
    readTime: string;
    author: {
        name: string;
        role: string;
        avatarUrl: string;
    };
    contentBlocks: ContentBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
    // --- LASH EXPERTISE (1-8) ---
    {
        title: "A Arquitetura do Olhar: Volume Russo vs. Brasileiro",
        slug: "arquitetura-do-olhar-russo-vs-brasileiro",
        excerpt: "Uma análise técnica e estética sobre as duas técnicas mais requisitadas do momento. Entenda pesos, curvaturas e qual arquitetura favorece seu design facial.",
        coverImageUrl: "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=1000&auto=format&fit=crop",
        category: "Lashes",
        date: "2024-03-10",
        readTime: "5 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "No universo do design de cílios de alto padrão, a escolha da técnica não é apenas uma questão de 'mais' ou 'menos' volume. É uma questão de engenharia e estética. Duas construções dominam o cenário atual: o clássico e meticuloso Volume Russo e o inovador Volume Brasileiro." },
            { type: 'h2', text: "A Engenharia do Volume Russo" },
            { type: 'paragraph', text: "O Volume Russo é a alta costura dos cílios. Nesta técnica, criamos fans (leques) artesanais no momento da aplicação, utilizando de 3 a 6 fios ultrafinos (0.05mm ou 0.07mm) em cada fio natural. O resultado é uma densidade luxuosa, com uma textura 'fluffy' e acabamento aveludado impecável." },
            { type: 'blockquote', text: "Não se trata de peso, mas de dimensão. O Volume Russo bem executado é mais leve que muitas máscaras de cílios do mercado." },
            { type: 'h2', text: "A Revolução do Volume Brasileiro" },
            { type: 'paragraph', text: "O Volume Brasileiro (ou Fios Tecnológicos) trouxe praticidade com um visual único. Utilizamos fios em formato de 'Y' que já vêm pré-montados com uma base heat-bonded (termosselada). Isso cria um efeito de trama cruzada que oferece uma retenção extraordinária e um visual mais texturizado, lembrando o efeito de um delineado suave." },
            { type: 'image', url: "https://images.unsplash.com/photo-1583001931096-959e9ad7b535?q=80&w=1000&auto=format&fit=crop", alt: "Comparação de fios Russo e Brasileiro", caption: "Esquerda: Fan artesanal Russo. Direita: Fio tecnológico Y." },
            { type: 'paragraph', text: "A escolha entre um e outro deve considerar não apenas o gosto pessoal, mas a estrutura do fio natural. Para fios mais fragilizados, o Russo permite uma distribuição de peso mais personalizada. Para quem busca impacto com rapidez e durabilidade (retenção de até 30 dias), o Brasileiro é imbatível." }
        ]
    },
    {
        title: "Lash Lifting: A Ciência por trás da Curvatura Natural",
        slug: "ciencia-lash-lifting",
        excerpt: "Desvendando a química que permite transformar fios retos em curvas perfeitas sem o uso de extensões sintéticas.",
        coverImageUrl: "https://images.unsplash.com/photo-1526045431048-f857369b2d20?q=80&w=1000&auto=format&fit=crop",
        category: "Lashes",
        date: "2024-03-08",
        readTime: "4 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "Em um mundo dominado pelas extensões, o Lash Lifting ressurge como o ápice da elegância natural. Mas não se engane: por trás da simplicidade visual, existe uma química complexa e precisa." },
            { type: 'h2', text: "Rompendo e Reconstruindo Pontes" },
            { type: 'paragraph', text: "A estrutura do fio é mantida por ligações de dissulfeto. O gel de passo 1 (redutor) age rompendo suavemente essas ligações, permitindo que o fio se torne maleável. É nesse momento que moldamos o fio sobre o 'shield' de silicone." },
            {
                type: 'list', items: [
                    "Passo 1: Amolecimento e moldagem da cutícula.",
                    "Passo 2: Neutralização e fixação da nova curvatura.",
                    "Passo 3: Nutrição profunda com queratina e vitaminas."
                ]
            },
            { type: 'image', url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop", alt: "Processo de Lash Lifting", caption: "Shields de silicone definem a curvatura desejada: L, M ou C." },
            { type: 'h2', text: "Quem é a Candidata Ideal?" },
            { type: 'paragraph', text: "O Lifting é perfeito para quem possui fios naturais médios a longos, mas retos ou voltados para baixo. Não adiciona volume, mas revela o comprimento real do seu cílio que muitas vezes fica escondido. Com a tinta preta aplicada no final, o efeito 'rímel eterno' é garantido por até 8 semanas." }
        ]
    },
    {
        title: "O Mito do Dano: Por que Extensões Bem Feitas Salvam seus Fios",
        slug: "mito-do-dano-extensoes",
        excerpt: "Extensões causam queda? Desmitificando o maior medo das clientes com base na anatomia e ciclo de crescimento capilar.",
        coverImageUrl: "https://images.unsplash.com/photo-1620331309609-b6b6f7055726?q=80&w=1000&auto=format&fit=crop",
        category: "Lashes",
        date: "2024-03-05",
        readTime: "6 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "A frase 'meus cílios caíram todos' é o fantasma que assombra muitos estúdios. Mas, cientificamente, uma extensão corretamente aplicada é mais segura para o seu fio natural do que o uso diário de rímel à prova d'água e curvador mecânico." },
            { type: 'h2', text: "O Isolamento é a Chave" },
            { type: 'paragraph', text: "O segredo da saúde ocular está em uma única palavra: **Isolamento**. Cada fio natural deve receber apenas uma extensão (ou fan). Se dois fios naturais forem colados juntos, o que crescer mais rápido vai 'arrancar' o mais lento pela raiz, causando tração e alopecia por tensão." },
            { type: 'blockquote', text: "Um procedimento seguro leva tempo. Desconfie de aplicações completas feitas em menos de 1 hora." },
            { type: 'h2', text: "Respeitando a Fase Anágena" },
            { type: 'paragraph', text: "Nós estudamos o ciclo de vida do seu fio (Anágena, Catágena, Telógena). Jamais aplicamos um peso excessivo em um fio 'baby' (Bebê Anágeno). O Mapping Seguro envolve selecionar a espessura e comprimento corretos para cada estágio de crescimento do seu cílio natural." },
            { type: 'image', url: "https://images.unsplash.com/photo-1596767746473-b3c951912f71?q=80&w=1000&auto=format&fit=crop", alt: "Isolamento perfeito de cílios", caption: "A precisão milimétrica previne danos permanentes." }
        ]
    },
    {
        title: "Fox Eyes: A Tendência que Ousa Desafiar a Gravidade",
        slug: "fox-eyes-tendencia-gravidade",
        excerpt: "Como o efeito lifting sem cirurgia conquistou o mundo e a técnica de mapeamento L e M por trás desse olhar felino.",
        coverImageUrl: "https://images.unsplash.com/photo-1481819613568-3701cbc70156?q=80&w=1000&auto=format&fit=crop",
        category: "Lashes",
        date: "2024-03-01",
        readTime: "5 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "Inspirado por ícones como Bella Hadid, o Fox Eyes não é apenas um estilo de cílios; é uma ilusão de ótica projetada para alongar o eixo horizontal do olho, criando um efeito lifting temporal imediato." },
            { type: 'h2', text: "Curvaturas Especiais: L e M" },
            { type: 'paragraph', text: "Para alcançar esse efeito linear e ascendente, abandonamos as curvaturas tradicionais 'C' e 'D'. Utilizamos as curvaturas L e M, que possuem uma base reta e uma ponta angulada. Essa geometria permite que o fio se projete para fora antes de subir, criando o 'gatinho' extremo." },
            { type: 'blockquote', text: "O Fox Eyes não é para todos. Em olhos descendentes, ele corrige. Em olhos muito separados, ele pode exagerar a distância. O visagismo dita a regra." },
            { type: 'paragraph', text: "O mapping começa curto no canto interno e mantém-se contido até a metade do olho, explodindo em comprimento apenas no terço final. É uma técnica de precisão que exige um estudo facial detalhado para não 'entristecer' o olhar ao invés de levantar." },
            { type: 'image', url: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop", alt: "Mapping Fox Eyes", caption: "O efeito delineado que levanta a expressão." }
        ]
    },
    {
        title: "O Ritual de Manutenção: Por que 21 Dias é o Número Mágico?",
        slug: "ritual-manutencao-21-dias",
        excerpt: "Entendendo o ciclo de troca natural dos fios e por que respeitar o prazo de manutenção é vital para a saúde ocular.",
        coverImageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop",
        category: "Lashes",
        date: "2024-02-28",
        readTime: "4 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "Você perde entre 3 a 5 cílios naturais por dia. Ao final de 3 semanas, você perdeu cerca de 60 a 100 fios naturais (e as extensões coladas neles). É matemática biológica." },
            { type: 'h2', text: "O Perigo do Crescimento" },
            { type: 'paragraph', text: "Além dos fios que caem, os que ficam CRESCEM. Com o crescimento, a extensão se afasta da raiz. O peso do fio sintético se desloca para a ponta do fio natural, criando uma alavanca que pode torcer e quebrar o seu cílio." },
            {
                type: 'list', items: [
                    "1ª Semana: Olhar perfeito e preenchido.",
                    "2ª Semana: Leve perda de volume, algumas falhas imperceptíveis.",
                    "3ª Semana: Fios crescidos começam a pesar/torcer. Hora da manutenção!",
                    "4ª Semana: Falhas visíveis, risco de dano por tração."
                ]
            },
            { type: 'paragraph', text: "A manutenção de 21 dias não é apenas estética; é uma questão de saúde. Removemos os fios crescidos (que estão perigosos) e repomos os que caíram, mantendo o equilíbrio de peso ideal." },
            { type: 'image', url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop", alt: "Cílios com crescimento", caption: "Afastamento da raiz indica a necessidade urgente de manutenção." }
        ]
    },
    {
        title: "Higienização Premium: O Segredo da Retenção de 4 Semanas",
        slug: "higienizacao-premium-retencao",
        excerpt: "Água não é inimiga, é aliada. Como a limpeza correta previne a polimerização de choque e aumenta a durabilidade.",
        coverImageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000&auto=format&fit=crop",
        category: "Lashes",
        date: "2024-02-25",
        readTime: "3 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "Um dos mitos mais destrutivos da nossa indústria é o 'não molhar'. A oleosidade natural da sua pele é ácida e degrada o cianoacrilato (cola) muito mais rápido do que a água. Cílio sujo cai rápido. Cílio limpo dura." },
            { type: 'h2', text: "Protocolo de Limpeza Vogue" },
            {
                type: 'list', items: [
                    "Use um shampoo de pH neutro ou espumas específicas para cílios.",
                    "Use um pincel de cerdas macias para limpar entre os fios.",
                    "Enxágue com água fria em abundância.",
                    "Seque pressionando suavemente (sem esfregar) e penteie."
                ]
            },
            { type: 'blockquote', text: "A higiene previne a Blefarite, uma inflamação crônica causada pelo acúmulo de bactérias e ácaros na base dos cílios." },
            { type: 'paragraph', text: "Adote a limpeza diária como parte do seu skincare noturno. Seus olhos (e sua lash designer) agradecerão." },
            { type: 'image', url: "https://images.unsplash.com/photo-1571216447604-9c071a938c82?q=80&w=1000&auto=format&fit=crop", alt: "Espuma de limpeza nos cílios", caption: "A espuma densa remove impurezas microscópicas sem atrito." }
        ]
    },
    {
        title: "Visagismo Ocular: Personalizando o Mapping para Cada Rosto",
        slug: "visagismo-ocular-mapping",
        excerpt: "Não existe tamanho único. Como analisamos a distância, profundidade e ângulo dos seus olhos para criar a harmonia perfeita.",
        coverImageUrl: "https://images.unsplash.com/photo-1534839832876-0f730c446545?q=80&w=1000&auto=format&fit=crop",
        category: "Studio",
        date: "2024-02-20",
        readTime: "7 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "Você já viu cílios que parecem 'fechar' o olhar de alguém? Isso é erro de visagismo. No Kevelyn Studio, o mapping (mapa de tamanhos) é calculado matematicamente." },
            { type: 'h2', text: "Correções Estratégicas" },
            {
                type: 'list', items: [
                    "Olhos Caídos: Concentramos o ponto alto (maior comprimento) na íris ou final da sobrancelha, nunca no canto externo final.",
                    "Olhos Juntos: Alongamos os cantos externos para criar a ilusão de separação.",
                    "Olhos Profundos: Usamos curvaturas mais acentuadas (D, DD) para projetar os cílios para fora da cavidade ocular.",
                    "Pálpebra Gordinha/Asiática: Curvaturas L e M evitam que os cílios encostem na pele, garantindo conforto e estética."
                ]
            },
            { type: 'paragraph', text: "Nós não apenas aplicamos cílios; nós esculpimos o olhar. Entendemos as linhas de força do seu rosto para realçar o que você tem de melhor." },
            { type: 'image', url: "https://images.unsplash.com/photo-1596767746473-b3c951912f71?q=80&w=1000&auto=format&fit=crop", alt: "Análise de visagismo", caption: "Medições precisas garantem a simetria e harmonia facial." }
        ]
    },
    {
        title: "Alergias x Irritações: O que Você Precisa Saber sobre Adesivos",
        slug: "alergias-irritacoes-adesivos",
        excerpt: "A ciência do Cianoacrilato. Diferencie uma reação química comum de uma resposta imune e saiba como procedemos com segurança.",
        coverImageUrl: "https://images.unsplash.com/photo-1620331309609-b6b6f7055726?q=80&w=1000&auto=format&fit=crop",
        category: "Dicas",
        date: "2024-02-15",
        readTime: "5 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "A segurança é o pilar do nosso estúdio. Trabalhamos com cianoacrilatos de grau médico e baixo teor de formaldeído, mas é crucial entender a química envolvida." },
            { type: 'h2', text: "Irritação vs. Alergia" },
            { type: 'paragraph', text: "Irritação é local e temporária. Ocorre quando os vapores da cola entram em contato com o globo ocular (geralmente se o olho abre levemente durante o procedimento). Resolve-se em 24h e não impede novas aplicações." },
            { type: 'paragraph', text: "Alergia é sistêmica e cumulativa. O corpo desenvolve anticorpos contra o acrilato. Manifesta-se com inchaço (edema) nas pálpebras, coceira intensa e descamação após 48h. Se você desenvolver alergia, infelizmente, não poderá mais usar extensões." },
            { type: 'blockquote', text: "O uso do Nano Mister no final do procedimento ajuda a polimerizar a cola rapidamente, reduzindo a emissão de vapores e o risco de irritações." },
            { type: 'image', url: "https://images.unsplash.com/photo-1620331317586-35759fcce82e?q=80&w=1000&auto=format&fit=crop", alt: "Olho saudável pós procedimento", caption: "Olhos claros e sem vermelhidão são o padrão de uma aplicação segura." }
        ]
    },
    // --- BROW ARTISTRY (9-14) ---
    {
        title: "Brow Lamination: A Textura Selvagem que Dominou as Passarelas",
        slug: "brow-lamination-textura-selvagem",
        excerpt: "Do backstage para a vida real. Como o alisamento químico das sobrancelhas cria volume, preenche falhas e rejuvenescimento.",
        coverImageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop",
        category: "Brows",
        date: "2024-02-10",
        readTime: "4 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "A estética 'clean girl' trouxe as sobrancelhas para o centro das atenções, mas não de qualquer jeito. Queremos textura, volume e um toque de rebeldia controlada. A Brow Lamination é a resposta." },
            { type: 'h2', text: "O Processo Químico" },
            { type: 'paragraph', text: "Similar a um permanente capilar, usamos compostos seguros (tioglicolato de amônia ou cisteamina) para quebrar as pontes de enxofre do fio. Isso nos permite reposicionar o pelo na direção vertical, cobrindo falhas e duplicando visualmente a espessura da sobrancelha." },
            { type: 'blockquote', text: "Nutrição é obrigatória. O procedimento finaliza com um 'Botox' de fios, rico em óleos e queratina para repor a massa perdida." },
            { type: 'image', url: "https://images.unsplash.com/photo-1588510860550-934d40fb1768?q=80&w=1000&auto=format&fit=crop", alt: "Brow Lamination Resultado", caption: "Os fios direcionados para cima abrem o olhar instantaneamente." }
        ]
    },
    {
        title: "Nanoblading vs. Microblading: A Evolução do Realismo",
        slug: "nanoblading-vs-microblading",
        excerpt: "A agulha diminuiu, o realismo aumentou. Por que o Nanoblading é a escolha superior para fios ultra-realistas e sem traumas.",
        coverImageUrl: "https://images.unsplash.com/photo-1596767746473-b3c951912f71?q=80&w=1000&auto=format&fit=crop",
        category: "Brows",
        date: "2024-02-05",
        readTime: "6 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "O Microblading revolucionou o mercado anos atrás, mas a tecnologia não parou. O Nanoblading (ou Nanofios) é a evolução refinada que entrega resultados imperceptíveis a olho nu." },
            { type: 'h2', text: "A Diferença Está na Lâmina" },
            { type: 'paragraph', text: "Enquanto o Microblading usa lâminas de 0.20mm a 0.25mm, o Nanoblading utiliza 'nanoagulhas' de 0.15mm a 0.18mm. Isso significa:" },
            {
                type: 'list', items: [
                    "Menor trauma na pele (menos inflamação).",
                    "Fios mais finos e curvos, imitando a sinuosidade natural.",
                    "Cicatrização mais rápida e com menos expansão do pigmento."
                ]
            },
            { type: 'paragraph', text: "O resultado é uma sobrancelha que flui, sem aquele aspecto 'tatuado' ou estático. É sobre preencher o que falta sem apagar o que existe." },
            { type: 'image', url: "https://images.unsplash.com/photo-1620331309609-b6b6f7055726?q=80&w=1000&auto=format&fit=crop", alt: "Detalhe de Nanofios", caption: "É difícil distinguir onde termina o fio natural e começa o pigmento." }
        ]
    },
    {
        title: "A Matemática da Sobrancelha Perfeita: Proporção Áurea",
        slug: "matematica-sobrancelha-proporcao-aurea",
        excerpt: "Phi (1.618). Como usamos a constante divina e o paquímetro para encontrar o design ideal oculto na sua estrutura óssea.",
        coverImageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop",
        category: "Brows",
        date: "2024-02-01",
        readTime: "5 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "A beleza é, em muitos níveis, matemática. Leonardo da Vinci usava a Proporção Áurea, e nós também. No design de sobrancelhas, não adivinhamos; medimos." },
            { type: 'h2', text: "O Mapeamento Geométrico" },
            { type: 'paragraph', text: "Usamos um compasso de proporção áurea e paquímetro para definir os três pontos cruciais:" },
            {
                type: 'list', items: [
                    "Ponto Inicial: Alinhado com a aba do nariz e o canal lacrimal.",
                    "Ponto Alto (Apex): Onde a sobrancelha arquela, definido por uma linha que passa pela íris.",
                    "Ponto Final: O limite harmônico para não 'derreter' o olhar."
                ]
            },
            { type: 'paragraph', text: "Ao respeitar essas medidas, devolvemos a simetria ao rosto de forma subconsciente. O cérebro humano é programado para achar a simetria atraente." },
            { type: 'image', url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000&auto=format&fit=crop", alt: "Marcação geométrica facial", caption: "A ciência por trás da arte do design." }
        ]
    },
    {
        title: "Recuperação de Sobrancelhas: Do Pinçamento Excessivo ao Volume",
        slug: "recuperacao-sobrancelhas-crescimento",
        excerpt: "Anos de pinça fina deixaram marcas. Conheça os protocolos de argiloprocedimento e estimulação que podem trazer seus fios de volta.",
        coverImageUrl: "https://images.unsplash.com/photo-1583001931096-959e9ad7b535?q=80&w=1000&auto=format&fit=crop",
        category: "Brows",
        date: "2024-01-28",
        readTime: "4 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "Se você viveu os anos 90 e 2000, provavelmente foi vítima da moda das sobrancelhas finas. O trauma repetitivo da pinça pode causar alopecia por tração, mas nem tudo está perdido." },
            { type: 'h2', text: "O Protocolo de Resgate" },
            { type: 'paragraph', text: "A paciência é a chave, mas aceleramos o processo com ciência:" },
            {
                type: 'list', items: [
                    "Argiloprocedimento: Desintoxica o bulbo capilar e estimula a circulação.",
                    "Alta Frequência: O ozônio é bactericida e vasodilatador, nutrindo a raiz.",
                    "Fatores de Crescimento: Blends de óleos essenciais (alecrim, rícino) para uso home care."
                ]
            },
            { type: 'blockquote', text: "A regra número 1: Esconda sua pinça. Deixe a limpeza apenas para o profissional." },
            { type: 'image', url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop", alt: "Aplicação de sérum nas sobrancelhas", caption: "A constância no tratamento home care define 50% do resultado." }
        ]
    },
    {
        title: "Henna Ombré: Redefinindo o Conceito de Naturalidade",
        slug: "henna-ombre-naturalidade",
        excerpt: "Esqueça as sobrancelhas marcadas e escuras. A técnica Ombré cria um degradê suave que imita a sombra natural dos pelos.",
        coverImageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop",
        category: "Brows",
        date: "2024-01-25",
        readTime: "3 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "A Henna sofre preconceito por trabalhos antigos que deixavam o visual 'carimbado'. A técnica Ombré veio para mudar isso, trazendo a sofisticação da maquiagem profissional para o design semi-permanente." },
            { type: 'h2', text: "O Efeito Degradê" },
            { type: 'paragraph', text: "O segredo está na saturação. Começamos com a cauda da sobrancelha bem definida e escura, e vamos clareando gradualmente em direção ao início (cabeça) da sobrancelha. O início deve ser etéreo, quase transparente, sem linhas duras." },
            { type: 'paragraph', text: "Isso cria leveza. O rosto não fica 'pesado'. Utilizamos misturas de tons frios e quentes para casar perfeitamente com os seus pelos naturais, fugindo do preto artificial." },
            { type: 'image', url: "https://images.unsplash.com/photo-1481819613568-3701cbc70156?q=80&w=1000&auto=format&fit=crop", alt: "Sobrancelha com efeito Ombré", caption: "Suavidade no início, definição no final. O equilíbrio perfeito." }
        ]
    },
    {
        title: "Sobrancelhas Masculinas: O Design Invisível",
        slug: "sobrancelhas-masculinas-design-invisivel",
        excerpt: "Como limpar e alinhar o olhar masculino mantendo a virilidade e a naturalidade. Menos é, definitivamente, mais.",
        coverImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
        category: "Brows",
        date: "2024-01-20",
        readTime: "3 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Master Lash Designer",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "O homem moderno cuida da imagem, mas tem pavor de parecer artificial. O design masculino é uma arte de subtração estratégica." },
            { type: 'h2', text: "Retas e Naturais" },
            { type: 'paragraph', text: "Ao contrário do design feminino, que busca arcos e lifting, o masculino preza pela linearidade. Removemos apenas a glabela (monocelha) e os excessos muito fora do desenho, mantendo alguns fios dispersos para não criar uma linha muito 'polida'." },
            { type: 'blockquote', text: "O objetivo é que pareça que você nasceu assim, não que acabou de sair do salão." },
            { type: 'paragraph', text: "Às vezes, apenas aparar os fios longos e rebeldes já transforma a fisionomia, tirando o aspecto de cansaço ou braveza sem feminilizar o olhar." },
            { type: 'image', url: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop", alt: "Olhar masculino groomed", caption: "Limpeza estratégica que valoriza a estrutura óssea masculina." }
        ]
    },
    // --- LIFESTYLE & STUDIO (15) ---
    {
        title: "A Experiência Kevelyn: Muito Além da Estética",
        slug: "experiencia-kevelyn-alem-estetica",
        excerpt: "Por que nos chamamos de 'Studio' e não 'Salão'. Um mergulho no nosso conceito de atendimento sensorial e personalizado.",
        coverImageUrl: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1000&auto=format&fit=crop",
        category: "Lifestyle",
        date: "2024-01-15",
        readTime: "4 min",
        author: {
            name: "Kevelyn Bileski",
            role: "Founder",
            avatarUrl: "/assets/images/kevelyn-avatar.jpg"
        },
        contentBlocks: [
            { type: 'paragraph', text: "Em um mundo acelerado, o luxo real é o tempo e a atenção. O Kevelyn Studio foi concebido não como uma fábrica de procedimentos, mas como um refúgio de autocuidado." },
            { type: 'h2', text: "O Menu Sensorial" },
            { type: 'paragraph', text: "Sua experiência começa antes de deitar na maca. Você define a temperatura da sala, a playlist que tocará durante seu procedimento e sua bebida de boas-vindas (de um espresso italiano a uma taça de espumante)." },
            { type: 'paragraph', text: "Nossas macas possuem colchões de densidade progressiva e mantas térmicas, pois sabemos que o conforto físico é essencial para que o procedimento seja um descanso, não um esforço." },
            { type: 'blockquote', text: "Cuidamos de você enquanto cuidamos do seu olhar." },
            { type: 'paragraph', text: "Aqui, você não é um horário na agenda. Você é a protagonista do nosso dia. Venha viver o seu momento." },
            { type: 'image', url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000&auto=format&fit=crop", alt: "Interior do Kevelyn Studio", caption: "Design, conforto e exclusividade em cada detalhe." }
        ]
    }
];





