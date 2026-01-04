-- Enable Row Level Security on all tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to get user branch
CREATE OR REPLACE FUNCTION get_user_branch()
RETURNS UUID AS $$
  SELECT branch_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- RLS Policies for branches
CREATE POLICY "Super admins can view all branches"
  ON branches FOR SELECT
  USING (get_user_role() = 'super_admin');

CREATE POLICY "Branch admins and staff can view their branch"
  ON branches FOR SELECT
  USING (id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Super admins can insert branches"
  ON branches FOR INSERT
  WITH CHECK (get_user_role() = 'super_admin');

CREATE POLICY "Super admins can update branches"
  ON branches FOR UPDATE
  USING (get_user_role() = 'super_admin');

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can view users in their branch"
  ON users FOR SELECT
  USING (
    get_user_role() IN ('super_admin', 'branch_admin') 
    AND (branch_id = get_user_branch() OR get_user_role() = 'super_admin')
  );

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (
    get_user_role() IN ('super_admin', 'branch_admin')
    AND (branch_id = get_user_branch() OR get_user_role() = 'super_admin')
  );

CREATE POLICY "Admins can update users in their branch"
  ON users FOR UPDATE
  USING (
    get_user_role() IN ('super_admin', 'branch_admin')
    AND (branch_id = get_user_branch() OR get_user_role() = 'super_admin')
  );

-- RLS Policies for customers
CREATE POLICY "Users can view customers in their branch"
  ON customers FOR SELECT
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Staff can insert customers in their branch"
  ON customers FOR INSERT
  WITH CHECK (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Staff can update customers in their branch"
  ON customers FOR UPDATE
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

-- RLS Policies for service_categories (all authenticated users can read)
CREATE POLICY "Anyone can view service categories"
  ON service_categories FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage service categories"
  ON service_categories FOR ALL
  USING (get_user_role() IN ('super_admin', 'branch_admin'));

-- RLS Policies for services (all authenticated users can read)
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  USING (get_user_role() IN ('super_admin', 'branch_admin'));

-- RLS Policies for orders
CREATE POLICY "Users can view orders in their branch"
  ON orders FOR SELECT
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Staff can create orders in their branch"
  ON orders FOR INSERT
  WITH CHECK (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Staff can update orders in their branch"
  ON orders FOR UPDATE
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

-- RLS Policies for order_items
CREATE POLICY "Users can view order items for orders in their branch"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.branch_id = get_user_branch() OR get_user_role() = 'super_admin')
    )
  );

CREATE POLICY "Staff can manage order items in their branch"
  ON order_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.branch_id = get_user_branch() OR get_user_role() = 'super_admin')
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view payments in their branch"
  ON payments FOR SELECT
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Staff can create payments in their branch"
  ON payments FOR INSERT
  WITH CHECK (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

-- RLS Policies for debt_reminders
CREATE POLICY "Users can view debt reminders in their branch"
  ON debt_reminders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = debt_reminders.customer_id 
      AND (customers.branch_id = get_user_branch() OR get_user_role() = 'super_admin')
    )
  );

CREATE POLICY "Staff can create debt reminders"
  ON debt_reminders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = debt_reminders.customer_id 
      AND (customers.branch_id = get_user_branch() OR get_user_role() = 'super_admin')
    )
  );

-- RLS Policies for inventory
CREATE POLICY "Users can view inventory in their branch"
  ON inventory FOR SELECT
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Staff can manage inventory in their branch"
  ON inventory FOR ALL
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

-- RLS Policies for staff_schedules
CREATE POLICY "Users can view schedules in their branch"
  ON staff_schedules FOR SELECT
  USING (branch_id = get_user_branch() OR get_user_role() = 'super_admin');

CREATE POLICY "Admins can manage schedules in their branch"
  ON staff_schedules FOR ALL
  USING (
    get_user_role() IN ('super_admin', 'branch_admin')
    AND (branch_id = get_user_branch() OR get_user_role() = 'super_admin')
  );
