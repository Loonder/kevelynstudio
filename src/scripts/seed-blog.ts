
import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { sql } from "drizzle-orm";

/**
 * DATABASE SEED SCRIPT
 * Populates the blog_posts table with rich content, categories, and LOCAL GENERATED imagery.
 * EXPANDED CONTENT for ~3 min read time.
 */

const BLOG_POSTS = [
    // --- LASH EXPERTISE (1-8) ---
    {
        title: "A Arquitetura do Olhar: Volume Russo vs. Brasileiro",
        slug: "arquitetura-do-olhar-russo-vs-brasileiro",
        excerpt: "Uma análise técnica e estética sobre as duas técnicas mais requisitadas do momento. Entenda pesos, curvaturas e qual arquitetura favorece seu design facial e estilo de vida.",
        coverImage: "/images/blog/arquitetura-do-olhar-russo-vs-brasileiro.png",
        category: "Lashes",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "No universo do design de cílios de alto padrão, a escolha da técnica não é apenas uma questão de 'mais' ou 'menos' volume. É uma questão de engenharia, estética e visagismo. Muitas clientes chegam ao estúdio com dúvidas sobre qual procedimento escolher, e a resposta quase sempre reside na análise da estrutura do fio natural e no desejo de imagem pessoal. Hoje, vamos desmistificar as duas construções que dominam o cenário atual: o clássico e meticuloso Volume Russo e o inovador Volume Brasileiro." },
                { type: 'h2', text: "A Engenharia do Volume Russo" },
                { type: 'paragraph', text: "O Volume Russo é considerado a alta costura dos cílios. Nesta técnica, não utilizamos fios pré-moldados. Pelo contrário, criamos fans (leques) artesanais no exato momento da aplicação, milimetricamente calculados para a densidade que o seu fio natural suporta. Utilizamos de 3 a 6 fios ultrafinos (espessuras de 0.05mm ou 0.07mm) acoplados em cada fio natural." },
                { type: 'paragraph', text: "Essa micro-engenharia permite criar uma densidade luxuosa, porém extremamente leve. O resultado é uma textura 'fluffy', macia ao toque e com um acabamento aveludado impecável, impossível de ser replicado com rímel ou cílios postiços comuns." },
                { type: 'blockquote', text: "Não se trata de peso, mas de dimensão. O Volume Russo bem executado é mais leve que muitas máscaras de cílios do mercado, pois o peso é distribuído em múltiplos fios de espessura mínima." },
                { type: 'h2', text: "A Revolução do Volume Brasileiro" },
                { type: 'paragraph', text: "O Volume Brasileiro, também conhecido como Fios Tecnológicos, trouxe praticidade aliada a um visual único e marcante. Diferente do Russo, aqui utilizamos fios em formato de 'Y' que já vêm pré-montados com uma base heat-bonded (termosselada), sem excesso de cola." },
                { type: 'paragraph', text: "A geometria em 'Y' cria um efeito de trama cruzada natural. Isso oferece uma retenção extraordinária, pois a base do fio 'abraça' o cílio natural com mais eficácia. Visualmente, o Brasileiro entrega um efeito mais texturizado, lembrando o efeito de um delineado suave, porém com uma 'pegada' mais moderna e estruturada." },
                { type: 'h2', text: "Qual escolher?" },
                { type: 'paragraph', text: "A escolha entre um e outro deve considerar não apenas o gosto pessoal, mas a estrutura do fio natural. Para fios mais fragilizados ou falhados, o Russo permite uma camuflagem melhor e uma distribuição de peso mais personalizada, preenchendo lacunas com leveza. Para quem busca impacto visual com rapidez na aplicação e durabilidade estendida (retenção de até 30 dias), o Brasileiro é imbatível." },
                { type: 'paragraph', text: "No Kevelyn Studio, realizamos uma avalição detalhada antes de qualquer procedimento. Seu olhar é único, e a técnica deve servir para realçar sua beleza natural, não mascará-la." }
            ]
        }
    },
    {
        title: "Lash Lifting: A Ciência por trás da Curvatura Natural",
        slug: "ciencia-lash-lifting",
        excerpt: "Desvendando a química que permite transformar fios retos em curvas perfeitas sem o uso de extensões sintéticas. A solução para quem busca elegância discreta.",
        coverImage: "/images/blog/ciencia-lash-lifting.png",
        category: "Lashes",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Em um mundo dominado pelas extensões volumosas, o Lash Lifting ressurge como o ápice da elegância natural e minimalista. É o procedimento ideal para a mulher moderna que valoriza a praticidade e deseja acordar pronta, sem a necessidade de manutenção quinzenal. Mas não se engane: por trás da simplicidade visual, existe uma química complexa e precisa." },
                { type: 'h2', text: "Rompendo e Reconstruindo Pontes" },
                { type: 'paragraph', text: "A estrutura do fio de cabelo (e dos cílios) é mantida rígida por ligações químicas chamadas pontes de dissulfeto. Para alterar o formato do fio, precisamos agir a nível molecular. O gel de passo 1 (redutor) age rompendo suavemente essas ligações, permitindo que a queratina do fio se torne maleável e assuma uma nova forma. É nesse momento crucial que moldamos o fio sobre o 'shield' de silicone, definindo se a curvatura será mais acentuada ou mais suave." },
                { type: 'paragraph', text: "O processo é dividido em três etapas fundamentais para garantir saúde e beleza:" },
                {
                    type: 'list', items: [
                        "Passo 1: Amolecimento e moldagem da cutícula com agentes redutores seguros.",
                        "Passo 2: Neutralização e fixação da nova curvatura através de agentes oxidantes que refazem as pontes de dissulfeto na nova posição.",
                        "Passo 3: Nutrição profunda (Lash Botox) com queratina hidrolisada, colágeno e vitaminas para repor massa e brilho."
                    ]
                },
                { type: 'h2', text: "Quem é a Candidata Ideal?" },
                { type: 'paragraph', text: "O Lifting é perfeito para quem possui fios naturais de médios a longos, mas que são retos ou voltados para baixo (comum em descendência asiática ou indígena). O procedimento não adiciona fios extras, mas revela o comprimento real do seu cílio que muitas vezes fica 'escondido' pela falta de curvatura." },
                { type: 'paragraph', text: "Com a tinta preta especial aplicada no final do processo, cria-se o efeito 'rímel eterno'. O resultado dura todo o ciclo de troca do fio, variando de 6 a 8 semanas, e sai gradualmente, sem necessidade de remoção. É a liberdade estética em sua forma mais pura." }
            ]
        }
    },
    {
        title: "O Mito do Dano: Por que Extensões Bem Feitas Salvam seus Fios",
        slug: "mito-do-dano-extensoes",
        excerpt: "Extensões causam queda? Desmitificando o maior medo das clientes com base na anatomia e ciclo de crescimento capilar.",
        coverImage: "/images/blog/mito-do-dano-extensoes.png",
        category: "Lashes",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A frase 'meus cílios caíram todos' é o fantasma que assombra muitos estúdios e afasta potenciais clientes. É compreensível o medo, dado o número de procedimentos mal executados no mercado. Mas, cientificamente e tecnicamente falando, uma extensão corretamente aplicada é, na verdade, mais segura para a integridade do seu fio natural do que o uso diário, agressivo e contínuo de rímel à prova d'água e curvador mecânico (curvex)." },
                { type: 'h2', text: "O Isolamento é a Chave Mestra" },
                { type: 'paragraph', text: "O segredo da saúde ocular e da preservação dos fios reside em uma única palavra: **Isolamento**. Durante o procedimento, cada fio natural deve ser isolado perfeitamente com as pinças. Cada extensão (ou fan) deve ser acoplada a apenas UM fio natural." },
                { type: 'paragraph', text: "Se dois fios naturais forem colados juntos (o temido 'stickie'), ocorrerá um desastre microscópico. Como cada fio cresce em uma velocidade diferente, o fio que crescer mais rápido vai começar a puxar o mais lento pela raiz. Isso causa desconforto, coceira e, eventualmente, alopecia por tração — arrancando o fio antes da hora." },
                { type: 'blockquote', text: "Um procedimento seguro leva tempo. Desconfie de aplicações completas feitas em menos de 1 hora. A pressa é inimiga do isolamento perfeito." },
                { type: 'h2', text: "Respeitando a Fase Anágena" },
                { type: 'paragraph', text: "Nossas profissionais são treinadas para identificar o ciclo de vida de cada um dos seus cílios (Anágena, Catágena, Telógena). Jamais aplicamos um peso excessivo ou uma extensão longa em um fio 'baby' (Bebê Anágeno), que acabou de nascer." },
                { type: 'paragraph', text: "O 'Mapping Seguro' envolve selecionar a espessura, curvatura e comprimento corretos para cada estágio de crescimento. Desta forma, o fio natural consegue crescer saudável e forte, carregando a extensão sem esforço até o final do seu ciclo vital natural. Suas extensões podem, e devem, ser um acessório de longo prazo, sem pausas, desde que a técnica seja impecável." }
            ]
        }
    },
    {
        title: "Fox Eyes: A Tendência que Ousa Desafiar a Gravidade",
        slug: "fox-eyes-tendencia-gravidade",
        excerpt: "Como o efeito lifting sem cirurgia conquistou o mundo e a técnica de mapeamento L e M por trás desse olhar felino e sedutor.",
        coverImage: "/images/blog/fox-eyes-tendencia-gravidade.png",
        category: "Lashes",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Inspirado por ícones da moda como Bella Hadid e Kendall Jenner, o Fox Eyes (Olhos de Raposa) transcendeu o status de tendência passageira para se tornar um clássico moderno. Não é apenas um estilo de cílios; é uma ilusão de ótica projetada para alongar o eixo horizontal do olho, criando um efeito lifting temporal imediato, como se o rosto estivesse sendo levemente puxado para cima e para fora." },
                { type: 'h2', text: "A Geometria das Curvaturas L e M" },
                { type: 'paragraph', text: "Para alcançar esse efeito linear, exótico e ascendente, precisamos abandonar as curvas arredondadas tradicionais como 'C' e 'D'. A mágica acontece com as curvaturas especiais L e M. Elas possuem uma base reta (para maior acoplagem) e uma ponta angulada drasticamente para cima." },
                { type: 'paragraph', text: "Essa geometria permite que o fio se projete para fora da pálpebra antes de subir. Isso cria o efeito de 'gatinho' extremo sem precisar de delineador. É uma arquitetura que abre o olhar sem arredondá-lo." },
                { type: 'blockquote', text: "O Fox Eyes não é para todos os rostos. Em olhos descendentes (caídos), ele corrige e levanta. Porém, em olhos muito separados, ele pode exagerar a distância. O visagismo dita a regra." },
                { type: 'paragraph', text: "O mapping para este estilo é muito específico: começamos com tamanhos curtos e naturais no canto interno e mantemos esse comprimento contido até quase a metade do olho. A 'explosão' de comprimento acontece apenas no terço final, no canto externo. É uma técnica de precisão que exige um estudo facial detalhado. Se feito incorretamente, pode pesar no canto externo e 'entristecer' o olhar ao invés de levantar. Por isso, a avaliação profissional é indispensável." }
            ]
        }
    },
    {
        title: "O Ritual de Manutenção: Por que 21 Dias é o Número Mágico?",
        slug: "ritual-manutencao-21-dias",
        excerpt: "Entendendo o ciclo de troca natural dos fios e por que respeitar o prazo de manutenção é vital para a saúde ocular e beleza constante.",
        coverImage: "/images/blog/ritual-manutencao-21-dias.png",
        category: "Lashes",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Muitas clientes perguntam: 'Por que preciso voltar?' ou 'Não posso esperar cair tudo?'. A resposta reside na biologia humana. Você perde, naturalmente, entre 3 a 5 cílios naturais por dia, em cada olho. Isso é imperceptível a olho nu, mas faça as contas: ao final de 3 semanas (21 dias), você perdeu cerca de 60 a 100 fios naturais. Como as extensões estão coladas neles, elas vão embora junto. É pura matemática biológica." },
                { type: 'h2', text: "O Perigo do Crescimento (Outgrown)" },
                { type: 'paragraph', text: "Além dos fios que caem, existe o fator dos que ficam e CRESCEM. Com o crescimento natural, a extensão se afasta da raiz. O peso do fio sintético, que antes estava equilibrado na base, se desloca para a ponta do fio natural. Isso cria uma 'alavanca' física." },
                { type: 'paragraph', text: "Essa alavanca gera um torque que pode começar a torcer o folículo e, eventualmente, quebrar o seu cílio natural pelo peso mal distribuído. Um cílio com a extensão longe da raiz é um cílio instável e perigoso." },
                {
                    type: 'list', items: [
                        "1ª Semana: Olhar perfeito, preenchido e alinhado.",
                        "2ª Semana: Leve perda de volume, algumas falhas imperceptíveis, início do crescimento.",
                        "3ª Semana: Fios crescidos começam a pesar e torcer. A linha do design perde a definição. Hora ideal da manutenção!",
                        "4ª Semana: Falhas visíveis, risco alto de dano por tração e acúmulo de resíduos na base crescida."
                    ]
                },
                { type: 'paragraph', text: "A manutenção de 21 dias não é apenas uma questão estética para manter o volume; é, acima de tudo, uma questão de saúde e higiene. Durante a manutenção, removemos mecanicamente os fios crescidos (que estão perigosos) e preenchemos as falhas com novas extensões, restabelecendo o equilíbrio de peso ideal e a simetria do olhar." }
            ]
        }
    },
    {
        title: "Higienização Premium: O Segredo da Retenção de 4 Semanas",
        slug: "higienizacao-premium-retencao",
        excerpt: "Água não é inimiga, é a melhor aliada. Como a limpeza correta previne a polimerização de choque e aumenta drasticamente a durabilidade.",
        coverImage: "/images/blog/higienizacao-premium-retencao.png",
        category: "Lashes",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Um dos mitos mais antigos e destrutivos da nossa indústria é a recomendação de 'não molhar' as extensões. Vamos esclarecer isso de uma vez por todas: a oleosidade natural da sua pele, a maquiagem e a poluição são ácidas e degradam o cianoacrilato (a cola) muito mais rápido do que a água. Em resumo: Cílio sujo cai rápido. Cílio limpo dura muito mais." },
                { type: 'h2', text: "Protocolo de Limpeza Vogue" },
                { type: 'paragraph', text: "Para manter seus cílios impecáveis e saudáveis, criamos um ritual de limpeza simples, mas essencial:" },
                {
                    type: 'list', items: [
                        "Use um shampoo de pH neutro (como shampoo de bebê) ou, preferencialmente, espumas de limpeza específicas para cílios.",
                        "Utilize um pincel de cerdas macias para limpar suavemente entre os fios, fazendo movimentos circulares na raiz e pálpebra.",
                        "Enxágue com água fria em abundância. Não tenha medo da água!",
                        "Seque pressionando suavemente com papel toalha (sem esfregar) e penteie com sua escovinha para alinhar."
                    ]
                },
                { type: 'blockquote', text: "A higiene previne a Blefarite, uma inflamação crônica e dolorosa das pálpebras causada pelo acúmulo de bactérias, pele morta e ácaros (Demodex) na base dos cílios." },
                { type: 'paragraph', text: "Adote a limpeza diária como parte inegociável do seu skincare noturno. Seus olhos ficarão mais brilhantes, sem irritações, e suas extensões vão durar semanas a mais. Sua lash designer agradecerá ao ver cílios limpinhos na manutenção!" }
            ]
        }
    },
    {
        title: "Visagismo Ocular: Personalizando o Mapping para Cada Rosto",
        slug: "visagismo-ocular-mapping",
        excerpt: "Não existe tamanho único na beleza. Como analisamos a distância, profundidade e ângulo dos seus olhos para criar a harmonia facial perfeita.",
        coverImage: "/images/blog/visagismo-ocular-mapping.png",
        category: "Studio",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Você já viu cílios que parecem 'fechar' o olhar de alguém, ou deixá-lo com aparência de cansado? Isso é um erro clássico de visagismo. No Kevelyn Studio, acreditamos que não existe uma receita de bolo. O mapping (o mapa de tamanhos, curvaturas e espessuras) deve ser calculado matematicamente para harmonizar com seus traços únicos." },
                { type: 'h2', text: "Correções Estratégicas e Ilusões de Ótica" },
                { type: 'paragraph', text: "Através das extensões, podemos alterar visualmente a percepção da estrutura óssea e do formato dos olhos:" },
                {
                    type: 'list', items: [
                        "Olhos Caídos: Jamais usamos o efeito 'Gatinho' tradicional, pois acentuaria a queda. Concentramos o ponto alto (maior comprimento) na direção da íris ou do ponto alto da sobrancelha, levantando o olhar (Efeito Boneca ou Esquilo).",
                        "Olhos Juntos: Precisamos criar espaço. Utilizamos comprimentos curtos no canto interno e alongamos os cantos externos para criar a ilusão de separação e 'abrir' o rosto.",
                        "Olhos Profundos: Cílios muito curvos podem encostar na pálpebra superior. Usamos curvaturas mais acentuadas e projetadas (D, DD ou L) para trazer os cílios 'para fora' da cavidade ocular, dando destaque.",
                        "Pálpebra Gordinha/Asiática: Curvaturas especiais L e M são essenciais para evitar que os cílios encostem na pele, garantindo conforto e evitando que a pálpebra 'engula' o trabalho."
                    ]
                },
                { type: 'paragraph', text: "Nós não apenas aplicamos cílios; nós esculpimos o olhar. Entendemos as linhas de força do seu rosto para realçar o que você tem de melhor e suavizar o que te incomoda. É uma consultoria de imagem através do olhar." }
            ]
        }
    },
    {
        title: "Alergias x Irritações: O que Você Precisa Saber sobre Adesivos",
        slug: "alergias-irritacoes-adesivos",
        excerpt: "A ciência do Cianoacrilato. Diferencie uma reação química comum de uma resposta imune e saiba como procedemos com segurança máxima.",
        coverImage: "/images/blog/alergias-irritacoes-adesivos.png",
        category: "Dicas",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A segurança biológica é o pilar central do nosso estúdio. Trabalhamos exclusivamente com cianoacrilatos de grau médico, com baixo teor de formaldeído e aprovados pela ANVISA. No entanto, é crucial para a cliente entender a química envolvida e a diferença entre reações." },
                { type: 'h2', text: "Irritação vs. Alergia: Sabendo Diferenciar" },
                { type: 'paragraph', text: "A Irritação química é local e temporária. Ela ocorre quando os emanações (vapores) da cola entram em contato com a esclera (a parte branca) do globo ocular. Isso geralmente acontece se o olho abre levemente durante o procedimento, ou se a cliente conversa muito (movimentando as pálpebras). Os sintomas são vermelhidão e ardor que se resolvem sozinhos em até 24h com colírios lubrificantes. Isso não impede novas aplicações." },
                { type: 'paragraph', text: "A Alergia, por outro lado, é uma resposta imune sistêmica e cumulativa. O corpo desenvolve anticorpos contra o acrilato ou o pigmento preto (carbon black). Ela se manifesta com inchaço (edema) nas pálpebras, coceira intensa, vermelhidão e descamação, geralmente 24h a 48h APÓS o procedimento. Se você desenvolver alergia verdadeira, infelizmente, o corpo 'expulsa' o material e não recomendamos mais o uso de extensões." },
                { type: 'blockquote', text: "Para minimizar riscos, utilizamos o Nano Mister no final de cada procedimento. Essa névoa ultrafina de água ajuda a polimerizar (secar) a cola instantaneamente, reduzindo a emissão de vapores residuais e o risco de irritações." },
                { type: 'paragraph', text: "Se sentir qualquer desconforto, nossa equipe está preparada para avaliar e conduzir a melhor solução. Sua saúde ocular vem sempre em primeiro lugar." }
            ]
        }
    },
    // --- BROW ARTISTRY (9-14) ---
    {
        title: "Brow Lamination: A Textura Selvagem que Dominou as Passarelas",
        slug: "brow-lamination-textura-selvagem",
        excerpt: "Do backstage dos desfiles para a vida real. Como o alisamento químico das sobrancelhas cria volume, preenche falhas e rejuvenesce.",
        coverImage: "/images/blog/brow-lamination-textura-selvagem.png",
        category: "Brows",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A estética 'clean girl' e 'fluffy brows' trouxe as sobrancelhas para o centro das atenções, mas não de qualquer jeito. A era das sobrancelhas marcadas e desenhadas a lápis ficou para trás. Hoje, queremos textura, volume real e um toque de rebeldia controlada. A Brow Lamination é a ferramenta técnica para alcançar esse visual de capa de revista." },
                { type: 'h2', text: "O Processo Químico de Transformação" },
                { type: 'paragraph', text: "A Brow Lamination funciona de forma similar a um permanente capilar ou alisamento, mas com produtos desenvolvidos especificamente para a área sensível do rosto. Usamos compostos seguros (como tioglicolato de amônia ou cisteamina) para quebrar temporariamente as pontes de enxofre do fio." },
                { type: 'paragraph', text: "Isso nos permite reposicionar o pelo na direção que desejarmos. Geralmente, escovamos verticalmente para cima e em direção à têmpora. Essa simples mudança de direção cobre falhas, alinha fios rebeldes que crescem para baixo e duplica visualmente a espessura da sobrancelha, criando um efeito 'selvagem' e cheio." },
                { type: 'blockquote', text: "Nutrição é obrigatória. Como é um processo químico, o procedimento finaliza sempre com um 'Botox' de fios, um blend rico em óleos, queratina e vitaminas para repor a massa perdida e garantir brilho." },
                { type: 'paragraph', text: "É o procedimento ideal para quem tem fios indisciplinados, encaracolados ou para quem deseja aquele visual 'full brows' sem recorrer à micropigmentação. O efeito dura entre 4 a 6 semanas, acompanhando o ciclo de crescimento dos pelos." }
            ]
        }
    },
    {
        title: "Nanoblading vs. Microblading: A Evolução do Realismo",
        slug: "nanoblading-vs-microblading",
        excerpt: "A agulha diminuiu, o realismo aumentou. Por que o Nanoblading é a escolha superior para fios ultra-realistas e sem traumas na pele.",
        coverImage: "/images/blog/nanoblading-vs-microblading.png",
        category: "Brows",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "O Microblading revolucionou o mercado de estética anos atrás, permitindo desenhar fios onde não existiam. Mas a tecnologia da beleza não parou no tempo. O Nanoblading (ou Nanofios) é a evolução refinada e artística que entrega resultados praticamente imperceptíveis a olho nu." },
                { type: 'h2', text: "A Diferença Está na Lâmina e na Pele" },
                { type: 'paragraph', text: "Enquanto o Microblading tradicional utiliza lâminas de 0.20mm a 0.25mm de espessura, o Nanoblading utiliza 'nanoagulhas' ultra-flexíveis de 0.15mm a 0.18mm. Pode parecer uma diferença pequena, mas na pele faz toda a diferença:" },
                {
                    type: 'list', items: [
                        "Menor trauma na epiderme: O corte é mais superficial e preciso, resultando em muito menos inflamação e quase nenhuma crosta.",
                        "Fios mais finos e curvos: A flexibilidade da lâmina nano permite desenhar fios sinuosos que imitam o movimento natural do pelo, não apenas riscos retos.",
                        "Cicatrização fiel: Devido ao menor trauma, há menos expansão do pigmento. O fio cicatrisado permanece fino e nítido, sem esfumar ou acinzentar."
                    ]
                },
                { type: 'paragraph', text: "O resultado é uma sobrancelha que flui organicamente. Não existe aquele aspecto 'tatuado', 'block' ou estático. É sobre preencher o que falta sem apagar a textura do que já existe. No Kevelyn Studio, somos especialistas em Nanoblading Flow, criando tramas de fios que se mesclam perfeitamente aos seus naturais." }
            ]
        }
    },
    {
        title: "A Matemática da Sobrancelha Perfeita: Proporção Áurea",
        slug: "matematica-sobrancelha-proporcao-aurea",
        excerpt: "Phi (1.618). Como usamos a constante divina e o paquímetro para encontrar o design ideal, oculto na sua própria estrutura óssea.",
        coverImage: "/images/blog/matematica-sobrancelha-proporcao-aurea.png",
        category: "Brows",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Muitas pessoas acreditam que a beleza é subjetiva. Mas a natureza nos mostra que a beleza é, em muitos níveis, matemática. Leonardo da Vinci usava a Proporção Áurea (Phi = 1.618) em suas obras-primas, e essa mesma proporção é encontrada nas conchas, nas flores e no rosto humano considerado harmônico. Nós trazemos essa ciência para o design de sobrancelhas." },
                { type: 'h2', text: "O Mapeamento Geométrico Facial" },
                { type: 'paragraph', text: "No Kevelyn Studio, não usamos moldes prontos. Usamos um compasso de proporção áurea e paquímetro para encontrar o design que a sua estrutura óssea pede. Definimos três pontos cruciais:" },
                {
                    type: 'list', items: [
                        "Ponto Inicial: Alinhado verticalmente com a aba ou o centro da narina e o canal lacrimal, garantindo a abertura correta do olhar.",
                        "Ponto Alto (Apex): O local onde a sobrancelha arquela. Ele é definido por uma linha que sai da aba do nariz e passa exatamente pelo centro da pupila ou pela lateral da íris. É o ponto de maior elevação e expressividade.",
                        "Ponto Final: Determinado por uma linha que vai da aba do nariz ao canto externo do olho. Respeitar esse limite é vital para não 'derreter' o olhar com uma sobrancelha muito longa."
                    ]
                },
                { type: 'paragraph', text: "Ao respeitar essas medidas milimétricas, devolvemos a simetria ao rosto de forma que o cérebro humano interpreta como agradável. É uma beleza que 'faz sentido'. O design perfeito não é o da moda, é o seu." }
            ]
        }
    },
    {
        title: "Recuperação de Sobrancelhas: Do Pinçamento Excessivo ao Volume",
        slug: "recuperacao-sobrancelhas-crescimento",
        excerpt: "Anos de pinça fina deixaram marcas. Conheça os protocolos de reconstrução, argiloterapia e estimulação que podem trazer seus fios de volta.",
        coverImage: "/images/blog/recuperacao-sobrancelhas-crescimento.png",
        category: "Brows",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Se você viveu os anos 90 e início dos 2000, provavelmente foi vítima da modas das sobrancelhas finas. Infelizmente, o trauma repetitivo da pinça naquela época pode ter causado o que chamamos de 'alopecia por tração'. O bulbo capilar, de tanto ser agredido, entrou em dormência ou morreu. Mas calma, nem tudo está perdido." },
                { type: 'h2', text: "O Protocolo de Resgate Kevelyn Studio" },
                { type: 'paragraph', text: "A reconstrução de sobrancelhas é um processo que exige paciência, mas aceleramos os resultados com ciência e tecnologia:" },
                {
                    type: 'list', items: [
                        "Argiloterapia: Utilizamos blends de argilas puras para desintoxicar a pele, remover células mortas que obstruem os poros e estimular a circulação sanguínea periférica.",
                        "Alta Frequência e Microagulhamento: O uso controlado de ozônio é bactericida e vasodilatador, aumentando o aporte de nutrientes para a base do folículo. Em casos mais avançados, o microagulhamento com fatores de crescimento acorda os bulbos adormecidos.",
                        "Blend de Crescimento: Desenvolvemos combinações de óleos essenciais (alecrim, rícino, jojoba) e minoxidil para uso home care."
                    ]
                },
                { type: 'blockquote', text: "A regra de ouro número 1: Esconda sua pinça. Deixe a limpeza apenas para o profissional a cada 30 dias. Tirar 'só um pelinho' em casa atrapalha o ciclo de crescimento e o design que estamos tentando recuperar." },
                { type: 'paragraph', text: "Com disciplina e o tratamento correto, é possível recuperar volume e densidade em cerca de 3 a 6 meses. Venha fazer uma avaliação tricológica das suas sobrancelhas." }
            ]
        }
    },
    {
        title: "Henna Ombré: Redefinindo o Conceito de Naturalidade",
        slug: "henna-ombre-naturalidade",
        excerpt: "Esqueça as sobrancelhas marcadas, escuras e artificiais. A técnica Ombré usa colorimetria para criar um degradê suave e sofisticado.",
        coverImage: "/images/blog/henna-ombre-naturalidade.png",
        category: "Brows",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "A Henna ainda sofre muito preconceito por causa de trabalhos antigos que deixavam o visual 'carimbado', muito escuro ou avermelhado. Mas a técnica evoluiu. A Henna Ombré veio para mudar essa percepção, trazendo a sofisticação da maquiagem profissional esfumada para o design semi-permanente." },
                { type: 'h2', text: "O Efeito Degradê e a Colorimetria" },
                { type: 'paragraph', text: "O segredo da naturalidade está na saturação e na escolha da cor. No estilo Ombré, nós trabalhamos em camadas. Começamos com a cauda da sobrancelha (o ponto final) bem definida e levemente mais saturada, e vamos 'esfumando' e clareando gradualmente em direção ao início (cabeça) da sobrancelha." },
                { type: 'paragraph', text: "O início da sobrancelha deve ser etéreo, quase transparente, sem linhas duras ou quadradas. Isso cria leveza e jovialidade. O rosto não fica 'pesado' ou com expressão brava." },
                { type: 'paragraph', text: "Além disso, dominamos a colorimetria. Não usamos apenas 'preto' ou 'marrom'. Criamos misturas personalizadas com tons frios e quentes para casar perfeitamente com a raiz do seu cabelo e seu subtom de pele (fototipo). O resultado é uma sombra natural que realça o desenho, cobre falhas e dura de 5 a 10 dias na pele." }
            ]
        }
    },
    {
        title: "Sobrancelhas Masculinas: O Design Invisível",
        slug: "sobrancelhas-masculinas-design-invisivel",
        excerpt: "Como limpar e alinhar o olhar masculino mantendo a virilidade e a naturalidade extrema. Menos é, definitivamente, mais.",
        coverImage: "/images/blog/sobrancelhas-masculinas-design-invisivel.png",
        category: "Brows",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "O homem moderno entende que cuidar da imagem é fundamental, tanto profissionalmente quanto pessoalmente. Mas o maior medo masculino continua sendo: 'vai parecer que eu fiz sobrancelha?'. A resposta no Kevelyn Studio é: não. O design masculino é uma arte de subtração estratégica e invisível." },
                { type: 'h2', text: "Retas, Naturais e Viris" },
                { type: 'paragraph', text: "Ao contrário do design feminino, que busca arcos definidos e efeito lifting, o design masculino preza pela linearidade e rusticidade controlada. Nosso foco é limpar a expressão, não desenhá-la." },
                { type: 'paragraph', text: "Removemos apenas a glabela (a 'monocelha' no centro) e os excessos muito fora do desenho natural, nas pálpebras e têmporas. Mantemos intencionalmente alguns fios dispersos próximos à linha principal para não criar um contorno muito 'polido' ou afeminado." },
                { type: 'blockquote', text: "O objetivo é que pareça que você nasceu com uma sobrancelha boa, e não que acabou de sair do salão. É o 'no-makeup look' das sobrancelhas." },
                { type: 'paragraph', text: "Muitas vezes, o problema não é a quantidade de pelos, mas o comprimento. Fios muito longos e rebeldes criam sombras que envelhecem e dão ar de cansaço ou braveza. Apenas aparar e pentear esses fios já transforma a fisionomia, abrindo o olhar mantendo a estrutura óssea masculina intacta." }
            ]
        }
    },
    {
        title: "A Experiência Kevelyn: Muito Além da Estética",
        slug: "experiencia-kevelyn-alem-estetica",
        excerpt: "Por que nos chamamos de 'Studio' e não 'Salão'. Um mergulho no nosso conceito de atendimento sensorial, conforto e exclusividade.",
        coverImage: "/images/blog/experiencia-kevelyn-alem-estetica.png",
        category: "Lifestyle",
        published: true,
        content: {
            blocks: [
                { type: 'paragraph', text: "Em um mundo cada vez mais acelerado e impessoal, acreditamos que o luxo real é o tempo, o cuidado e a atenção aos detalhes. O Kevelyn Studio foi concebido e desenhado não como uma fábrica de procedimentos estéticos, mas como um refúgio urbano de autocuidado e desconexão." },
                { type: 'h2', text: "O Menu Sensorial e o Conforto Absoluto" },
                { type: 'paragraph', text: "Sua experiência começa muito antes de se deitar na maca. Ao chegar, você é recebida em nosso lounge. Através do nosso 'Menu Sensorial', você personaliza seu momento: define a temperatura da sala (mais fresca ou aconchegante), escolhe a playlist que tocará durante seu procedimento (Jazz, Lo-fi, Pop Calmo ou Silêncio) e seleciona sua bebida de boas-vindas especial (de um espresso italiano a uma taça de espumante ou chá relaxante)." },
                { type: 'paragraph', text: "Sabemos que procedimentos de cílios podem levar de 2 a 3 horas. Por isso, investimos pesado em ergonomia. Nossas macas possuem colchões 'cloud' com densidade progressiva que se adapta à curvatura da sua coluna, apoio especial para pernas e mantas térmicas. O objetivo é que o procedimento seja o seu momento de descanso na semana, um verdadeiro 'beauty nap'." },
                { type: 'blockquote', text: "Nós cuidamos de você, enquanto cuidamos do seu olhar. É sobre sair daqui não apenas mais bonita, mas mais leve." },
                { type: 'paragraph', text: "Aqui, você não é apenas um horário preenchido na agenda. Você é a protagonista do nosso dia. Venha viver o seu momento Kevelyn Studio." }
            ]
        }
    }
];

async function main() {
    console.log("🌱 Starting Blog Seed with EXPANDED content...");

    for (const post of BLOG_POSTS) {
        console.log(`Creating/Updating post: ${post.title}`);
        await db.insert(blogPosts).values(post).onConflictDoUpdate({
            target: blogPosts.slug,
            set: post
        });
    }

    console.log("✅ Blog Seed Completed! All posts updated.");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
