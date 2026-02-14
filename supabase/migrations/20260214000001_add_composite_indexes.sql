-- Add composite indexes for improved query performance
-- Created: 2026-02-14

-- Composite index for conversations by user, mode, and updated_at
-- Optimizes queries that filter by user and mode, and sort by time
CREATE INDEX IF NOT EXISTS conversations_user_mode_updated_idx
  ON public.conversations(user_id, mode, updated_at DESC);

-- Composite index for documents by user and analysis status
-- Optimizes queries that filter documents by user and status
CREATE INDEX IF NOT EXISTS documents_user_status_idx
  ON public.documents(user_id, analysis_status);

-- Composite index for custom advisors by user and creation time
-- Optimizes queries that list advisors by user sorted by creation date
CREATE INDEX IF NOT EXISTS custom_advisors_user_created_idx
  ON public.custom_advisors(user_id, created_at DESC);

-- Add full-text search capability to documents
-- Allows searching document content efficiently
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS content_search tsvector;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS documents_content_search_idx
  ON public.documents USING gin(content_search);

-- Trigger function to auto-update search vector when content changes
CREATE OR REPLACE FUNCTION update_document_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_search = to_tsvector('english', coalesce(NEW.content_text, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on insert or update
DROP TRIGGER IF EXISTS documents_content_search_update ON public.documents;
CREATE TRIGGER documents_content_search_update
  BEFORE INSERT OR UPDATE OF content_text ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_search();

-- Update existing rows to populate search vector
UPDATE public.documents
SET content_search = to_tsvector('english', coalesce(content_text, ''))
WHERE content_search IS NULL;
