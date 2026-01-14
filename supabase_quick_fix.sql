-- 1. Create the Methodology Steps table
CREATE TABLE IF NOT EXISTS "methodology_steps" (
    "id" SERIAL PRIMARY KEY,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- 2. Seed the initial content (The 4 Steps)
INSERT INTO "methodology_steps" ("title", "description", "order", "active") 
VALUES 
    ('Visagismo Analítico', 'Análise da estrutura óssea e simetria facial para um design exclusivo.', 1, true),
    ('Health First', 'Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.', 2, true),
    ('Mapping Personalizado', 'Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.', 3, true),
    ('Experiência Sensorial', 'Aromaterapia e conforto absoluto para um momento de desconexão total.', 4, true);

-- 3. Verify it worked
SELECT * FROM "methodology_steps";
