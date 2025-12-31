-- Migration to remove 440 Hz tuning and update all presets to 432 Hz
-- 440 Hz is removed in favor of natural manifestation frequencies (432 Hz and 528 Hz)

-- Update all presets currently using 440 Hz to use 432 Hz instead
UPDATE public.presets
SET tuning_ref = 432
WHERE tuning_ref = 440;

-- Update the default value for tuning_ref column to 432 Hz
ALTER TABLE public.presets
ALTER COLUMN tuning_ref SET DEFAULT 432;
