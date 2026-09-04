--
-- PostgreSQL database dump
--

\restrict KK62oERNmS6iWHf1kicAH3xJfm01md5Prbh17x6aYhzADQyabrKWW7rTpgTGQ2u

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-09-04 16:33:31

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
-- TOC entry 5101 (class 0 OID 49663)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, created_at, updated_at) FROM stdin;
1	Demo User	demo@spendly.local	\N	2026-09-04 15:53:49.372854	2026-09-04 15:53:49.372854
\.


--
-- TOC entry 5103 (class 0 OID 49680)
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
-- TOC entry 5107 (class 0 OID 49727)
-- Dependencies: 226
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, user_id, category_id, month, amount, created_at, updated_at) FROM stdin;
1	1	1	2026-09-01	5000.00	2026-09-04 15:55:00.972923	2026-09-04 15:55:00.972923
\.


--
-- TOC entry 5113 (class 0 OID 49798)
-- Dependencies: 232
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, user_id, name, email, phone, created_at, updated_at) FROM stdin;
1	1	Rahul	rahul@example.com	9876543210	2026-09-04 16:09:11.800578	2026-09-04 16:09:11.800578
2	1	Priya	priya@example.com	9876501234	2026-09-04 16:09:11.800578	2026-09-04 16:09:11.800578
\.


--
-- TOC entry 5105 (class 0 OID 49698)
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
-- TOC entry 5109 (class 0 OID 49755)
-- Dependencies: 228
-- Data for Name: receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipts (id, user_id, original_filename, file_path, extraction_status, extracted_merchant, extracted_amount, extracted_date, extracted_category, extraction_raw, created_at, updated_at, expense_id) FROM stdin;
2	1	test_receipt.jpg	uploads/test_receipt.jpg	uploaded	\N	\N	\N	\N	\N	2026-09-04 15:58:31.87308	2026-09-04 15:58:31.87308	\N
1	1	test_receipt.jpg	uploads/test_receipt.jpg	confirmed	Starbucks	450.00	2026-09-04	Food	{"date": "2026-09-04", "amount": 450, "category": "Food", "merchant": "Starbucks"}	2026-09-04 15:57:16.079845	2026-09-04 16:06:14.158684	7
\.


--
-- TOC entry 5111 (class 0 OID 49780)
-- Dependencies: 230
-- Data for Name: receipt_corrections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipt_corrections (id, receipt_id, field_name, extracted_value, corrected_value, created_at) FROM stdin;
3	1	merchant	Starbucks	Starbucks Coffee	2026-09-04 16:01:39.587347
\.


--
-- TOC entry 5115 (class 0 OID 49816)
-- Dependencies: 234
-- Data for Name: splits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.splits (id, user_id, expense_id, created_at) FROM stdin;
1	1	7	2026-09-04 16:09:28.756281
2	1	7	2026-09-04 16:12:42.625351
\.


--
-- TOC entry 5117 (class 0 OID 49837)
-- Dependencies: 236
-- Data for Name: split_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.split_items (id, split_id, contact_id, amount) FROM stdin;
1	1	1	225.00
2	1	2	225.00
\.


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 225
-- Name: budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budgets_id_seq', 3, true);


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 221
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 16, true);


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 231
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 2, true);


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 223
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 8, true);


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 229
-- Name: receipt_corrections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipt_corrections_id_seq', 3, true);


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 227
-- Name: receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipts_id_seq', 2, true);


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 235
-- Name: split_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.split_items_id_seq', 4, true);


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 233
-- Name: splits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.splits_id_seq', 2, true);


--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


-- Completed on 2026-09-04 16:33:31

--
-- PostgreSQL database dump complete
--

\unrestrict KK62oERNmS6iWHf1kicAH3xJfm01md5Prbh17x6aYhzADQyabrKWW7rTpgTGQ2u

