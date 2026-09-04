--
-- PostgreSQL database dump
--

\restrict aEy2v3lDhedcnX2V4YDc1Bb5vQrWbI4ZOGsuwVBNdsbM3o3NlIt0qvptwUR0sMU

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-09-04 16:32:32

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
-- TOC entry 237 (class 1255 OID 49870)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 49727)
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    category_id bigint NOT NULL,
    month date NOT NULL,
    amount numeric(12,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT budget_amount_positive CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 49726)
-- Name: budgets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.budgets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.budgets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 49680)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 49679)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 49798)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255),
    phone character varying(30),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 49797)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.contacts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 49698)
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    category_id bigint NOT NULL,
    merchant character varying(255) NOT NULL,
    amount numeric(12,2) NOT NULL,
    expense_date date NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT expenses_amount_positive CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 49697)
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.expenses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.expenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 49780)
-- Name: receipt_corrections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receipt_corrections (
    id bigint NOT NULL,
    receipt_id bigint NOT NULL,
    field_name character varying(100) NOT NULL,
    extracted_value text,
    corrected_value text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.receipt_corrections OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 49779)
-- Name: receipt_corrections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.receipt_corrections ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.receipt_corrections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 49755)
-- Name: receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receipts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    original_filename character varying(255) NOT NULL,
    file_path text NOT NULL,
    extraction_status character varying(30) DEFAULT 'uploaded'::character varying NOT NULL,
    extracted_merchant character varying(255),
    extracted_amount numeric(12,2),
    extracted_date date,
    extracted_category character varying(100),
    extraction_raw jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expense_id bigint,
    CONSTRAINT receipt_amount_positive CHECK (((extracted_amount IS NULL) OR (extracted_amount > (0)::numeric))),
    CONSTRAINT receipt_status_check CHECK (((extraction_status)::text = ANY ((ARRAY['uploaded'::character varying, 'processing'::character varying, 'pending_review'::character varying, 'confirmed'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.receipts OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 49754)
-- Name: receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.receipts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.receipts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 49837)
-- Name: split_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.split_items (
    id bigint NOT NULL,
    split_id bigint NOT NULL,
    contact_id bigint NOT NULL,
    amount numeric(12,2) NOT NULL,
    CONSTRAINT split_item_amount_positive CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.split_items OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 49836)
-- Name: split_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.split_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.split_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 49816)
-- Name: splits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.splits (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    expense_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.splits OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 49815)
-- Name: splits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.splits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.splits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 49663)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 49662)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5126 (class 0 OID 49727)
-- Dependencies: 226
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, user_id, category_id, month, amount, created_at, updated_at) FROM stdin;
1	1	1	2026-09-01	5000.00	2026-09-04 15:55:00.972923	2026-09-04 15:55:00.972923
\.


--
-- TOC entry 5122 (class 0 OID 49680)
-- Dependencies: 222
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, user_id, name, created_at) FROM stdin;
1	1	Food	2026-09-04 15:54:04.182385
2	1	Groceries	2026-09-04 15:54:04.182385
3	1	Transport	2026-09-04 15:54:04.182385
4	1	Shopping	2026-09-04 15:54:04.182385
5	1	Bills	2026-09-04 15:54:04.182385
6	1	Healthcare	2026-09-04 15:54:04.182385
7	1	Education	2026-09-04 15:54:04.182385
8	1	Other	2026-09-04 15:54:04.182385
\.


--
-- TOC entry 5132 (class 0 OID 49798)
-- Dependencies: 232
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, user_id, name, email, phone, created_at, updated_at) FROM stdin;
1	1	Rahul	rahul@example.com	9876543210	2026-09-04 16:09:11.800578	2026-09-04 16:09:11.800578
2	1	Priya	priya@example.com	9876501234	2026-09-04 16:09:11.800578	2026-09-04 16:09:11.800578
\.


--
-- TOC entry 5124 (class 0 OID 49698)
-- Dependencies: 224
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, user_id, category_id, merchant, amount, expense_date, notes, created_at, updated_at) FROM stdin;
1	1	1	Domino's Pizza	650.00	2026-09-04	Dinner	2026-09-04 15:54:28.722804	2026-09-04 15:54:28.722804
2	1	3	Uber	320.00	2026-09-03	College travel	2026-09-04 15:54:28.722804	2026-09-04 15:54:28.722804
3	1	4	Amazon	1499.00	2026-09-01	Electronics	2026-09-04 15:54:28.722804	2026-09-04 15:54:28.722804
4	1	5	Airtel	799.00	2026-08-29	Mobile bill	2026-09-04 15:54:28.722804	2026-09-04 15:54:28.722804
5	1	1	Starbucks Coffee	450.00	2026-09-04	Created from receipt	2026-09-04 16:02:37.993327	2026-09-04 16:02:37.993327
6	1	1	Starbucks Coffee	450.00	2026-09-04	Created from receipt	2026-09-04 16:04:40.429439	2026-09-04 16:04:40.429439
7	1	1	Starbucks Coffee	450.00	2026-09-04	Updated during database testing	2026-09-04 16:05:22.771188	2026-09-04 16:10:42.993897
\.


--
-- TOC entry 5130 (class 0 OID 49780)
-- Dependencies: 230
-- Data for Name: receipt_corrections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipt_corrections (id, receipt_id, field_name, extracted_value, corrected_value, created_at) FROM stdin;
3	1	merchant	Starbucks	Starbucks Coffee	2026-09-04 16:01:39.587347
\.


--
-- TOC entry 5128 (class 0 OID 49755)
-- Dependencies: 228
-- Data for Name: receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipts (id, user_id, original_filename, file_path, extraction_status, extracted_merchant, extracted_amount, extracted_date, extracted_category, extraction_raw, created_at, updated_at, expense_id) FROM stdin;
2	1	test_receipt.jpg	uploads/test_receipt.jpg	uploaded	\N	\N	\N	\N	\N	2026-09-04 15:58:31.87308	2026-09-04 15:58:31.87308	\N
1	1	test_receipt.jpg	uploads/test_receipt.jpg	confirmed	Starbucks	450.00	2026-09-04	Food	{"date": "2026-09-04", "amount": 450, "category": "Food", "merchant": "Starbucks"}	2026-09-04 15:57:16.079845	2026-09-04 16:06:14.158684	7
\.


--
-- TOC entry 5136 (class 0 OID 49837)
-- Dependencies: 236
-- Data for Name: split_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.split_items (id, split_id, contact_id, amount) FROM stdin;
1	1	1	225.00
2	1	2	225.00
\.


--
-- TOC entry 5134 (class 0 OID 49816)
-- Dependencies: 234
-- Data for Name: splits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.splits (id, user_id, expense_id, created_at) FROM stdin;
1	1	7	2026-09-04 16:09:28.756281
2	1	7	2026-09-04 16:12:42.625351
\.


--
-- TOC entry 5120 (class 0 OID 49663)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, created_at, updated_at) FROM stdin;
1	Demo User	demo@spendly.local	\N	2026-09-04 15:53:49.372854	2026-09-04 15:53:49.372854
\.


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 225
-- Name: budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budgets_id_seq', 3, true);


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 221
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 16, true);


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 231
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 2, true);


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 223
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 8, true);


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 229
-- Name: receipt_corrections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipt_corrections_id_seq', 3, true);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 227
-- Name: receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipts_id_seq', 2, true);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 235
-- Name: split_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.split_items_id_seq', 4, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 233
-- Name: splits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.splits_id_seq', 2, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4931 (class 2606 OID 49741)
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- TOC entry 4921 (class 2606 OID 49689)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4944 (class 2606 OID 49809)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 49715)
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- TOC entry 4942 (class 2606 OID 49791)
-- Name: receipt_corrections receipt_corrections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt_corrections
    ADD CONSTRAINT receipt_corrections_pkey PRIMARY KEY (id);


--
-- TOC entry 4940 (class 2606 OID 49773)
-- Name: receipts receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 49846)
-- Name: split_items split_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.split_items
    ADD CONSTRAINT split_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 49825)
-- Name: splits splits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.splits
    ADD CONSTRAINT splits_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 2606 OID 49743)
-- Name: budgets unique_budget_per_category_month; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT unique_budget_per_category_month UNIQUE (user_id, category_id, month);


--
-- TOC entry 4923 (class 2606 OID 49691)
-- Name: categories unique_category_per_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT unique_category_per_user UNIQUE (user_id, name);


--
-- TOC entry 4953 (class 2606 OID 49848)
-- Name: split_items unique_contact_per_split; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.split_items
    ADD CONSTRAINT unique_contact_per_split UNIQUE (split_id, contact_id);


--
-- TOC entry 4917 (class 2606 OID 49678)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4919 (class 2606 OID 49676)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4932 (class 1259 OID 49864)
-- Name: idx_budgets_month; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_month ON public.budgets USING btree (month);


--
-- TOC entry 4933 (class 1259 OID 49863)
-- Name: idx_budgets_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_user_id ON public.budgets USING btree (user_id);


--
-- TOC entry 4945 (class 1259 OID 49867)
-- Name: idx_contacts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contacts_user_id ON public.contacts USING btree (user_id);


--
-- TOC entry 4926 (class 1259 OID 49860)
-- Name: idx_expenses_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_category_id ON public.expenses USING btree (category_id);


--
-- TOC entry 4927 (class 1259 OID 49861)
-- Name: idx_expenses_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_date ON public.expenses USING btree (expense_date);


--
-- TOC entry 4928 (class 1259 OID 49862)
-- Name: idx_expenses_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_user_date ON public.expenses USING btree (user_id, expense_date);


--
-- TOC entry 4929 (class 1259 OID 49859)
-- Name: idx_expenses_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_user_id ON public.expenses USING btree (user_id);


--
-- TOC entry 4936 (class 1259 OID 49881)
-- Name: idx_receipts_expense_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_receipts_expense_id ON public.receipts USING btree (expense_id);


--
-- TOC entry 4937 (class 1259 OID 49866)
-- Name: idx_receipts_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_receipts_status ON public.receipts USING btree (extraction_status);


--
-- TOC entry 4938 (class 1259 OID 49865)
-- Name: idx_receipts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_receipts_user_id ON public.receipts USING btree (user_id);


--
-- TOC entry 4946 (class 1259 OID 49869)
-- Name: idx_splits_expense_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_splits_expense_id ON public.splits USING btree (expense_id);


--
-- TOC entry 4947 (class 1259 OID 49868)
-- Name: idx_splits_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_splits_user_id ON public.splits USING btree (user_id);


--
-- TOC entry 4969 (class 2620 OID 49873)
-- Name: budgets update_budgets_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4971 (class 2620 OID 49875)
-- Name: contacts update_contacts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4968 (class 2620 OID 49872)
-- Name: expenses update_expenses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4970 (class 2620 OID 49874)
-- Name: receipts update_receipts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON public.receipts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4967 (class 2620 OID 49871)
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4957 (class 2606 OID 49749)
-- Name: budgets fk_budgets_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT fk_budgets_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 4958 (class 2606 OID 49744)
-- Name: budgets fk_budgets_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4954 (class 2606 OID 49692)
-- Name: categories fk_categories_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4962 (class 2606 OID 49810)
-- Name: contacts fk_contacts_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT fk_contacts_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4955 (class 2606 OID 49721)
-- Name: expenses fk_expenses_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT fk_expenses_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 4956 (class 2606 OID 49716)
-- Name: expenses fk_expenses_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4961 (class 2606 OID 49792)
-- Name: receipt_corrections fk_receipt_corrections_receipt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt_corrections
    ADD CONSTRAINT fk_receipt_corrections_receipt FOREIGN KEY (receipt_id) REFERENCES public.receipts(id) ON DELETE CASCADE;


--
-- TOC entry 4959 (class 2606 OID 49876)
-- Name: receipts fk_receipts_expense; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT fk_receipts_expense FOREIGN KEY (expense_id) REFERENCES public.expenses(id) ON DELETE SET NULL;


--
-- TOC entry 4960 (class 2606 OID 49774)
-- Name: receipts fk_receipts_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT fk_receipts_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4965 (class 2606 OID 49854)
-- Name: split_items fk_split_items_contact; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.split_items
    ADD CONSTRAINT fk_split_items_contact FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE RESTRICT;


--
-- TOC entry 4966 (class 2606 OID 49849)
-- Name: split_items fk_split_items_split; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.split_items
    ADD CONSTRAINT fk_split_items_split FOREIGN KEY (split_id) REFERENCES public.splits(id) ON DELETE CASCADE;


--
-- TOC entry 4963 (class 2606 OID 49831)
-- Name: splits fk_splits_expense; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.splits
    ADD CONSTRAINT fk_splits_expense FOREIGN KEY (expense_id) REFERENCES public.expenses(id) ON DELETE CASCADE;


--
-- TOC entry 4964 (class 2606 OID 49826)
-- Name: splits fk_splits_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.splits
    ADD CONSTRAINT fk_splits_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-09-04 16:32:32

--
-- PostgreSQL database dump complete
--

\unrestrict aEy2v3lDhedcnX2V4YDc1Bb5vQrWbI4ZOGsuwVBNdsbM3o3NlIt0qvptwUR0sMU

