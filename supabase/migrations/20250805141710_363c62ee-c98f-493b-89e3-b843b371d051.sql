-- Drop any existing foreign key constraints between conversations and documents
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_document_id_fkey;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS fk_conversations_document_id;

-- Now create a clean foreign key relationship
ALTER TABLE conversations 
ADD CONSTRAINT conversations_document_id_fkey 
FOREIGN KEY (document_id) 
REFERENCES documents(id) 
ON DELETE CASCADE;