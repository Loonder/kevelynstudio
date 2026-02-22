-- 1. Insert Professionals (Kevelyn)
INSERT INTO "professionals" ("name", "slug", "role", "bio", "is_active") 
VALUES 
    ('Kevelyn Silva', 'kevelyn-silva', 'Master Artist', 'Especialista em Visagismo e Micropigmentação.', true),
    ('Equipe Studio', 'equipe', 'Lash Designers', 'Profissionais treinadas pela metodologia Kevelyn.', true);

-- 2. Insert Services (Lashes & Brows)
INSERT INTO "services" ("title", "description", "price", "duration_minutes", "category") 
VALUES 
    ('Brow Lamination', 'Alinhamento e nutrição dos fios naturais.', 18000, 60, 'Sobrancelhas'),
    ('Nanoblading', 'Fios ultra-realistas com tebori.', 45000, 120, 'Sobrancelhas'),
    ('Lash Lifting', 'Curvatura e tintura dos cílios naturais.', 15000, 60, 'Cílios'),
    ('Volume Brasileiro', 'Extensão com efeito rímel marcante.', 22000, 90, 'Cílios');

-- 3. Insert a Test Client
INSERT INTO "clients" ("full_name", "email", "phone") 
VALUES 
    ('Cliente Vip', 'vip@example.com', '11999999999');

-- 4. Create a Test Appointment (today)
INSERT INTO "appointments" (
    "client_id", 
    "professional_id", 
    "service_id", 
    "start_time", 
    "end_time", 
    "status"
) 
SELECT 
    c.id, 
    p.id, 
    s.id, 
    now() + interval '2 hours', 
    now() + interval '3 hours', 
    'confirmed'
FROM "clients" c, "professionals" p, "services" s
WHERE c.email = 'vip@example.com' 
AND p.slug = 'kevelyn-silva' 
AND s.title = 'Nanoblading'
LIMIT 1;
