--
-- PostgreSQL database dump
--

-- Dumped from database version 17.8 (6108b59)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: create_index_if_not_exists(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_index_if_not_exists(index_name text, index_sql text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = index_name) THEN
        EXECUTE index_sql;
    END IF;
END;
$$;


--
-- Name: create_index_safe(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_index_safe(index_name text, index_sql text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = index_name) THEN
        EXECUTE index_sql;
        RAISE NOTICE '✅ Created index: %', index_name;
    ELSE
        RAISE NOTICE '⚠️ Index % already exists - skipping', index_name;
    END IF;
END;
$$;


--
-- Name: update_social_counts(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_social_counts() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update course like/favorite count
    IF TG_TABLE_NAME = 'course_likes' THEN
        UPDATE courses c
        SET 
            like_count = COALESCE((
                SELECT COUNT(*) 
                FROM course_likes cl 
                WHERE cl.course_id = c.id
            ), 0),
            favorite_count = COALESCE((
                SELECT COUNT(*) 
                FROM course_likes cl 
                WHERE cl.course_id = c.id
            ), 0)
        WHERE c.id = COALESCE(NEW.course_id, OLD.course_id);
    END IF;

    -- Update course share count (only if columns exist)
    IF TG_TABLE_NAME = 'course_shares' THEN
        UPDATE courses c
        SET 
            share_count = COALESCE((
                SELECT COUNT(*) 
                FROM course_shares cs 
                WHERE cs.course_id = c.id
            ), 0)
        WHERE c.id = COALESCE(NEW.course_id, OLD.course_id);
    END IF;

    -- Update review counts (only if columns exist)
    IF TG_TABLE_NAME = 'review_reactions' THEN
        UPDATE course_reviews cr
        SET 
            like_count = COALESCE((
                SELECT COUNT(*) 
                FROM review_reactions rr 
                WHERE rr.review_id = cr.id AND rr.reaction_type = 'like'
            ), 0),
            dislike_count = COALESCE((
                SELECT COUNT(*) 
                FROM review_reactions rr 
                WHERE rr.review_id = cr.id AND rr.reaction_type = 'dislike'
            ), 0),
            helpful_count = COALESCE((
                SELECT COUNT(*) 
                FROM review_reactions rr 
                WHERE rr.review_id = cr.id AND rr.reaction_type = 'helpful'
            ), 0)
        WHERE cr.id = COALESCE(NEW.review_id, OLD.review_id);
    END IF;

    -- Update review reply count
    IF TG_TABLE_NAME = 'review_replies' THEN
        UPDATE course_reviews cr
        SET 
            reply_count = COALESCE((
                SELECT COUNT(*) 
                FROM review_replies rp 
                WHERE rp.review_id = cr.id AND rp.status = 'active'
            ), 0)
        WHERE cr.id = COALESCE(NEW.review_id, OLD.review_id);
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    provider character varying(50) NOT NULL,
    provider_account_id character varying(255) NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type character varying(50),
    scope text,
    id_token text,
    session_state text,
    provider_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    icon_url text,
    badge_type character varying(50),
    difficulty character varying(20) DEFAULT 'bronze'::character varying,
    category character varying(50),
    criteria jsonb,
    xp_reward integer DEFAULT 0,
    is_secret boolean DEFAULT false,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_token character varying(255) NOT NULL,
    access_token text,
    expires timestamp with time zone NOT NULL,
    user_agent text,
    ip_address inet,
    device_info jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    name character varying(255) NOT NULL,
    bio text,
    image text,
    email_verified timestamp with time zone,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    locale character varying(10) DEFAULT 'en-US'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: active_sessions; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.active_sessions AS
 SELECT s.id,
    s.user_id,
    s.session_token,
    s.access_token,
    s.expires,
    s.user_agent,
    s.ip_address,
    s.device_info,
    s.is_active,
    s.created_at,
    s.updated_at,
    u.username,
    u.email,
    u.name
   FROM (public.sessions s
     JOIN public.users u ON ((s.user_id = u.id)))
  WHERE ((s.is_active = true) AND (s.expires > now()));


--
-- Name: assessment_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    assessment_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_id uuid NOT NULL,
    attempt_number integer DEFAULT 1 NOT NULL,
    started_at timestamp with time zone DEFAULT now(),
    submitted_at timestamp with time zone,
    time_spent integer DEFAULT 0,
    time_remaining integer,
    score numeric(6,2) DEFAULT 0,
    max_score numeric(6,2) DEFAULT 0,
    percentage numeric(5,2) DEFAULT 0,
    passed boolean DEFAULT false,
    grade_letter character varying(5),
    grading_status character varying(20) DEFAULT 'pending'::character varying,
    graded_by uuid,
    graded_at timestamp with time zone,
    grading_feedback text,
    answers_json jsonb,
    question_breakdown jsonb,
    cheating_indicators jsonb
);


--
-- Name: assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid,
    course_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    instructions text,
    type character varying(20),
    difficulty character varying(20) DEFAULT 'medium'::character varying,
    passing_score integer DEFAULT 70,
    max_attempts integer DEFAULT 1,
    time_limit integer,
    shuffle_questions boolean DEFAULT false,
    show_correct_answers boolean DEFAULT true,
    show_results_immediately boolean DEFAULT true,
    require_passing boolean DEFAULT false,
    is_proctored boolean DEFAULT false,
    allow_pause boolean DEFAULT false,
    require_webcam boolean DEFAULT false,
    grading_method character varying(20) DEFAULT 'automatic'::character varying,
    points_per_question integer DEFAULT 1,
    total_points integer DEFAULT 0,
    grading_rubric jsonb,
    available_from timestamp with time zone,
    available_until timestamp with time zone,
    duration_minutes integer,
    average_score numeric(5,2) DEFAULT 0,
    completion_count integer DEFAULT 0,
    difficulty_rating numeric(3,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT assessments_type_check CHECK (((type)::text = ANY ((ARRAY['quiz'::character varying, 'test'::character varying, 'exam'::character varying, 'assignment'::character varying, 'project'::character varying, 'practice'::character varying])::text[])))
);


--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_id uuid NOT NULL,
    title character varying(200),
    notes text,
    video_timestamp integer,
    category character varying(50) DEFAULT 'general'::character varying,
    color character varying(7) DEFAULT '#3B82F6'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(120) NOT NULL,
    description text,
    parent_id uuid,
    image_url text,
    icon character varying(50),
    color character varying(7) DEFAULT '#3B82F6'::character varying,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    course_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_id uuid NOT NULL,
    certificate_code character varying(64) NOT NULL,
    issued_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    final_grade character varying(20),
    completion_percentage numeric(5,2),
    overall_score numeric(5,2),
    certificate_data jsonb,
    download_url text,
    shareable_url text,
    preview_url text,
    verification_hash text,
    qr_code_url text,
    is_revoked boolean DEFAULT false,
    revoked_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: course_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    date date NOT NULL,
    new_enrollments integer DEFAULT 0,
    total_enrollments integer DEFAULT 0,
    completion_count integer DEFAULT 0,
    dropout_count integer DEFAULT 0,
    daily_views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    average_time_spent integer DEFAULT 0,
    engagement_rate numeric(5,2) DEFAULT 0,
    bounce_rate numeric(5,2) DEFAULT 0,
    revenue_cents integer DEFAULT 0,
    conversion_rate numeric(5,2) DEFAULT 0,
    refund_rate numeric(5,2) DEFAULT 0,
    average_rating numeric(3,2) DEFAULT 0,
    review_count integer DEFAULT 0,
    completion_rate numeric(5,2) DEFAULT 0
);


--
-- Name: course_details; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.course_details AS
SELECT
    NULL::uuid AS id,
    NULL::character varying(200) AS slug,
    NULL::uuid AS instructor_id,
    NULL::uuid AS category_id,
    NULL::character varying(200) AS title,
    NULL::character varying(300) AS subtitle,
    NULL::text AS description_html,
    NULL::text AS short_description,
    NULL::text[] AS learning_objectives,
    NULL::text[] AS prerequisites,
    NULL::text[] AS target_audience,
    NULL::text AS welcome_message,
    NULL::text AS congratulations_message,
    NULL::character varying(30) AS difficulty_level,
    NULL::character varying(50) AS language,
    NULL::text[] AS subtitle_languages,
    NULL::character varying(20) AS level,
    NULL::character varying(20) AS content_type,
    NULL::text AS thumbnail_url,
    NULL::text AS promo_video_url,
    NULL::text AS video_preview_url,
    NULL::text[] AS image_gallery,
    NULL::integer AS trailer_duration,
    NULL::integer AS price_cents,
    NULL::character varying(3) AS currency,
    NULL::integer AS discount_percent,
    NULL::timestamp with time zone AS discount_expires_at,
    NULL::integer AS original_price_cents,
    NULL::boolean AS has_free_trial,
    NULL::integer AS trial_duration_days,
    NULL::boolean AS is_published,
    NULL::boolean AS is_featured,
    NULL::boolean AS is_trending,
    NULL::boolean AS is_bestseller,
    NULL::boolean AS is_new,
    NULL::boolean AS certificate_available,
    NULL::boolean AS has_lifetime_access,
    NULL::boolean AS allow_downloads,
    NULL::boolean AS has_captions,
    NULL::boolean AS has_transcripts,
    NULL::timestamp with time zone AS start_date,
    NULL::timestamp with time zone AS end_date,
    NULL::integer AS enrollment_capacity,
    NULL::boolean AS requires_approval,
    NULL::text AS approval_message,
    NULL::character varying(20) AS access_type,
    NULL::integer AS total_video_duration,
    NULL::integer AS total_lessons,
    NULL::integer AS total_quizzes,
    NULL::integer AS total_assignments,
    NULL::integer AS total_downloads,
    NULL::integer AS total_articles,
    NULL::integer AS enrolled_students_count,
    NULL::integer AS active_students_count,
    NULL::integer AS completed_students_count,
    NULL::numeric(3,2) AS average_rating,
    NULL::integer AS review_count,
    NULL::integer AS total_views,
    NULL::numeric(5,2) AS completion_rate,
    NULL::numeric(5,2) AS engagement_score,
    NULL::character varying(200) AS meta_title,
    NULL::text AS meta_description,
    NULL::text[] AS search_keywords,
    NULL::timestamp with time zone AS published_at,
    NULL::timestamp with time zone AS featured_at,
    NULL::timestamp with time zone AS trending_at,
    NULL::timestamp with time zone AS created_at,
    NULL::timestamp with time zone AS updated_at,
    NULL::character varying(255) AS instructor_name,
    NULL::character varying(50) AS instructor_username,
    NULL::text AS instructor_image,
    NULL::text AS instructor_bio,
    NULL::character varying(100) AS category_name,
    NULL::character varying(120) AS category_slug,
    NULL::bigint AS total_enrollments_count,
    NULL::bigint AS total_reviews_count,
    NULL::numeric AS calculated_rating,
    NULL::bigint AS module_count,
    NULL::bigint AS lesson_count,
    NULL::character varying[] AS tag_names,
    NULL::bigint AS total_video_duration_actual;


--
-- Name: course_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: course_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_id uuid NOT NULL,
    rating integer NOT NULL,
    content_rating integer,
    instructor_rating integer,
    support_rating integer,
    title character varying(200),
    comment text,
    pros text[],
    cons text[],
    recommendations text,
    is_verified boolean DEFAULT false,
    is_anonymous boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    not_helpful_count integer DEFAULT 0,
    report_count integer DEFAULT 0,
    is_public boolean DEFAULT true,
    status character varying(20) DEFAULT 'pending'::character varying,
    moderated_by uuid,
    moderated_at timestamp with time zone,
    moderation_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    like_count integer DEFAULT 0,
    dislike_count integer DEFAULT 0,
    reply_count integer DEFAULT 0,
    content text,
    is_edited boolean DEFAULT false,
    CONSTRAINT course_reviews_content_rating_check CHECK (((content_rating >= 1) AND (content_rating <= 5))),
    CONSTRAINT course_reviews_instructor_rating_check CHECK (((instructor_rating >= 1) AND (instructor_rating <= 5))),
    CONSTRAINT course_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT course_reviews_support_rating_check CHECK (((support_rating >= 1) AND (support_rating <= 5)))
);


--
-- Name: course_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_shares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    user_id uuid NOT NULL,
    share_type character varying(20) DEFAULT 'link'::character varying,
    share_url text,
    shared_to character varying(255),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug character varying(200) NOT NULL,
    instructor_id uuid NOT NULL,
    category_id uuid,
    title character varying(200) NOT NULL,
    subtitle character varying(300),
    description_html text,
    short_description text,
    learning_objectives text[],
    prerequisites text[],
    target_audience text[],
    welcome_message text,
    congratulations_message text,
    difficulty_level character varying(30),
    language character varying(50) DEFAULT 'English'::character varying,
    subtitle_languages text[],
    level character varying(20) DEFAULT 'beginner'::character varying,
    content_type character varying(20) DEFAULT 'video'::character varying,
    thumbnail_url text,
    promo_video_url text,
    video_preview_url text,
    image_gallery text[],
    trailer_duration integer DEFAULT 0,
    price_cents integer DEFAULT 0,
    currency character varying(3) DEFAULT 'USD'::character varying,
    discount_percent integer DEFAULT 0,
    discount_expires_at timestamp with time zone,
    original_price_cents integer DEFAULT 0,
    has_free_trial boolean DEFAULT false,
    trial_duration_days integer DEFAULT 0,
    is_published boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    is_trending boolean DEFAULT false,
    is_bestseller boolean DEFAULT false,
    is_new boolean DEFAULT true,
    certificate_available boolean DEFAULT false,
    has_lifetime_access boolean DEFAULT true,
    allow_downloads boolean DEFAULT false,
    has_captions boolean DEFAULT false,
    has_transcripts boolean DEFAULT false,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    enrollment_capacity integer,
    requires_approval boolean DEFAULT false,
    approval_message text,
    access_type character varying(20) DEFAULT 'open'::character varying,
    total_video_duration integer DEFAULT 0,
    total_lessons integer DEFAULT 0,
    total_quizzes integer DEFAULT 0,
    total_assignments integer DEFAULT 0,
    total_downloads integer DEFAULT 0,
    total_articles integer DEFAULT 0,
    enrolled_students_count integer DEFAULT 0,
    active_students_count integer DEFAULT 0,
    completed_students_count integer DEFAULT 0,
    average_rating numeric(3,2) DEFAULT 0,
    review_count integer DEFAULT 0,
    total_views integer DEFAULT 0,
    completion_rate numeric(5,2) DEFAULT 0,
    engagement_score numeric(5,2) DEFAULT 0,
    meta_title character varying(200),
    meta_description text,
    search_keywords text[],
    published_at timestamp with time zone,
    featured_at timestamp with time zone,
    trending_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    materials_url text,
    like_count integer DEFAULT 0,
    share_count integer DEFAULT 0,
    favorite_count integer DEFAULT 0,
    CONSTRAINT courses_difficulty_level_check CHECK (((difficulty_level)::text = ANY ((ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying, 'all-levels'::character varying])::text[])))
);


--
-- Name: course_social_analytics; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.course_social_analytics AS
 SELECT id,
    title,
    slug,
    COALESCE(like_count, 0) AS like_count,
    COALESCE(share_count, 0) AS share_count,
    COALESCE(favorite_count, 0) AS favorite_count,
    enrolled_students_count,
    review_count,
    average_rating,
    round((((((COALESCE(like_count, 0) + (COALESCE(share_count, 0) * 2)) + (COALESCE(review_count, 0) * 3)))::numeric * 1.0) / (NULLIF(enrolled_students_count, 0))::numeric), 2) AS engagement_score
   FROM public.courses c
  WHERE (is_published = true);


--
-- Name: course_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_tags (
    course_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: direct_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.direct_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    course_id uuid,
    message text NOT NULL,
    message_type character varying(20) DEFAULT 'text'::character varying,
    attachment_url text,
    attachment_type character varying(50),
    attachment_size integer,
    is_delivered boolean DEFAULT false,
    is_read boolean DEFAULT false,
    delivered_at timestamp with time zone,
    read_at timestamp with time zone,
    is_edited boolean DEFAULT false,
    edited_at timestamp with time zone,
    reply_to_id uuid,
    reactions jsonb,
    is_reported boolean DEFAULT false,
    reported_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: discussion_replies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discussion_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    discussion_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_reply_id uuid,
    content text NOT NULL,
    is_answer boolean DEFAULT false,
    is_moderator_note boolean DEFAULT false,
    is_edited boolean DEFAULT false,
    edited_at timestamp with time zone,
    upvote_count integer DEFAULT 0,
    downvote_count integer DEFAULT 0,
    report_count integer DEFAULT 0,
    reply_count integer DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: discussions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discussions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    slug character varying(200) NOT NULL,
    discussion_type character varying(50) DEFAULT 'general'::character varying,
    is_pinned boolean DEFAULT false,
    is_locked boolean DEFAULT false,
    is_announcement boolean DEFAULT false,
    is_resolved boolean DEFAULT false,
    tags text[],
    view_count integer DEFAULT 0,
    reply_count integer DEFAULT 0,
    upvote_count integer DEFAULT 0,
    downvote_count integer DEFAULT 0,
    save_count integer DEFAULT 0,
    last_reply_at timestamp with time zone,
    hotness_score numeric(10,6) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now(),
    enrolled_price_cents integer,
    access_type character varying(20) DEFAULT 'full'::character varying,
    enrollment_source character varying(50),
    referral_code character varying(100),
    completed_at timestamp with time zone,
    last_accessed_at timestamp with time zone DEFAULT now(),
    current_lesson_id uuid,
    current_module_id uuid,
    progress_percentage numeric(5,2) DEFAULT 0,
    completed_lessons integer DEFAULT 0,
    total_lessons integer DEFAULT 0,
    total_time_spent integer DEFAULT 0,
    last_activity_at timestamp with time zone,
    average_quiz_score numeric(5,2) DEFAULT 0,
    assignment_average numeric(5,2) DEFAULT 0,
    overall_grade numeric(5,2) DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    notification_preferences jsonb DEFAULT '{"email": true, "in_app": true}'::jsonb,
    learning_goals text[]
);


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feature_flags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_enabled boolean DEFAULT false,
    rollout_percentage integer DEFAULT 0,
    target_users uuid[],
    target_roles uuid[],
    target_courses uuid[],
    conditions jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT feature_flags_rollout_percentage_check CHECK (((rollout_percentage >= 0) AND (rollout_percentage <= 100)))
);


--
-- Name: instructor_dashboard; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.instructor_dashboard AS
SELECT
    NULL::uuid AS instructor_id,
    NULL::character varying(255) AS instructor_name,
    NULL::character varying(50) AS username,
    NULL::text AS instructor_image,
    NULL::bigint AS total_courses,
    NULL::bigint AS published_courses,
    NULL::bigint AS total_enrollments,
    NULL::bigint AS total_students,
    NULL::numeric AS average_rating,
    NULL::bigint AS total_reviews,
    NULL::bigint AS total_revenue_cents,
    NULL::numeric AS average_completion_rate,
    NULL::bigint AS total_live_sessions,
    NULL::timestamp with time zone AS last_course_created;


--
-- Name: lesson_transcripts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_transcripts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    language character varying(10) DEFAULT 'en'::character varying NOT NULL,
    content text NOT NULL,
    word_count integer DEFAULT 0,
    is_auto_generated boolean DEFAULT false,
    confidence_score numeric(4,3) DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid NOT NULL,
    course_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    slug character varying(200) NOT NULL,
    description text,
    lesson_type character varying(30),
    content_type character varying(20),
    difficulty character varying(20) DEFAULT 'beginner'::character varying,
    video_url text,
    video_duration integer DEFAULT 0,
    video_thumbnail text,
    video_quality jsonb,
    document_url text,
    document_type character varying(50),
    document_size integer,
    audio_url text,
    audio_duration integer DEFAULT 0,
    content_html text,
    interactive_content jsonb,
    code_environment jsonb,
    has_transcript boolean DEFAULT false,
    has_captions boolean DEFAULT false,
    has_interactive_exercises boolean DEFAULT false,
    has_downloadable_resources boolean DEFAULT false,
    requires_passing_grade boolean DEFAULT false,
    downloadable_resources text[],
    attached_files text[],
    external_links jsonb,
    recommended_readings text[],
    order_index integer DEFAULT 0 NOT NULL,
    is_published boolean DEFAULT true,
    is_preview boolean DEFAULT false,
    requires_completion boolean DEFAULT true,
    allow_comments boolean DEFAULT true,
    estimated_prep_time integer DEFAULT 0,
    completion_criteria jsonb,
    passing_score integer DEFAULT 0,
    view_count integer DEFAULT 0,
    average_completion_time integer DEFAULT 0,
    completion_rate numeric(5,2) DEFAULT 0,
    engagement_score numeric(5,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT lessons_content_type_check CHECK (((content_type)::text = ANY ((ARRAY['free'::character varying, 'premium'::character varying, 'trial'::character varying])::text[]))),
    CONSTRAINT lessons_lesson_type_check CHECK (((lesson_type)::text = ANY ((ARRAY['video'::character varying, 'text'::character varying, 'document'::character varying, 'quiz'::character varying, 'assignment'::character varying, 'live_session'::character varying, 'audio'::character varying, 'interactive'::character varying, 'code'::character varying, 'discussion'::character varying])::text[])))
);


--
-- Name: live_session_attendees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.live_session_attendees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    user_id uuid NOT NULL,
    enrollment_id uuid NOT NULL,
    registered_at timestamp with time zone DEFAULT now(),
    attended boolean DEFAULT false,
    joined_at timestamp with time zone,
    left_at timestamp with time zone,
    attendance_duration integer DEFAULT 0,
    questions_asked integer DEFAULT 0,
    polls_answered integer DEFAULT 0,
    chat_messages integer DEFAULT 0,
    engagement_score numeric(5,2) DEFAULT 0
);


--
-- Name: live_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.live_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    instructor_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    slug character varying(200) NOT NULL,
    session_type character varying(50) DEFAULT 'webinar'::character varying,
    format character varying(50) DEFAULT 'lecture'::character varying,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    duration integer,
    platform character varying(50) DEFAULT 'zoom'::character varying,
    meeting_url text,
    meeting_id character varying(100),
    meeting_password character varying(100),
    join_instructions text,
    will_be_recorded boolean DEFAULT true,
    recording_url text,
    slides_url text,
    resources jsonb,
    max_attendees integer,
    is_public boolean DEFAULT true,
    requires_registration boolean DEFAULT false,
    registration_deadline timestamp with time zone,
    status character varying(20) DEFAULT 'scheduled'::character varying,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    attendee_count integer DEFAULT 0,
    average_attendance_duration integer DEFAULT 0,
    engagement_score numeric(5,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.login_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    ip_address inet NOT NULL,
    user_agent text,
    success boolean DEFAULT false,
    failure_reason text,
    attempted_at timestamp with time zone DEFAULT now()
);


--
-- Name: modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    slug character varying(200) NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    is_published boolean DEFAULT true,
    is_preview_available boolean DEFAULT false,
    is_required boolean DEFAULT true,
    estimated_duration integer DEFAULT 0,
    lesson_count integer DEFAULT 0,
    video_duration integer DEFAULT 0,
    learning_objectives text[],
    key_concepts text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    action_url text,
    related_entity_type character varying(50),
    related_entity_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone
);


--
-- Name: oauth_users; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.oauth_users AS
 SELECT u.id,
    u.username,
    u.email,
    u.name,
    a.provider,
    a.provider_account_id,
    a.created_at AS oauth_connected_at,
    a.provider_data
   FROM (public.users u
     JOIN public.accounts a ON ((u.id = a.user_id)))
  WHERE ((a.type)::text = 'oauth'::text);


--
-- Name: password_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    hashed_password character varying(255) NOT NULL,
    changed_at timestamp with time zone DEFAULT now(),
    changed_by uuid,
    ip_address inet
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL,
    used boolean DEFAULT false,
    used_at timestamp with time zone,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: pending_notifications; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.pending_notifications AS
 SELECT n.id,
    n.user_id,
    n.type,
    n.title,
    n.message,
    n.is_read,
    n.action_url,
    n.related_entity_type,
    n.related_entity_id,
    n.created_at,
    n.read_at,
    u.username,
    u.name AS user_name
   FROM (public.notifications n
     JOIN public.users u ON ((n.user_id = u.id)))
  WHERE (n.is_read = false)
  ORDER BY n.created_at DESC;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    question_text text NOT NULL,
    question_type character varying(20),
    options jsonb,
    correct_answer text,
    possible_answers text[],
    explanation text,
    hints text[],
    points integer DEFAULT 1,
    partial_credit boolean DEFAULT false,
    image_url text,
    video_url text,
    code_template text,
    allowed_file_types text[],
    is_required boolean DEFAULT true,
    order_index integer DEFAULT 0,
    difficulty character varying(20) DEFAULT 'medium'::character varying,
    time_limit integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT questions_question_type_check CHECK (((question_type)::text = ANY ((ARRAY['multiple_choice'::character varying, 'true_false'::character varying, 'short_answer'::character varying, 'essay'::character varying, 'matching'::character varying, 'fill_blank'::character varying, 'code'::character varying, 'file_upload'::character varying])::text[])))
);


--
-- Name: realtime_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realtime_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    category character varying(50) DEFAULT 'general'::character varying,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    image_url text,
    data jsonb,
    is_read boolean DEFAULT false,
    is_delivered boolean DEFAULT false,
    delivery_method character varying(20) DEFAULT 'in_app'::character varying,
    delivery_attempts integer DEFAULT 0,
    priority character varying(20) DEFAULT 'normal'::character varying,
    expires_at timestamp with time zone,
    scheduled_for timestamp with time zone,
    related_entity_type character varying(50),
    related_entity_id uuid,
    action_url text,
    created_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone,
    delivered_at timestamp with time zone
);


--
-- Name: reply_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reply_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reply_id uuid NOT NULL,
    user_id uuid NOT NULL,
    vote_type character varying(10),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reply_votes_vote_type_check CHECK (((vote_type)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying])::text[])))
);


--
-- Name: review_helpful_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_helpful_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    is_helpful boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: review_reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_reactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reaction_type character varying(20),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT review_reactions_reaction_type_check CHECK (((reaction_type)::text = ANY ((ARRAY['like'::character varying, 'dislike'::character varying, 'helpful'::character varying, 'love'::character varying, 'insightful'::character varying, 'funny'::character varying])::text[])))
);


--
-- Name: review_replies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_reply_id uuid,
    content text NOT NULL,
    is_instructor_reply boolean DEFAULT false,
    is_edited boolean DEFAULT false,
    edited_at timestamp with time zone,
    like_count integer DEFAULT 0,
    report_count integer DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: role_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    requested_role_id uuid NOT NULL,
    request_type character varying(50) DEFAULT 'upgrade'::character varying,
    justification text NOT NULL,
    qualifications text,
    portfolio_links text[],
    teaching_experience text,
    supporting_documents jsonb,
    status character varying(20) DEFAULT 'pending'::character varying,
    priority character varying(20) DEFAULT 'normal'::character varying,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    admin_notes text,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    permissions jsonb DEFAULT '{}'::jsonb,
    hierarchy_level integer DEFAULT 0,
    is_system_role boolean DEFAULT false,
    allow_self_assign boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: role_requests_details; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.role_requests_details AS
 SELECT rr.id,
    rr.user_id,
    rr.requested_role_id,
    rr.request_type,
    rr.justification,
    rr.qualifications,
    rr.portfolio_links,
    rr.teaching_experience,
    rr.supporting_documents,
    rr.status,
    rr.priority,
    rr.reviewed_by,
    rr.reviewed_at,
    rr.admin_notes,
    rr.rejection_reason,
    rr.created_at,
    rr.updated_at,
    u.username AS requester_username,
    u.email AS requester_email,
    u.name AS requester_name,
    r.name AS requested_role_name,
    admin_user.username AS reviewer_username,
    admin_user.name AS reviewer_name
   FROM (((public.role_requests rr
     JOIN public.users u ON ((rr.user_id = u.id)))
     JOIN public.roles r ON ((rr.requested_role_id = r.id)))
     LEFT JOIN public.users admin_user ON ((rr.reviewed_by = admin_user.id)));


--
-- Name: student_learning_dashboard; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.student_learning_dashboard AS
SELECT
    NULL::uuid AS user_id,
    NULL::uuid AS course_id,
    NULL::character varying(200) AS course_title,
    NULL::text AS thumbnail_url,
    NULL::uuid AS instructor_id,
    NULL::character varying(255) AS instructor_name,
    NULL::numeric(5,2) AS progress_percentage,
    NULL::timestamp with time zone AS enrolled_at,
    NULL::timestamp with time zone AS last_accessed_at,
    NULL::timestamp with time zone AS completed_at,
    NULL::character varying(20) AS enrollment_status,
    NULL::bigint AS completed_lessons,
    NULL::bigint AS total_lessons,
    NULL::bigint AS total_time_spent,
    NULL::numeric AS average_quiz_score,
    NULL::bigint AS assessment_attempts,
    NULL::timestamp with time zone AS last_assessment_date;


--
-- Name: study_group_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_group_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying(20) DEFAULT 'member'::character varying,
    joined_at timestamp with time zone DEFAULT now(),
    status character varying(20) DEFAULT 'active'::character varying,
    notification_preferences jsonb DEFAULT '{"email": true, "in_app": true}'::jsonb,
    last_accessed_at timestamp with time zone
);


--
-- Name: study_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid,
    name character varying(150) NOT NULL,
    description text,
    slug character varying(150) NOT NULL,
    visibility character varying(20) DEFAULT 'public'::character varying,
    access_type character varying(20) DEFAULT 'open'::character varying,
    max_members integer,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    study_schedule jsonb,
    learning_goals text[],
    study_focus_areas text[],
    member_count integer DEFAULT 0,
    activity_score numeric(5,2) DEFAULT 0,
    last_activity_at timestamp with time zone,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(100) NOT NULL,
    value jsonb NOT NULL,
    description text,
    category character varying(50) DEFAULT 'general'::character varying,
    data_type character varying(20) DEFAULT 'string'::character varying,
    is_public boolean DEFAULT false,
    is_editable boolean DEFAULT true,
    validation_rules jsonb,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(60) NOT NULL,
    description text,
    color character varying(7) DEFAULT '#3B82F6'::character varying,
    icon character varying(50),
    is_featured boolean DEFAULT false,
    is_trending boolean DEFAULT false,
    usage_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: trending_courses; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.trending_courses AS
 SELECT c.id,
    c.slug,
    c.instructor_id,
    c.category_id,
    c.title,
    c.subtitle,
    c.description_html,
    c.short_description,
    c.learning_objectives,
    c.prerequisites,
    c.target_audience,
    c.welcome_message,
    c.congratulations_message,
    c.difficulty_level,
    c.language,
    c.subtitle_languages,
    c.level,
    c.content_type,
    c.thumbnail_url,
    c.promo_video_url,
    c.video_preview_url,
    c.image_gallery,
    c.trailer_duration,
    c.price_cents,
    c.currency,
    c.discount_percent,
    c.discount_expires_at,
    c.original_price_cents,
    c.has_free_trial,
    c.trial_duration_days,
    c.is_published,
    c.is_featured,
    c.is_trending,
    c.is_bestseller,
    c.is_new,
    c.certificate_available,
    c.has_lifetime_access,
    c.allow_downloads,
    c.has_captions,
    c.has_transcripts,
    c.start_date,
    c.end_date,
    c.enrollment_capacity,
    c.requires_approval,
    c.approval_message,
    c.access_type,
    c.total_video_duration,
    c.total_lessons,
    c.total_quizzes,
    c.total_assignments,
    c.total_downloads,
    c.total_articles,
    c.enrolled_students_count,
    c.active_students_count,
    c.completed_students_count,
    c.average_rating,
    c.review_count,
    c.total_views,
    c.completion_rate,
    c.engagement_score,
    c.meta_title,
    c.meta_description,
    c.search_keywords,
    c.published_at,
    c.featured_at,
    c.trending_at,
    c.created_at,
    c.updated_at,
    u.name AS instructor_name,
    u.image AS instructor_image,
    cat.name AS category_name,
    (((((c.enrolled_students_count)::numeric * 0.3) + (c.average_rating * (20)::numeric)) + ((c.review_count)::numeric * 0.1)) + ((c.total_views)::numeric * 0.05)) AS trending_score
   FROM ((public.courses c
     JOIN public.users u ON ((c.instructor_id = u.id)))
     LEFT JOIN public.categories cat ON ((c.category_id = cat.id)))
  WHERE (c.is_published = true)
  ORDER BY (((((c.enrolled_students_count)::numeric * 0.3) + (c.average_rating * (20)::numeric)) + ((c.review_count)::numeric * 0.1)) + ((c.total_views)::numeric * 0.05)) DESC, c.created_at DESC;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    achievement_id uuid NOT NULL,
    earned_at timestamp with time zone DEFAULT now(),
    xp_earned integer DEFAULT 0,
    progress_data jsonb,
    progress_percentage numeric(5,2) DEFAULT 0,
    is_seen boolean DEFAULT false
);


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type character varying(100) NOT NULL,
    activity_data jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action character varying(100) NOT NULL,
    resource_type character varying(100),
    resource_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    performed_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_details; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_details AS
SELECT
    NULL::uuid AS id,
    NULL::character varying(50) AS username,
    NULL::character varying(255) AS email,
    NULL::character varying(255) AS name,
    NULL::text AS bio,
    NULL::text AS image,
    NULL::timestamp with time zone AS email_verified,
    NULL::boolean AS is_active,
    NULL::timestamp with time zone AS last_login,
    NULL::character varying(50) AS timezone,
    NULL::character varying(10) AS locale,
    NULL::timestamp with time zone AS created_at,
    NULL::timestamp with time zone AS updated_at,
    NULL::character varying(255) AS display_name,
    NULL::character varying(255) AS headline,
    NULL::character varying(100) AS location,
    NULL::character varying(100) AS company,
    NULL::character varying(512) AS website,
    NULL::text[] AS skills,
    NULL::jsonb AS expertise_levels,
    NULL::text[] AS learning_goals,
    NULL::character varying[] AS roles,
    NULL::character varying(50) AS primary_role,
    NULL::bigint AS following_count,
    NULL::bigint AS followers_count,
    NULL::character varying[] AS oauth_providers,
    NULL::bigint AS pending_role_requests;


--
-- Name: user_follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    follower_id uuid NOT NULL,
    following_id uuid NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    notification_preferences jsonb DEFAULT '{"types": ["posts", "courses"], "enabled": true}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_follows_check CHECK ((follower_id <> following_id))
);


--
-- Name: user_learning_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_learning_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    time_spent_learning integer DEFAULT 0,
    lessons_completed integer DEFAULT 0,
    courses_accessed integer DEFAULT 0,
    assessments_taken integer DEFAULT 0,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    total_xp_earned integer DEFAULT 0,
    level_progress numeric(5,2) DEFAULT 0,
    preferred_learning_time character varying(20),
    average_session_duration integer DEFAULT 0,
    learning_consistency_score numeric(5,2) DEFAULT 0,
    average_quiz_score numeric(5,2) DEFAULT 0,
    course_completion_rate numeric(5,2) DEFAULT 0,
    knowledge_retention_score numeric(5,2) DEFAULT 0
);


--
-- Name: user_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_id uuid NOT NULL,
    content text NOT NULL,
    video_timestamp integer,
    is_public boolean DEFAULT false,
    tags text[],
    color character varying(7) DEFAULT '#3B82F6'::character varying,
    is_pinned boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name character varying(255),
    headline character varying(255),
    location character varying(100),
    company character varying(100),
    website character varying(512),
    twitter_username character varying(50),
    github_username character varying(50),
    linkedin_url character varying(255),
    youtube_channel character varying(255),
    skills text[],
    expertise_levels jsonb,
    achievements jsonb,
    portfolio_urls text[],
    social_links jsonb,
    learning_goals text[],
    preferred_topics text[],
    availability_status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    profile_image text,
    profile_image_public_id text
);


--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_id uuid NOT NULL,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    last_accessed_at timestamp with time zone DEFAULT now(),
    time_spent integer DEFAULT 0,
    video_progress numeric(5,2) DEFAULT 0,
    last_position integer DEFAULT 0,
    notes_count integer DEFAULT 0,
    bookmarks_count integer DEFAULT 0,
    questions_asked integer DEFAULT 0,
    replay_count integer DEFAULT 0,
    quiz_score numeric(5,2),
    assignment_score numeric(5,2),
    completion_status character varying(20) DEFAULT 'not_started'::character varying,
    watch_pattern jsonb,
    engagement_heatmap jsonb
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    assigned_by uuid,
    assigned_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    is_primary boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: user_social_activity; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_social_activity AS
 SELECT u.id AS user_id,
    u.name,
    u.username,
    u.image,
    count(DISTINCT cl.id) AS courses_liked,
    count(DISTINCT cs.id) AS courses_shared,
    count(DISTINCT cr.id) AS reviews_written,
    count(DISTINCT rr.id) AS review_reactions_given,
    count(DISTINCT rp.id) AS review_replies_written
   FROM (((((public.users u
     LEFT JOIN public.course_likes cl ON ((u.id = cl.user_id)))
     LEFT JOIN public.course_shares cs ON ((u.id = cs.user_id)))
     LEFT JOIN public.course_reviews cr ON ((u.id = cr.user_id)))
     LEFT JOIN public.review_reactions rr ON ((u.id = rr.user_id)))
     LEFT JOIN public.review_replies rp ON ((u.id = rp.user_id)))
  GROUP BY u.id, u.name, u.username, u.image;


--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    type character varying(50) DEFAULT 'email_verification'::character varying,
    expires timestamp with time zone NOT NULL,
    used boolean DEFAULT false,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_provider_provider_account_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_provider_provider_account_id_key UNIQUE (provider, provider_account_id);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: assessment_attempts assessment_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_pkey PRIMARY KEY (id);


--
-- Name: assessment_attempts assessment_attempts_user_id_assessment_id_attempt_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_user_id_assessment_id_attempt_number_key UNIQUE (user_id, assessment_id, attempt_number);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: certificates certificates_certificate_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_certificate_code_key UNIQUE (certificate_code);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_verification_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_verification_hash_key UNIQUE (verification_hash);


--
-- Name: course_analytics course_analytics_course_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_analytics
    ADD CONSTRAINT course_analytics_course_id_date_key UNIQUE (course_id, date);


--
-- Name: course_analytics course_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_analytics
    ADD CONSTRAINT course_analytics_pkey PRIMARY KEY (id);


--
-- Name: course_likes course_likes_course_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_likes
    ADD CONSTRAINT course_likes_course_id_user_id_key UNIQUE (course_id, user_id);


--
-- Name: course_likes course_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_likes
    ADD CONSTRAINT course_likes_pkey PRIMARY KEY (id);


--
-- Name: course_reviews course_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_pkey PRIMARY KEY (id);


--
-- Name: course_reviews course_reviews_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: course_shares course_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_shares
    ADD CONSTRAINT course_shares_pkey PRIMARY KEY (id);


--
-- Name: course_tags course_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_tags
    ADD CONSTRAINT course_tags_pkey PRIMARY KEY (course_id, tag_id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: direct_messages direct_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_pkey PRIMARY KEY (id);


--
-- Name: discussion_replies discussion_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion_replies
    ADD CONSTRAINT discussion_replies_pkey PRIMARY KEY (id);


--
-- Name: discussions discussions_course_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_course_id_slug_key UNIQUE (course_id, slug);


--
-- Name: discussions discussions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: feature_flags feature_flags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_name_key UNIQUE (name);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: lesson_transcripts lesson_transcripts_lesson_id_language_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_transcripts
    ADD CONSTRAINT lesson_transcripts_lesson_id_language_key UNIQUE (lesson_id, language);


--
-- Name: lesson_transcripts lesson_transcripts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_transcripts
    ADD CONSTRAINT lesson_transcripts_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_module_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_slug_key UNIQUE (module_id, slug);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: live_session_attendees live_session_attendees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_session_attendees
    ADD CONSTRAINT live_session_attendees_pkey PRIMARY KEY (id);


--
-- Name: live_session_attendees live_session_attendees_session_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_session_attendees
    ADD CONSTRAINT live_session_attendees_session_id_user_id_key UNIQUE (session_id, user_id);


--
-- Name: live_sessions live_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_sessions
    ADD CONSTRAINT live_sessions_pkey PRIMARY KEY (id);


--
-- Name: live_sessions live_sessions_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_sessions
    ADD CONSTRAINT live_sessions_slug_key UNIQUE (slug);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: modules modules_course_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_slug_key UNIQUE (course_id, slug);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_history password_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_history
    ADD CONSTRAINT password_history_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: realtime_notifications realtime_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realtime_notifications
    ADD CONSTRAINT realtime_notifications_pkey PRIMARY KEY (id);


--
-- Name: reply_votes reply_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reply_votes
    ADD CONSTRAINT reply_votes_pkey PRIMARY KEY (id);


--
-- Name: reply_votes reply_votes_reply_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reply_votes
    ADD CONSTRAINT reply_votes_reply_id_user_id_key UNIQUE (reply_id, user_id);


--
-- Name: review_helpful_votes review_helpful_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_pkey PRIMARY KEY (id);


--
-- Name: review_helpful_votes review_helpful_votes_review_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_review_id_user_id_key UNIQUE (review_id, user_id);


--
-- Name: review_reactions review_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reactions
    ADD CONSTRAINT review_reactions_pkey PRIMARY KEY (id);


--
-- Name: review_reactions review_reactions_review_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reactions
    ADD CONSTRAINT review_reactions_review_id_user_id_key UNIQUE (review_id, user_id);


--
-- Name: review_replies review_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_replies
    ADD CONSTRAINT review_replies_pkey PRIMARY KEY (id);


--
-- Name: role_requests role_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_requests
    ADD CONSTRAINT role_requests_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);


--
-- Name: study_group_members study_group_members_group_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members
    ADD CONSTRAINT study_group_members_group_id_user_id_key UNIQUE (group_id, user_id);


--
-- Name: study_group_members study_group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members
    ADD CONSTRAINT study_group_members_pkey PRIMARY KEY (id);


--
-- Name: study_groups study_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT study_groups_pkey PRIMARY KEY (id);


--
-- Name: study_groups study_groups_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT study_groups_slug_key UNIQUE (slug);


--
-- Name: system_settings system_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_key_key UNIQUE (key);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_slug_key UNIQUE (slug);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_user_id_achievement_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_achievement_id_key UNIQUE (user_id, achievement_id);


--
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- Name: user_audit_logs user_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_audit_logs
    ADD CONSTRAINT user_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: user_follows user_follows_follower_id_following_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_id_following_id_key UNIQUE (follower_id, following_id);


--
-- Name: user_follows user_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (id);


--
-- Name: user_learning_analytics user_learning_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_learning_analytics
    ADD CONSTRAINT user_learning_analytics_pkey PRIMARY KEY (id);


--
-- Name: user_learning_analytics user_learning_analytics_user_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_learning_analytics
    ADD CONSTRAINT user_learning_analytics_user_id_date_key UNIQUE (user_id, date);


--
-- Name: user_notes user_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- Name: user_progress user_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: verification_tokens verification_tokens_identifier_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_identifier_token_key UNIQUE (identifier, token);


--
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: verification_tokens verification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_token_key UNIQUE (token);


--
-- Name: idx_accounts_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_accounts_provider ON public.accounts USING btree (provider);


--
-- Name: idx_accounts_provider_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_accounts_provider_account_id ON public.accounts USING btree (provider_account_id);


--
-- Name: idx_accounts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_accounts_user_id ON public.accounts USING btree (user_id);


--
-- Name: idx_assessments_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assessments_course_id ON public.assessments USING btree (course_id);


--
-- Name: idx_attempts_submitted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_submitted_at ON public.assessment_attempts USING btree (submitted_at DESC);


--
-- Name: idx_attempts_user_assessment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_user_assessment ON public.assessment_attempts USING btree (user_id, assessment_id);


--
-- Name: idx_course_analytics_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_analytics_date ON public.course_analytics USING btree (date DESC);


--
-- Name: idx_course_likes_course_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_likes_course_user ON public.course_likes USING btree (course_id, user_id);


--
-- Name: idx_course_likes_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_likes_user ON public.course_likes USING btree (user_id);


--
-- Name: idx_course_shares_course_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_shares_course_type ON public.course_shares USING btree (course_id, share_type);


--
-- Name: idx_course_shares_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_shares_user ON public.course_shares USING btree (user_id);


--
-- Name: idx_courses_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_category_id ON public.courses USING btree (category_id);


--
-- Name: idx_courses_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_created_at ON public.courses USING btree (created_at DESC);


--
-- Name: idx_courses_difficulty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_difficulty ON public.courses USING btree (difficulty_level);


--
-- Name: idx_courses_enrollment_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_enrollment_count ON public.courses USING btree (enrolled_students_count DESC);


--
-- Name: idx_courses_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_featured ON public.courses USING btree (is_featured) WHERE (is_featured = true);


--
-- Name: idx_courses_instructor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_instructor_id ON public.courses USING btree (instructor_id);


--
-- Name: idx_courses_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_published ON public.courses USING btree (is_published) WHERE (is_published = true);


--
-- Name: idx_courses_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_rating ON public.courses USING btree (average_rating DESC);


--
-- Name: idx_courses_search; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_search ON public.courses USING gin (to_tsvector('english'::regconfig, (((((title)::text || ' '::text) || (subtitle)::text) || ' '::text) || description_html)));


--
-- Name: idx_courses_trending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_trending ON public.courses USING btree (is_trending) WHERE (is_trending = true);


--
-- Name: idx_discussions_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_discussions_course_id ON public.discussions USING btree (course_id);


--
-- Name: idx_discussions_pinned; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_discussions_pinned ON public.discussions USING btree (is_pinned) WHERE (is_pinned = true);


--
-- Name: idx_discussions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_discussions_user_id ON public.discussions USING btree (user_id);


--
-- Name: idx_enrollments_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enrollments_course_id ON public.enrollments USING btree (course_id);


--
-- Name: idx_enrollments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enrollments_status ON public.enrollments USING btree (status);


--
-- Name: idx_enrollments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enrollments_user_id ON public.enrollments USING btree (user_id);


--
-- Name: idx_lessons_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_course_id ON public.lessons USING btree (course_id);


--
-- Name: idx_lessons_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_module_id ON public.lessons USING btree (module_id);


--
-- Name: idx_lessons_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_order ON public.lessons USING btree (module_id, order_index);


--
-- Name: idx_lessons_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_type ON public.lessons USING btree (lesson_type);


--
-- Name: idx_login_attempts_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_login_attempts_email ON public.login_attempts USING btree (email);


--
-- Name: idx_login_attempts_ip; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_login_attempts_ip ON public.login_attempts USING btree (ip_address);


--
-- Name: idx_login_attempts_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_login_attempts_time ON public.login_attempts USING btree (attempted_at);


--
-- Name: idx_modules_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_modules_course_id ON public.modules USING btree (course_id);


--
-- Name: idx_modules_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_modules_order ON public.modules USING btree (course_id, order_index);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);


--
-- Name: idx_notifications_is_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read) WHERE (is_read = false);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_password_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_history_user_id ON public.password_history USING btree (user_id);


--
-- Name: idx_password_reset_tokens_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens USING btree (token);


--
-- Name: idx_password_reset_tokens_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens USING btree (user_id);


--
-- Name: idx_questions_assessment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_questions_assessment_id ON public.questions USING btree (assessment_id);


--
-- Name: idx_realtime_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realtime_notifications_created_at ON public.realtime_notifications USING btree (created_at DESC);


--
-- Name: idx_realtime_notifications_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realtime_notifications_type ON public.realtime_notifications USING btree (type);


--
-- Name: idx_realtime_notifications_user_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realtime_notifications_user_unread ON public.realtime_notifications USING btree (user_id, is_read) WHERE (is_read = false);


--
-- Name: idx_review_reactions_review_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_reactions_review_type ON public.review_reactions USING btree (review_id, reaction_type);


--
-- Name: idx_review_replies_review_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_replies_review_status ON public.review_replies USING btree (review_id, status);


--
-- Name: idx_reviews_course_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_course_rating ON public.course_reviews USING btree (course_id, rating);


--
-- Name: idx_role_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_requests_created_at ON public.role_requests USING btree (created_at);


--
-- Name: idx_role_requests_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_requests_reviewed_by ON public.role_requests USING btree (reviewed_by);


--
-- Name: idx_role_requests_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_requests_role_id ON public.role_requests USING btree (requested_role_id);


--
-- Name: idx_role_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_requests_status ON public.role_requests USING btree (status);


--
-- Name: idx_role_requests_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_requests_user_id ON public.role_requests USING btree (user_id);


--
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_expires ON public.sessions USING btree (expires);


--
-- Name: idx_sessions_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_is_active ON public.sessions USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_sessions_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_token ON public.sessions USING btree (session_token);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);


--
-- Name: idx_study_groups_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_study_groups_course_id ON public.study_groups USING btree (course_id);


--
-- Name: idx_user_activities_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activities_created_at ON public.user_activities USING btree (created_at);


--
-- Name: idx_user_activities_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activities_type ON public.user_activities USING btree (activity_type);


--
-- Name: idx_user_activities_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activities_user_id ON public.user_activities USING btree (user_id);


--
-- Name: idx_user_analytics_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_analytics_date ON public.user_learning_analytics USING btree (date DESC);


--
-- Name: idx_user_audit_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_audit_logs_action ON public.user_audit_logs USING btree (action);


--
-- Name: idx_user_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_audit_logs_created_at ON public.user_audit_logs USING btree (created_at);


--
-- Name: idx_user_audit_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_audit_logs_user_id ON public.user_audit_logs USING btree (user_id);


--
-- Name: idx_user_follows_follower_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_follows_follower_id ON public.user_follows USING btree (follower_id);


--
-- Name: idx_user_follows_following_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_follows_following_id ON public.user_follows USING btree (following_id);


--
-- Name: idx_user_follows_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_follows_status ON public.user_follows USING btree (status) WHERE ((status)::text = 'active'::text);


--
-- Name: idx_user_progress_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_progress_completed ON public.user_progress USING btree (is_completed) WHERE (is_completed = true);


--
-- Name: idx_user_progress_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_progress_lesson ON public.user_progress USING btree (lesson_id);


--
-- Name: idx_user_progress_user_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_progress_user_course ON public.user_progress USING btree (user_id, course_id);


--
-- Name: idx_user_roles_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_expires ON public.user_roles USING btree (expires_at) WHERE (expires_at IS NOT NULL);


--
-- Name: idx_user_roles_primary; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_primary ON public.user_roles USING btree (is_primary) WHERE (is_primary = true);


--
-- Name: idx_user_roles_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_role_id ON public.user_roles USING btree (role_id);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_email_verified; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email_verified ON public.users USING btree (email_verified) WHERE (email_verified IS NOT NULL);


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_users_last_login; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_last_login ON public.users USING btree (last_login);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: idx_verification_tokens_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_tokens_expires ON public.verification_tokens USING btree (expires);


--
-- Name: idx_verification_tokens_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_tokens_identifier ON public.verification_tokens USING btree (identifier);


--
-- Name: idx_verification_tokens_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_tokens_token ON public.verification_tokens USING btree (token);


--
-- Name: idx_verification_tokens_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_tokens_type ON public.verification_tokens USING btree (type);


--
-- Name: course_details _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.course_details AS
 SELECT c.id,
    c.slug,
    c.instructor_id,
    c.category_id,
    c.title,
    c.subtitle,
    c.description_html,
    c.short_description,
    c.learning_objectives,
    c.prerequisites,
    c.target_audience,
    c.welcome_message,
    c.congratulations_message,
    c.difficulty_level,
    c.language,
    c.subtitle_languages,
    c.level,
    c.content_type,
    c.thumbnail_url,
    c.promo_video_url,
    c.video_preview_url,
    c.image_gallery,
    c.trailer_duration,
    c.price_cents,
    c.currency,
    c.discount_percent,
    c.discount_expires_at,
    c.original_price_cents,
    c.has_free_trial,
    c.trial_duration_days,
    c.is_published,
    c.is_featured,
    c.is_trending,
    c.is_bestseller,
    c.is_new,
    c.certificate_available,
    c.has_lifetime_access,
    c.allow_downloads,
    c.has_captions,
    c.has_transcripts,
    c.start_date,
    c.end_date,
    c.enrollment_capacity,
    c.requires_approval,
    c.approval_message,
    c.access_type,
    c.total_video_duration,
    c.total_lessons,
    c.total_quizzes,
    c.total_assignments,
    c.total_downloads,
    c.total_articles,
    c.enrolled_students_count,
    c.active_students_count,
    c.completed_students_count,
    c.average_rating,
    c.review_count,
    c.total_views,
    c.completion_rate,
    c.engagement_score,
    c.meta_title,
    c.meta_description,
    c.search_keywords,
    c.published_at,
    c.featured_at,
    c.trending_at,
    c.created_at,
    c.updated_at,
    u.name AS instructor_name,
    u.username AS instructor_username,
    u.image AS instructor_image,
    u.bio AS instructor_bio,
    cat.name AS category_name,
    cat.slug AS category_slug,
    count(DISTINCT e.id) AS total_enrollments_count,
    count(DISTINCT cr.id) AS total_reviews_count,
    avg(cr.rating) AS calculated_rating,
    count(DISTINCT m.id) AS module_count,
    count(DISTINCT l.id) AS lesson_count,
    array_agg(DISTINCT t.name) AS tag_names,
    COALESCE(sum(l.video_duration), (0)::bigint) AS total_video_duration_actual
   FROM ((((((((public.courses c
     LEFT JOIN public.users u ON ((c.instructor_id = u.id)))
     LEFT JOIN public.categories cat ON ((c.category_id = cat.id)))
     LEFT JOIN public.enrollments e ON ((c.id = e.course_id)))
     LEFT JOIN public.course_reviews cr ON (((c.id = cr.course_id) AND ((cr.status)::text = 'approved'::text))))
     LEFT JOIN public.modules m ON ((c.id = m.course_id)))
     LEFT JOIN public.lessons l ON ((m.id = l.module_id)))
     LEFT JOIN public.course_tags ct ON ((c.id = ct.course_id)))
     LEFT JOIN public.tags t ON ((ct.tag_id = t.id)))
  GROUP BY c.id, u.id, cat.id;


--
-- Name: instructor_dashboard _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.instructor_dashboard AS
 SELECT u.id AS instructor_id,
    u.name AS instructor_name,
    u.username,
    u.image AS instructor_image,
    count(DISTINCT c.id) AS total_courses,
    count(DISTINCT c.id) FILTER (WHERE (c.is_published = true)) AS published_courses,
    count(DISTINCT e.id) AS total_enrollments,
    COALESCE(sum(c.enrolled_students_count), (0)::bigint) AS total_students,
    avg(c.average_rating) AS average_rating,
    count(DISTINCT cr.id) AS total_reviews,
    COALESCE(sum(ca.revenue_cents), (0)::bigint) AS total_revenue_cents,
    avg(e.progress_percentage) AS average_completion_rate,
    count(DISTINCT ls.id) AS total_live_sessions,
    max(c.created_at) AS last_course_created
   FROM (((((public.users u
     LEFT JOIN public.courses c ON ((u.id = c.instructor_id)))
     LEFT JOIN public.enrollments e ON ((c.id = e.course_id)))
     LEFT JOIN public.course_reviews cr ON ((c.id = cr.course_id)))
     LEFT JOIN public.course_analytics ca ON ((c.id = ca.course_id)))
     LEFT JOIN public.live_sessions ls ON ((u.id = ls.instructor_id)))
  WHERE (u.id IN ( SELECT ur.user_id
           FROM (public.user_roles ur
             JOIN public.roles r ON ((ur.role_id = r.id)))
          WHERE ((r.name)::text = 'instructor'::text)))
  GROUP BY u.id;


--
-- Name: student_learning_dashboard _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.student_learning_dashboard AS
 SELECT e.user_id,
    e.course_id,
    c.title AS course_title,
    c.thumbnail_url,
    c.instructor_id,
    u.name AS instructor_name,
    e.progress_percentage,
    e.enrolled_at,
    e.last_accessed_at,
    e.completed_at,
    e.status AS enrollment_status,
    count(DISTINCT up.lesson_id) AS completed_lessons,
    count(DISTINCT l.id) AS total_lessons,
    COALESCE(sum(up.time_spent), (0)::bigint) AS total_time_spent,
    avg(up.quiz_score) AS average_quiz_score,
    count(DISTINCT aa.id) AS assessment_attempts,
    max(aa.submitted_at) AS last_assessment_date
   FROM ((((((public.enrollments e
     JOIN public.courses c ON ((e.course_id = c.id)))
     JOIN public.users u ON ((c.instructor_id = u.id)))
     LEFT JOIN public.modules m ON ((c.id = m.course_id)))
     LEFT JOIN public.lessons l ON ((m.id = l.module_id)))
     LEFT JOIN public.user_progress up ON (((e.user_id = up.user_id) AND (l.id = up.lesson_id) AND (up.is_completed = true))))
     LEFT JOIN public.assessment_attempts aa ON (((e.user_id = aa.user_id) AND (e.course_id = aa.course_id))))
  GROUP BY e.user_id, e.course_id, c.id, u.id, e.id;


--
-- Name: user_details _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.user_details AS
 SELECT u.id,
    u.username,
    u.email,
    u.name,
    u.bio,
    u.image,
    u.email_verified,
    u.is_active,
    u.last_login,
    u.timezone,
    u.locale,
    u.created_at,
    u.updated_at,
    up.display_name,
    up.headline,
    up.location,
    up.company,
    up.website,
    up.skills,
    up.expertise_levels,
    up.learning_goals,
    array_agg(DISTINCT r.name) AS roles,
    ( SELECT r_1.name
           FROM (public.user_roles ur_1
             JOIN public.roles r_1 ON ((ur_1.role_id = r_1.id)))
          WHERE ((ur_1.user_id = u.id) AND (ur_1.is_primary = true))
         LIMIT 1) AS primary_role,
    count(DISTINCT uf_following.id) AS following_count,
    count(DISTINCT uf_followers.id) AS followers_count,
    array_agg(DISTINCT a.provider) FILTER (WHERE (a.provider IS NOT NULL)) AS oauth_providers,
    ( SELECT count(*) AS count
           FROM public.role_requests rr
          WHERE ((rr.user_id = u.id) AND ((rr.status)::text = 'pending'::text))) AS pending_role_requests
   FROM ((((((public.users u
     LEFT JOIN public.user_profiles up ON ((u.id = up.user_id)))
     LEFT JOIN public.user_roles ur ON ((u.id = ur.user_id)))
     LEFT JOIN public.roles r ON ((ur.role_id = r.id)))
     LEFT JOIN public.user_follows uf_following ON ((u.id = uf_following.follower_id)))
     LEFT JOIN public.user_follows uf_followers ON ((u.id = uf_followers.following_id)))
     LEFT JOIN public.accounts a ON ((u.id = a.user_id)))
  GROUP BY u.id, up.id;


--
-- Name: accounts update_accounts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: categories update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses update_courses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: discussions update_discussions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON public.discussions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lessons update_lessons_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: live_sessions update_live_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON public.live_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: modules update_modules_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: role_requests update_role_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_role_requests_updated_at BEFORE UPDATE ON public.role_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sessions update_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: course_likes update_social_counts_on_likes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_social_counts_on_likes AFTER INSERT OR DELETE OR UPDATE ON public.course_likes FOR EACH ROW EXECUTE FUNCTION public.update_social_counts();


--
-- Name: review_reactions update_social_counts_on_reactions; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_social_counts_on_reactions AFTER INSERT OR DELETE OR UPDATE ON public.review_reactions FOR EACH ROW EXECUTE FUNCTION public.update_social_counts();


--
-- Name: review_replies update_social_counts_on_replies; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_social_counts_on_replies AFTER INSERT OR DELETE OR UPDATE ON public.review_replies FOR EACH ROW EXECUTE FUNCTION public.update_social_counts();


--
-- Name: course_shares update_social_counts_on_shares; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_social_counts_on_shares AFTER INSERT OR DELETE OR UPDATE ON public.course_shares FOR EACH ROW EXECUTE FUNCTION public.update_social_counts();


--
-- Name: tags update_tags_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_follows update_user_follows_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_follows_updated_at BEFORE UPDATE ON public.user_follows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_profiles update_user_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: assessment_attempts assessment_attempts_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;


--
-- Name: assessment_attempts assessment_attempts_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: assessment_attempts assessment_attempts_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: assessment_attempts assessment_attempts_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id);


--
-- Name: assessment_attempts assessment_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: assessments assessments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: assessments assessments_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: certificates certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_analytics course_analytics_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_analytics
    ADD CONSTRAINT course_analytics_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_likes course_likes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_likes
    ADD CONSTRAINT course_likes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_likes course_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_likes
    ADD CONSTRAINT course_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_reviews course_reviews_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_reviews course_reviews_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: course_reviews course_reviews_moderated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_moderated_by_fkey FOREIGN KEY (moderated_by) REFERENCES public.users(id);


--
-- Name: course_reviews course_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_shares course_shares_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_shares
    ADD CONSTRAINT course_shares_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_shares course_shares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_shares
    ADD CONSTRAINT course_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_tags course_tags_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_tags
    ADD CONSTRAINT course_tags_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_tags course_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_tags
    ADD CONSTRAINT course_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: courses courses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: courses courses_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: direct_messages direct_messages_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;


--
-- Name: direct_messages direct_messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: direct_messages direct_messages_reply_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_reply_to_id_fkey FOREIGN KEY (reply_to_id) REFERENCES public.direct_messages(id) ON DELETE SET NULL;


--
-- Name: direct_messages direct_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: discussion_replies discussion_replies_discussion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion_replies
    ADD CONSTRAINT discussion_replies_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;


--
-- Name: discussion_replies discussion_replies_parent_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion_replies
    ADD CONSTRAINT discussion_replies_parent_reply_id_fkey FOREIGN KEY (parent_reply_id) REFERENCES public.discussion_replies(id) ON DELETE CASCADE;


--
-- Name: discussion_replies discussion_replies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion_replies
    ADD CONSTRAINT discussion_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: discussions discussions_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: discussions discussions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_current_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_current_lesson_id_fkey FOREIGN KEY (current_lesson_id) REFERENCES public.lessons(id);


--
-- Name: enrollments enrollments_current_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_current_module_id_fkey FOREIGN KEY (current_module_id) REFERENCES public.modules(id);


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lesson_transcripts lesson_transcripts_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_transcripts
    ADD CONSTRAINT lesson_transcripts_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: live_session_attendees live_session_attendees_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_session_attendees
    ADD CONSTRAINT live_session_attendees_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: live_session_attendees live_session_attendees_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_session_attendees
    ADD CONSTRAINT live_session_attendees_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.live_sessions(id) ON DELETE CASCADE;


--
-- Name: live_session_attendees live_session_attendees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_session_attendees
    ADD CONSTRAINT live_session_attendees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: live_sessions live_sessions_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_sessions
    ADD CONSTRAINT live_sessions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: live_sessions live_sessions_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_sessions
    ADD CONSTRAINT live_sessions_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: modules modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_history password_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_history
    ADD CONSTRAINT password_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id);


--
-- Name: password_history password_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_history
    ADD CONSTRAINT password_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: questions questions_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;


--
-- Name: realtime_notifications realtime_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realtime_notifications
    ADD CONSTRAINT realtime_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reply_votes reply_votes_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reply_votes
    ADD CONSTRAINT reply_votes_reply_id_fkey FOREIGN KEY (reply_id) REFERENCES public.discussion_replies(id) ON DELETE CASCADE;


--
-- Name: reply_votes reply_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reply_votes
    ADD CONSTRAINT reply_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_helpful_votes review_helpful_votes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.course_reviews(id) ON DELETE CASCADE;


--
-- Name: review_helpful_votes review_helpful_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_reactions review_reactions_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reactions
    ADD CONSTRAINT review_reactions_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.course_reviews(id) ON DELETE CASCADE;


--
-- Name: review_reactions review_reactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_reactions
    ADD CONSTRAINT review_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_replies review_replies_parent_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_replies
    ADD CONSTRAINT review_replies_parent_reply_id_fkey FOREIGN KEY (parent_reply_id) REFERENCES public.review_replies(id) ON DELETE CASCADE;


--
-- Name: review_replies review_replies_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_replies
    ADD CONSTRAINT review_replies_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.course_reviews(id) ON DELETE CASCADE;


--
-- Name: review_replies review_replies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_replies
    ADD CONSTRAINT review_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: role_requests role_requests_requested_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_requests
    ADD CONSTRAINT role_requests_requested_role_id_fkey FOREIGN KEY (requested_role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: role_requests role_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_requests
    ADD CONSTRAINT role_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: role_requests role_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_requests
    ADD CONSTRAINT role_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: study_group_members study_group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members
    ADD CONSTRAINT study_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;


--
-- Name: study_group_members study_group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members
    ADD CONSTRAINT study_group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: study_groups study_groups_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT study_groups_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: study_groups study_groups_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT study_groups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: system_settings system_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_activities user_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_audit_logs user_audit_logs_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_audit_logs
    ADD CONSTRAINT user_audit_logs_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- Name: user_audit_logs user_audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_audit_logs
    ADD CONSTRAINT user_audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: user_follows user_follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_follows user_follows_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_learning_analytics user_learning_analytics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_learning_analytics
    ADD CONSTRAINT user_learning_analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_notes user_notes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: user_notes user_notes_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: user_notes user_notes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: user_notes user_notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


