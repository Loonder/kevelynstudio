-- =========================================================
-- KEVELYN STUDIO - WARNING FIXES
-- =========================================================
-- Fixes "Function Search Path Mutable" warning.
-- The "RLS Policy Always True" warnings are ACCEPTABLE for now
-- because we explicitly allowed Public Access for the Bot.
-- =========================================================

-- Fix 1: Secure the Function (Search Path)
ALTER FUNCTION public.append_tag(text, text) SET search_path = public;

-- Fix 2: (Optional) If you want to clear the "Leaked Password" warning:
-- You must do this in the UI: Authentication -> Security -> Enable "Leaked Password Protection"
