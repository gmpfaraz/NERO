-- GULL Accounting System Database Schema
-- Migration: 001 - Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT projects_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Index for faster user queries
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    number VARCHAR(10) NOT NULL,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('akra', 'ring')),
    first_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    second_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT transactions_number_format CHECK (
        (entry_type = 'akra' AND LENGTH(number) = 2) OR
        (entry_type = 'ring' AND LENGTH(number) = 3)
    ),
    CONSTRAINT transactions_amounts_positive CHECK (
        first_amount >= 0 AND second_amount >= 0
    )
);

-- Indexes for faster queries
CREATE INDEX idx_transactions_project_id ON public.transactions(project_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_number ON public.transactions(number);
CREATE INDEX idx_transactions_entry_type ON public.transactions(entry_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);

-- ============================================
-- ACTION HISTORY TABLE
-- ============================================
CREATE TABLE public.action_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('add', 'edit', 'delete', 'batch')),
    description TEXT NOT NULL,
    affected_numbers TEXT[], -- Array of numbers affected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_action_history_project_id ON public.action_history(project_id);
CREATE INDEX idx_action_history_user_id ON public.action_history(user_id);
CREATE INDEX idx_action_history_created_at ON public.action_history(created_at DESC);

-- ============================================
-- FILTER PRESETS TABLE
-- ============================================
CREATE TABLE public.filter_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('akra', 'ring')),
    first_query TEXT,
    second_query TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT filter_presets_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Indexes
CREATE INDEX idx_filter_presets_user_id ON public.filter_presets(user_id);
CREATE INDEX idx_filter_presets_entry_type ON public.filter_presets(entry_type);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================
CREATE TABLE public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    language VARCHAR(10) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filter_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only access their own projects
CREATE POLICY "Users can view their own projects"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- Transactions: Users can only access their own transactions
CREATE POLICY "Users can view their own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Action History: Users can only access their own history
CREATE POLICY "Users can view their own action history"
    ON public.action_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own action history"
    ON public.action_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Filter Presets: Users can only access their own presets
CREATE POLICY "Users can view their own filter presets"
    ON public.filter_presets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own filter presets"
    ON public.filter_presets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own filter presets"
    ON public.filter_presets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own filter presets"
    ON public.filter_presets FOR DELETE
    USING (auth.uid() = user_id);

-- User Preferences: Users can only access their own preferences
CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANTS
-- ============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.projects IS 'User projects for accounting management';
COMMENT ON TABLE public.transactions IS 'Transaction entries for Akra (2-digit) and Ring (3-digit) numbers';
COMMENT ON TABLE public.action_history IS 'History of user actions for undo/redo functionality';
COMMENT ON TABLE public.filter_presets IS 'Saved filter presets for quick access';
COMMENT ON TABLE public.user_preferences IS 'User-specific preferences and settings';

