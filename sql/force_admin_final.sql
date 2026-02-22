-- =============================================
-- KEVELYN COMPANY - FORCE ADMIN CLEAN SWEEP
-- =============================================
-- TROQUE 'admin@admin.com' PELO SEU EMAIL ABAIXO SE NECESSÁRIO

DO $$ 
DECLARE
    user_id uuid;
    target_email text := 'admin@admin.com'; -- <--- COLOQUE SEU EMAIL AQUI
BEGIN
    -- 1. Buscar o ID do usuário no Auth
    SELECT id INTO user_id FROM auth.users WHERE LOWER(email) = LOWER(target_email);

    IF user_id IS NULL THEN
        RAISE NOTICE 'ERRO: Usuário não encontrado no Auth. Registre-se primeiro em /register';
        RETURN;
    END IF;

    -- 2. Garantir que a coluna 'role' existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='role') THEN
        ALTER TABLE public.clients ADD COLUMN role text DEFAULT 'client';
    END IF;

    -- 3. Limpar registro antigo no clients (se houver erro de vínculo)
    DELETE FROM public.clients WHERE LOWER(email) = LOWER(target_email);

    -- 4. Inserir registro limpo e PERFEITO como Admin
    INSERT INTO public.clients (id, email, full_name, phone, role)
    VALUES (
        user_id, 
        target_email, 
        'Administrador Kevelyn', 
        '11999999999', 
        'admin'
    );

    -- 5. Forçar confirmação total no Auth
    UPDATE auth.users 
    SET email_confirmed_at = NOW(),
        last_sign_in_at = NOW(),
        raw_app_meta_data = raw_app_meta_data || '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = raw_user_meta_data || '{"full_name":"Administrador Kevelyn"}'
    WHERE id = user_id;

    RAISE NOTICE 'SUCESSO: Usuario % agora é ADMIN e está confirmado!', target_email;
END $$;
