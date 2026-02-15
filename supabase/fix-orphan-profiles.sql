-- Remove perfis órfãos (sem usuário correspondente em auth.users)
DELETE FROM profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Verifica se há perfis restantes
SELECT COUNT(*) as profiles_count FROM profiles;
