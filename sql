-- INSTRUÇÕES DE USO:
-- 1. Acesse o SQL Editor do Supabase Dashboard.
-- 2. Cole este script e execute.

-- 1. Garante que o usuário existe na tabela auth.users
-- NOTA: O Supabase não permite criar senhas via SQL facilmente por segurança (hashing).
-- O JEITO CERTO é a Kevelyn criar a conta pelo SITE (Sign Up) com:
-- Email: admin@kevelynstudio.com
-- Senha: (a que ela escolher)

-- DEPOIS que ela criar a conta, rode isso para transformar em ADMIN:

UPDATE clients
SET role = 'admin'
WHERE email = 'admin@kevelynstudio.com';

-- SE você quiser criar um usuário "fake" só para testar agora (não recomendado para produção real sem trocar senha depois),
-- você teria que inserir na tabela auth.users, o que é complexo por causa do hash da senha.
-- RECOMENDAÇÃO: Cadastre 'admin@kevelynstudio.com' pela tela de Registro do site agora,
-- e depois rode o UPDATE acima.
