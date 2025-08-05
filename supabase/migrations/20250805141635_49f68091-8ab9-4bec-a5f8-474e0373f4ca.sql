-- First, let's see what foreign key constraints exist
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND (tc.table_name = 'conversations' OR tc.table_name = 'documents')
    AND tc.table_schema = 'public';

-- Drop any existing foreign key constraints between conversations and documents
DROP CONSTRAINT IF EXISTS conversations_document_id_fkey ON conversations;
DROP CONSTRAINT IF EXISTS fk_conversations_document_id ON conversations;

-- Now create a clean foreign key relationship
ALTER TABLE conversations 
ADD CONSTRAINT conversations_document_id_fkey 
FOREIGN KEY (document_id) 
REFERENCES documents(id) 
ON DELETE CASCADE;