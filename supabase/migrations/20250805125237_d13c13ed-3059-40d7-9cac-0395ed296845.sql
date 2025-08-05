-- Add foreign key relationship between conversations and documents
ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_document_id 
FOREIGN KEY (document_id) 
REFERENCES documents(id) 
ON DELETE CASCADE;