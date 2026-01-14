
import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { sql } from "drizzle-orm";

/**
 * DATABASE SEED SCRIPT
 * Populates the blog_posts table with rich content and AI-generated imagery.
 */

const BLOG_POSTS = [
    // --- LASH EXPERTISE (1-8) ---
    {
        title: "A Arquitetura do Olhar: Volume Russo vs. Brasileiro",
        slug: "arquitetura-do-olhar-russo-vs-brasileiro",
        excerpt: "Uma análise técnica e estética sobre as duas técnicas mais requisitadas do momento. Entenda pesos, curvaturas e qual arquitetura favorece seu design facial.",
        coverImage: "/images/blog/arquitetura-do-olhar-russo-vs-brasileiro.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "No universo do design de cílios de alto padrão, a escolha da técnica não é apenas uma questão de 'mais' ou 'menos' volume. É uma questão de engenharia e estética. Duas construções dominam o cenário atual: o clássico e meticuloso Volume Russo e o inovador Volume Brasileiro." },
                { type: 'h2', text: "A Engenharia do Volume Russo" },
                { type: 'paragraph', text: "O Volume Russo é a alta costura dos cílios. Nesta técnica, criamos fans (leques) artesanais no momento da aplicação, utilizando de 3 a 6 fios ultrafinos (0.05mm ou 0.07mm) em cada fio natural. O resultado é uma densidade luxuosa, com uma textura 'fluffy' e acabamento aveludado impecável." },
                { type: 'blockquote', text: "Não se trata de peso, mas de dimensão. O Volume Russo bem executado é mais leve que muitas máscaras de cílios do mercado." },
                { type: 'h2', text: "A Revolução do Volume Brasileiro" },
                { type: 'paragraph', text: "O Volume Brasileiro (ou Fios Tecnológicos) trouxe praticidade com um visual único. Utilizamos fios em formato de 'Y' que já vêm pré-montados com uma base heat-bonded (termosselada). Isso cria um efeito de trama cruzada que oferece uma retenção extraordinária e um visual mais texturizado, lembrando o efeito de um delineado suave." },
                { type: 'paragraph', text: "A escolha entre um e outro deve considerar não apenas o gosto pessoal, mas a estrutura do fio natural. Para fios mais fragilizados, o Russo permite uma distribuição de peso mais personalizada. Para quem busca impacto com rapidez e durabilidade (retenção de até 30 dias), o Brasileiro é imbatível." }
            ]
        }
    },
    {
        title: "Lash Lifting: A Ciência por trás da Curvatura Natural",
        slug: "ciencia-lash-lifting",
        excerpt: "Desvendando a química que permite transformar fios retos em curvas perfeitas sem o uso de extensões sintéticas.",
        coverImage: "/images/blog/ciencia-lash-lifting.png",
        published: true,
        content: {
            blocks: [
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
                { type: 'h2', text: "Quem é a Candidata Ideal?" },
                { type: 'paragraph', text: "O Lifting é perfeito para quem possui fios naturais médios a longos, mas retos ou voltados para baixo. Não adiciona volume, mas revela o comprimento real do seu cílio que muitas vezes fica escondido. Com a tinta preta aplicada no final, o efeito 'rímel eterno' é garantido por até 8 semanas." }
            ]
        }
    },
    {
        title: "O Mito do Dano: Por que Extensões Bem Feitas Salvam seus Fios",
        slug: "mito-do-dano-extensoes",
        excerpt: "Extensões causam queda? Desmitificando o maior medo das clientes com base na anatomia e ciclo de crescimento capilar.",
        coverImage: "/images/blog/mito-do-dano-extensoes.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A frase 'meus cílios caíram todos' é o fantasma que assombra muitos estúdios. Mas, cientificamente, uma extensão corretamente aplicada é mais segura para o seu fio natural do que o uso diário de rímel à prova d'água e curvador mecânico." },
                { type: 'h2', text: "O Isolamento é a Chave" },
                { type: 'paragraph', text: "O segredo da saúde ocular está em uma única palavra: **Isolamento**. Cada fio natural deve receber apenas uma extensão (ou fan). Se dois fios naturais forem colados juntos, o que crescer mais rápido vai 'arrancar' o mais lento pela raiz, causando tração e alopecia por tensão." },
                { type: 'blockquote', text: "Um procedimento seguro leva tempo. Desconfie de aplicações completas feitas em menos de 1 hora." },
                { type: 'h2', text: "Respeitando a Fase Anágena" },
                { type: 'paragraph', text: "Nós estudamos o ciclo de vida do seu fio (Anágena, Catágena, Telógena). Jamais aplicamos um peso excessivo em um fio 'baby' (Bebê Anágeno). O Mapping Seguro envolve selecionar a espessura e comprimento corretos para cada estágio de crescimento do seu cílio natural." }
            ]
        }
    },
    {
        title: "Fox Eyes: A Tendência que Ousa Desafiar a Gravidade",
        slug: "fox-eyes-tendencia-gravidade",
        excerpt: "Como o efeito lifting sem cirurgia conquistou o mundo e a técnica de mapeamento L e M por trás desse olhar felino.",
        coverImage: "/images/blog/fox-eyes-tendencia-gravidade.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Inspirado por ícones como Bella Hadid, o Fox Eyes não é apenas um estilo de cílios; é uma ilusão de ótica projetada para alongar o eixo horizontal do olho, criando um efeito lifting temporal imediato." },
                { type: 'h2', text: "Curvaturas Especiais: L e M" },
                { type: 'paragraph', text: "Para alcançar esse efeito linear e ascendente, abandonamos as curvaturas tradicionais 'C' e 'D'. Utilizamos as curvaturas L e M, que possuem uma base reta e uma ponta angulada. Essa geometria permite que o fio se projete para fora antes de subir, criando o 'gatinho' extremo." },
                { type: 'blockquote', text: "O Fox Eyes não é para todos. Em olhos descendentes, ele corrige. Em olhos muito separados, ele pode exagerar a distância. O visagismo dita a regra." },
                { type: 'paragraph', text: "O mapping começa curto no canto interno e mantém-se contido até a metade do olho, explodindo em comprimento apenas no terço final. É uma técnica de precisão que exige um estudo facial detalhado para não 'entristecer' o olhar ao invés de levantar." }
            ]
        }
    },
    {
        title: "O Ritual de Manutenção: Por que 21 Dias é o Número Mágico?",
        slug: "ritual-manutencao-21-dias",
        excerpt: "Entendendo o ciclo de troca natural dos fios e por que respeitar o prazo de manutenção é vital para a saúde ocular.",
        coverImage: "/images/blog/ritual-manutencao-21-dias.png",
        published: true,
        content: {
            blocks: [
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
                { type: 'paragraph', text: "A manutenção de 21 dias não é apenas estética; é uma questão de saúde. Removemos os fios crescidos (que estão perigosos) e repomos os que caíram, mantendo o equilíbrio de peso ideal." }
            ]
        }
    },
    {
        title: "Higienização Premium: O Segredo da Retenção de 4 Semanas",
        slug: "higienizacao-premium-retencao",
        excerpt: "Água não é inimiga, é aliada. Como a limpeza correta previne a polimerização de choque e aumenta a durabilidade.",
        coverImage: "/images/blog/higienizacao-premium-retencao.png",
        published: true,
        content: {
            blocks: [
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
                { type: 'paragraph', text: "Adote a limpeza diária como parte do seu skincare noturno. Seus olhos (e sua lash designer) agradecerão." }
            ]
        }
    },
    {
        title: "Visagismo Ocular: Personalizando o Mapping para Cada Rosto",
        slug: "visagismo-ocular-mapping",
        excerpt: "Não existe tamanho único. Como analisamos a distância, profundidade e ângulo dos seus olhos para criar a harmonia perfeita.",
        coverImage: "/images/blog/visagismo-ocular-mapping.png",
        published: true,
        content: {
            blocks: [
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
                { type: 'paragraph', text: "Nós não apenas aplicamos cílios; nós esculpimos o olhar. Entendemos as linhas de força do seu rosto para realçar o que você tem de melhor." }
            ]
        }
    },
    {
        title: "Alergias x Irritações: O que Você Precisa Saber sobre Adesivos",
        slug: "alergias-irritacoes-adesivos",
        excerpt: "A ciência do Cianoacrilato. Diferencie uma reação química comum de uma resposta imune e saiba como procedemos com segurança.",
        coverImage: "/images/blog/alergias-irritacoes-adesivos.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A segurança é o pilar do nosso estúdio. Trabalhamos com cianoacrilatos de grau médico e baixo teor de formaldeído, mas é crucial entender a química envolvida." },
                { type: 'h2', text: "Irritação vs. Alergia" },
                { type: 'paragraph', text: "Irritação é local e temporária. Ocorre quando os vapores da cola entram em contato com o globo ocular (geralmente se o olho abre levemente durante o procedimento). Resolve-se em 24h e não impede novas aplicações." },
                { type: 'paragraph', text: "Alergia é sistêmica e cumulativa. O corpo desenvolve anticorpos contra o acrilato. Manifesta-se com inchaço (edema) nas pálpebras, coceira intensa e descamação após 48h. Se você desenvolver alergia, infelizmente, não poderá mais usar extensões." },
                { type: 'blockquote', text: "O uso do Nano Mister no final do procedimento ajuda a polimerizar a cola rapidamente, reduzindo a emissão de vapores e o risco de irritações." }
            ]
        }
    },
    // --- BROW ARTISTRY (9-14) ---
    {
        title: "Brow Lamination: A Textura Selvagem que Dominou as Passarelas",
        slug: "brow-lamination-textura-selvagem",
        excerpt: "Do backstage para a vida real. Como o alisamento químico das sobrancelhas cria volume, preenche falhas e rejuvenescimento.",
        coverImage: "/images/blog/brow-lamination-textura-selvagem.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A estética 'clean girl' trouxe as sobrancelhas para o centro das atenções, mas não de qualquer jeito. Queremos textura, volume e um toque de rebeldia controlada. A Brow Lamination é a resposta." },
                { type: 'h2', text: "O Processo Químico" },
                { type: 'paragraph', text: "Similar a um permanente capilar, usamos compostos seguros (tioglicolato de amônia ou cisteamina) para quebrar as pontes de enxofre do fio. Isso nos permite reposicionar o pelo na direção vertical, cobrindo falhas e duplicando visualmente a espessura da sobrancelha." },
                { type: 'blockquote', text: "Nutrição é obrigatória. O procedimento finaliza com um 'Botox' de fios, rico em óleos e queratina para repor a massa perdida." }
            ]
        }
    },
    {
        title: "Nanoblading vs. Microblading: A Evolução do Realismo",
        slug: "nanoblading-vs-microblading",
        excerpt: "A agulha diminuiu, o realismo aumentou. Por que o Nanoblading é a escolha superior para fios ultra-realistas e sem traumas.",
        coverImage: "/images/blog/nanoblading-vs-microblading.png",
        published: true,
        content: {
            blocks: [
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
                { type: 'paragraph', text: "O resultado é uma sobrancelha que flui, sem aquele aspecto 'tatuado' ou estático. É sobre preencher o que falta sem apagar o que existe." }
            ]
        }
    },
    {
        title: "A Matemática da Sobrancelha Perfeita: Proporção Áurea",
        slug: "matematica-sobrancelha-proporcao-aurea",
        excerpt: "Phi (1.618). Como usamos a constante divina e o paquímetro para encontrar o design ideal oculto na sua estrutura óssea.",
        coverImage: "/images/blog/matematica-sobrancelha-proporcao-aurea.png",
        published: true,
        content: {
            blocks: [
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
                { type: 'paragraph', text: "Ao respeitar essas medidas, devolvemos a simetria ao rosto de forma subconsciente. O cérebro humano é programado para achar a simetria atraente." }
            ]
        }
    },
    {
        title: "Recuperação de Sobrancelhas: Do Pinçamento Excessivo ao Volume",
        slug: "recuperacao-sobrancelhas-crescimento",
        excerpt: "Anos de pinça fina deixaram marcas. Conheça os protocolos de argiloterapia e estimulação que podem trazer seus fios de volta.",
        coverImage: "/images/blog/recuperacao-sobrancelhas-crescimento.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Se você viveu os anos 90 e 2000, provavelmente foi vítima da moda das sobrancelhas finas. O trauma repetitivo da pinça pode causar alopecia por tração, mas nem tudo está perdido." },
                { type: 'h2', text: "O Protocolo de Resgate" },
                { type: 'paragraph', text: "A paciência é a chave, mas aceleramos o processo com ciência:" },
                {
                    type: 'list', items: [
                        "Argiloterapia: Desintoxica o bulbo capilar e estimula a circulação.",
                        "Alta Frequência: O ozônio é bactericida e vasodilatador, nutrindo a raiz.",
                        "Fatores de Crescimento: Blends de óleos essenciais (alecrim, rícino) para uso home care."
                    ]
                },
                { type: 'blockquote', text: "A regra número 1: Esconda sua pinça. Deixe a limpeza apenas para o profissional." }
            ]
        }
    },
    {
        title: "Henna Ombré: Redefinindo o Conceito de Naturalidade",
        slug: "henna-ombre-naturalidade",
        excerpt: "Esqueça as sobrancelhas marcadas e escuras. A técnica Ombré cria um degradê suave que imita a sombra natural dos pelos.",
        coverImage: "/images/blog/henna-ombre-naturalidade.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A Henna sofre preconceito por trabalhos antigos que deixavam o visual 'carimbado'. A técnica Ombré veio para mudar isso, trazendo a sofisticação da maquiagem profissional para o design semi-permanente." },
                { type: 'h2', text: "O Efeito Degradê" },
                { type: 'paragraph', text: "O segredo está na saturação. Começamos com a cauda da sobrancelha bem definida e escura, e vamos clareando gradualmente em direção ao início (cabeça) da sobrancelha. O início deve ser etéreo, quase transparente, sem linhas duras." },
                { type: 'paragraph', text: "Isso cria leveza. O rosto não fica 'pesado'. Utilizamos misturas de tons frios e quentes para casar perfeitamente com a raiz do seu cabelo, fugindo do preto artificial." }
            ]
        }
    },
    {
        title: "Sobrancelhas Masculinas: O Design Invisível",
        slug: "sobrancelhas-masculinas-design-invisivel",
        excerpt: "Como limpar e alinhar o olhar masculino mantendo a virilidade e a naturalidade. Menos é, definitivamente, mais.",
        coverImage: "/images/blog/sobrancelhas-masculinas-design-invisivel.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "O homem moderno cuida da imagem, mas tem pavor de parecer artificial. O design masculino é uma arte de subtração estratégica." },
                { type: 'h2', text: "Retas e Naturais" },
                { type: 'paragraph', text: "Ao contrário do design feminino, que busca arcos e lifting, o masculino preza pela linearidade. Removemos apenas a glabela (monocelha) e os excessos muito fora do desenho, mantendo alguns fios dispersos para não criar uma linha muito 'polida'." },
                { type: 'blockquote', text: "O objetivo é que pareça que você nasceu assim, não que acabou de sair do salão." },
                { type: 'paragraph', text: "Às vezes, apenas aparar os fios longos e rebeldes já transforma a fisionomia, tirando o aspecto de cansaço ou braveza sem feminilizar o olhar." }
            ]
        }
    },
    {
        title: "A Experiência Kevelyn: Muito Além da Estética",
        slug: "experiencia-kevelyn-alem-estetica",
        excerpt: "Por que nos chamamos de 'Studio' e não 'Salão'. Um mergulho no nosso conceito de atendimento sensorial e personalizado.",
        coverImage: "/images/blog/experiencia-kevelyn-alem-estetica.png",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Em um mundo acelerado, o luxo real é o tempo e a atenção. O Kevelyn Studio foi concebido não como uma fábrica de procedimentos, mas como um refúgio de autocuidado." },
                { type: 'h2', text: "O Menu Sensorial" },
                { type: 'paragraph', text: "Sua experiência começa antes de deitar na maca. Você define a temperatura da sala, a playlist que tocará durante seu procedimento e sua bebida de boas-vindas (de um espresso italiano a uma taça de espumante)." },
                { type: 'paragraph', text: "Nossas macas possuem colchões de densidade progressiva e mantas térmicas, pois sabemos que o conforto físico é essencial para que o procedimento seja um descanso, não um esforço." },
                { type: 'blockquote', text: "Cuidamos de você enquanto cuidamos do seu olhar." },
                { type: 'paragraph', text: "Aqui, você não é um horário na agenda. Você é a protagonista do nosso dia. Venha viver o seu momento." }
            ]
        }
    }
];

async function main() {
    console.log("🌱 Starting Blog Seed...");

    for (const post of BLOG_POSTS) {
        console.log(`Creating post: ${post.title}`);
        await db.insert(blogPosts).values(post).onConflictDoUpdate({
            target: blogPosts.slug,
            set: post
        });
    }

    console.log("✅ Blog Seed Completed!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
