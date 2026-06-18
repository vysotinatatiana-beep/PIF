-- ════════════════════════════════════════════════════════════
-- HR ASSESSMENT — SUPABASE SCHEMA
-- Выполнить целиком в Supabase → SQL Editor → New Query → Run
-- ════════════════════════════════════════════════════════════

-- Таблица сгенерированных HR-ссылок (до того как кандидат ответил)
create table if not exists pending_links (
  token text primary key,
  candidate_name text not null,
  grade text not null check (grade in ('mid','senior')),
  created_at timestamptz default now()
);

-- Таблица ответов кандидатов
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  token text not null references pending_links(token),
  name text not null,
  email text not null,
  grade text not null check (grade in ('mid','senior')),
  answers jsonb not null,
  submitted_at timestamptz default now(),
  unique(token)
);

-- Включаем Row Level Security — обязательно для публичного anon-ключа
alter table pending_links enable row level security;
alter table submissions enable row level security;

-- ── Политики для pending_links ──
-- Кто угодно с anon-ключом может ВСТАВЛЯТЬ (это делает HR-панель при генерации ссылки)
drop policy if exists "anon can insert pending" on pending_links;
create policy "anon can insert pending" on pending_links
  for insert to anon with check (true);

-- Кто угодно может ЧИТАТЬ pending_links (нужно и кандидату — проверить токен,
-- и HR — увидеть список). Имя/грейд не являются секретом сами по себе.
drop policy if exists "anon can read pending" on pending_links;
create policy "anon can read pending" on pending_links
  for select to anon using (true);

-- ── Политики для submissions ──
-- Кто угодно с anon-ключом может ВСТАВИТЬ свои ответы (кандидат отправляет форму)
drop policy if exists "anon can insert submissions" on submissions;
create policy "anon can insert submissions" on submissions
  for insert to anon with check (true);

-- Кто угодно может ЧИТАТЬ submissions (HR-панели нужно видеть все ответы).
-- ВАЖНО: anon-ключ публичный, то есть теоретически URL с этим ключом
-- даёт доступ на чтение всех результатов. Это приемлемо для внутреннего
-- небольшого инструмента, но НЕ публикуйте hr_panel.html в открытом доступе
-- без дополнительной защиты (см. примечание в конце файла).
drop policy if exists "anon can read submissions" on submissions;
create policy "anon can read submissions" on submissions
  for select to anon using (true);

-- Кто угодно может УДАЛЯТЬ submissions (нужно для кнопки "Очистить базу" в HR-панели)
drop policy if exists "anon can delete submissions" on submissions;
create policy "anon can delete submissions" on submissions
  for delete to anon using (true);

-- Кто угодно может УДАЛЯТЬ pending_links (нужно для той же кнопки очистки)
drop policy if exists "anon can delete pending" on pending_links;
create policy "anon can delete pending" on pending_links
  for delete to anon using (true);

-- Индекс для быстрого поиска по грейду (для нормировочной базы)
create index if not exists idx_submissions_grade on submissions(grade);
create index if not exists idx_submissions_submitted_at on submissions(submitted_at);

-- ════════════════════════════════════════════════════════════
-- ПРИМЕЧАНИЕ ПО БЕЗОПАСНОСТИ
-- ════════════════════════════════════════════════════════════
-- Текущая схема защищает данные от случайного PUBLIC доступа через
-- Supabase API browser (без ключа доступ невозможен), но anon-ключ
-- встроен в hr_panel.html — то есть кто угодно, кто получит ссылку
-- на hr_panel.html, теоретически может прочитать все результаты,
-- если знает структуру API.
--
-- Для внутреннего использования (ссылка на панель не публикуется
-- широко) это приемлемый уровень риска для старта. Если нужна
-- настоящая защита HR-панели паролем — следующий шаг: Supabase Auth
-- (добавление логина/пароля для HR), это отдельная небольшая задача.
