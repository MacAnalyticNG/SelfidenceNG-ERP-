-- Insert default branch
INSERT INTO branches (id, name, address, phone, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Main Branch', '123 Main Street, Lagos', '+234 800 000 0001', 'main@laundry.com'),
  ('00000000-0000-0000-0000-000000000002', 'Branch 2 - Ikeja', '456 Allen Avenue, Ikeja, Lagos', '+234 800 000 0002', 'ikeja@laundry.com');

-- Insert service categories
INSERT INTO service_categories (name, description) VALUES
  ('Men''s Traditional Wear - Cleaning', 'Traditional Nigerian men''s attire cleaning services'),
  ('Men''s Traditional Wear - Washing', 'Traditional Nigerian men''s attire washing services'),
  ('Women''s Traditional Wear - Cleaning', 'Traditional Nigerian women''s attire cleaning services'),
  ('Women''s Traditional Wear - Washing', 'Traditional Nigerian women''s attire washing services'),
  ('General Laundry', 'Standard laundry services'),
  ('Dry Cleaning', 'Professional dry cleaning services'),
  ('Special Items', 'Premium and special care items');

-- Insert services based on the requested traditional Nigerian clothing items
INSERT INTO services (category_id, name, description, base_price) VALUES
  -- Men's Cleaning
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Cleaning'), 'C-Agbada, Buba & Sokoto (Ankara)', 'Complete men''s Agbada set in Ankara fabric - Cleaning', 3500.00),
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Cleaning'), 'C-Agbada Buba & Sokoto (Lace)', 'Complete men''s Agbada set in Lace fabric - Cleaning', 5000.00),
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Cleaning'), 'C-Agbada Buba & Sokoto (Kaftan)', 'Complete men''s Agbada set in Kaftan style - Cleaning', 4500.00),
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Cleaning'), 'C-Ankara (Buba & Sokoto)', 'Men''s Ankara Buba and Sokoto - Cleaning', 2500.00),
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Cleaning'), 'C-Buba & Sokoto (Lace)', 'Men''s Lace Buba and Sokoto - Cleaning', 3000.00),
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Cleaning'), 'C-Buba & Sokoto (Kaftan)', 'Men''s Kaftan style Buba and Sokoto - Cleaning', 2800.00),
  
  -- Women's Cleaning
  ((SELECT id FROM service_categories WHERE name = 'Women''s Traditional Wear - Cleaning'), 'W-Agbada, Buba & Sokoto (Ankara)', 'Complete women''s Agbada set in Ankara fabric - Cleaning', 3500.00),
  ((SELECT id FROM service_categories WHERE name = 'Women''s Traditional Wear - Cleaning'), 'W-Agbada Buba & Sokoto (Lace)', 'Complete women''s Agbada set in Lace fabric - Cleaning', 5000.00),
  ((SELECT id FROM service_categories WHERE name = 'Women''s Traditional Wear - Cleaning'), 'W-Agbada Buba & Sokoto (Kaftan)', 'Complete women''s Agbada set in Kaftan style - Cleaning', 4500.00),
  ((SELECT id FROM service_categories WHERE name = 'Women''s Traditional Wear - Cleaning'), 'W-Ankara (Buba & Sokoto)', 'Women''s Ankara Buba and Sokoto - Cleaning', 2500.00),
  ((SELECT id FROM service_categories WHERE name = 'Women''s Traditional Wear - Cleaning'), 'W-Buba & Sokoto (Lace)', 'Women''s Lace Buba and Sokoto - Cleaning', 3000.00),
  ((SELECT id FROM service_categories WHERE name = 'Women''s Traditional Wear - Cleaning'), 'W-Buba & Sokoto (Kaftan)', 'Women''s Kaftan style Buba and Sokoto - Cleaning', 2800.00),
  
  -- Men's Washing
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Washing'), 'W-Dansiki & Sokoto', 'Men''s Dansiki and Sokoto - Washing', 2000.00),
  ((SELECT id FROM service_categories WHERE name = 'Men''s Traditional Wear - Washing'), 'Trouser & Igbo Buba', 'Men''s trouser and Igbo Buba - Washing', 1800.00),
  
  -- Special Items
  ((SELECT id FROM service_categories WHERE name = 'Special Items'), 'Aso Oke (Complete)', 'Complete Aso Oke traditional attire', 8000.00),
  ((SELECT id FROM service_categories WHERE name = 'Special Items'), 'Aso Oke (Complete Special)', 'Premium complete Aso Oke with special care', 12000.00),
  ((SELECT id FROM service_categories WHERE name = 'Special Items'), 'Native Cap', 'Traditional Nigerian cap', 500.00),
  
  -- General Services
  ((SELECT id FROM service_categories WHERE name = 'General Laundry'), 'Shirt/Blouse', 'Regular shirt or blouse', 500.00),
  ((SELECT id FROM service_categories WHERE name = 'General Laundry'), 'Trousers/Skirt', 'Regular trousers or skirt', 600.00),
  ((SELECT id FROM service_categories WHERE name = 'Dry Cleaning'), 'Suit (2-piece)', 'Complete 2-piece suit', 3000.00),
  ((SELECT id FROM service_categories WHERE name = 'Dry Cleaning'), 'Dress/Gown', 'Ladies dress or gown', 2500.00);
