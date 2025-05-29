-- Initial seed data for Ramona dealership management system
-- Multi-tenant seed data with proper dealer relationships

-- Insert Dealers
INSERT INTO dealers (id, business_name, email, phone, address, created_at, updated_at) VALUES
('d1234567-89ab-4cde-f012-3456789abcde', 'Ramona Auto Group', 'info@ramonaauto.com', '809-555-0100', 'Av. Winston Churchill #123, Piantini, Santo Domingo', NOW(), NOW()),
('d2345678-9abc-4def-0123-456789abcdef', 'Auto Excellence RD', 'ventas@autoexcellence.com.do', '809-555-0200', 'Av. Abraham Lincoln #456, La Julia, Santo Domingo', NOW(), NOW());

-- Insert Concesionarios (Consignment partners) - linked to dealers
INSERT INTO concesionarios (id, name, contact_name, phone, email, address, dealer_id, created_at, updated_at) VALUES
('c1111111-2222-3333-4444-555566667777', 'AutoVentas Premium', 'Carlos Rodríguez', '809-777-1001', 'carlos@autoventaspremium.com', 'Av. 27 de Febrero #789, Gazcue, Santo Domingo', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('c2222222-3333-4444-5555-666677778888', 'Vehículos del Este', 'María González', '809-777-2002', 'maria@vehiculosdeleste.com', 'Autopista del Este Km 15, San Pedro de Macorís', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('c3333333-4444-5555-6666-777788889999', 'Auto Express Santiago', 'Pedro Martínez', '809-777-3003', 'pedro@autoexpress.com', 'Av. Juan Pablo Duarte #234, Santiago', 'd2345678-9abc-4def-0123-456789abcdef', NOW(), NOW());

-- Insert Vehicles - linked to dealers and concesionarios
INSERT INTO vehicles (id, brand, model, year, vehicle_type, color, status, condition, vin, plate, price, transmission, fuel_type, engine_size, doors, seats, mileage, dealer_id, concesionario_id, created_at, updated_at) VALUES
('11111111-aaaa-4bbb-8ccc-ddddeeeeeeee', 'Toyota', 'Corolla', 2022, 'Sedan', 'Blanco', 'available', 'used', '1HGCM82633A123456', 'A123456', '950000', 'Automática', 'Gasolina', '1.8L', 4, 5, 1500, 'd1234567-89ab-4cde-f012-3456789abcde', 'c1111111-2222-3333-4444-555566667777', NOW(), NOW()),
('22222222-bbbb-4ccc-8ddd-eeeeeeeeffff', 'Honda', 'Civic', 2021, 'Sedan', 'Negro', 'available', 'used', '2HGFG12567H789012', 'B789012', '875000', 'Manual', 'Gasolina', '2.0L', 4, 5, 2800, 'd1234567-89ab-4cde-f012-3456789abcde', 'c2222222-3333-4444-5555-666677778888', NOW(), NOW()),
('33333333-cccc-4ddd-8eee-ffffffffffff', 'Hyundai', 'Tucson', 2023, 'SUV', 'Gris', 'available', 'used', '5NPE24AF1FH123789', 'C456789', '1250000', 'Automática', 'Gasolina', '2.4L', 4, 7, 800, 'd2345678-9abc-4def-0123-456789abcdef', 'c3333333-4444-5555-6666-777788889999', NOW(), NOW()),
('44444444-dddd-4eee-8fff-000000001111', 'Kia', 'Sportage', 2022, 'SUV', 'Azul', 'sold', 'used', '3KPGM4AG1LG456123', 'D987654', '1150000', 'Automática', 'Gasolina', '2.4L', 4, 5, 1200, 'd1234567-89ab-4cde-f012-3456789abcde', 'c1111111-2222-3333-4444-555566667777', NOW(), NOW()),
('55555555-eeee-4fff-8000-111111112222', 'Nissan', 'Sentra', 2023, 'Sedan', 'Rojo', 'available', 'used', '3N1AB7APXJY789456', 'E321098', '920000', 'CVT', 'Gasolina', '1.8L', 4, 5, 900, 'd2345678-9abc-4def-0123-456789abcdef', 'c3333333-4444-5555-6666-777788889999', NOW(), NOW()),
('66666666-ffff-4000-8111-222222223333', 'Ford', 'Escape', 2021, 'SUV', 'Blanco', 'reserved', 'used', '1FMCU9GD5MUA98765', 'F654321', '1080000', 'Automática', 'Gasolina', '1.5L Turbo', 4, 5, 3500, 'd1234567-89ab-4cde-f012-3456789abcde', 'c2222222-3333-4444-5555-666677778888', NOW(), NOW());

-- Insert Clients - linked to dealers
INSERT INTO clients (id, cedula, name, email, phone, address, dealer_id, created_at, updated_at) VALUES
('cl111111-1111-4111-8111-111111111111', '40212345678', 'Ana María Rodríguez', 'ana.rodriguez@email.com', '809-555-2001', 'Calle Primera 123, Gazcue, Santo Domingo', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('cl222222-2222-4222-8222-222222222222', '40298765432', 'Luis Fernando García', 'luis.garcia@email.com', '829-555-2002', 'Av. Independencia 456, Santo Domingo', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('cl333333-3333-4333-8333-333333333333', '40287654321', 'Carmen Dolores Martínez', 'carmen.martinez@email.com', '849-555-2003', 'Calle Central 789, Santiago', 'd2345678-9abc-4def-0123-456789abcdef', NOW(), NOW()),
('cl444444-4444-4444-8444-444444444444', '40276543210', 'Roberto Carlos Jiménez', 'roberto.jimenez@email.com', '809-555-2004', 'Av. Máximo Gómez 321, Santo Domingo', 'd2345678-9abc-4def-0123-456789abcdef', NOW(), NOW()),
('cl555555-5555-4555-8555-555555555555', '40265432109', 'Patricia Elena Vásquez', 'patricia.vasquez@email.com', '829-555-2005', 'Calle Duarte 567, Santiago', 'd2345678-9abc-4def-0123-456789abcdef', NOW(), NOW()),
('cl666666-6666-4666-8666-666666666666', '40254321098', 'Miguel Ángel Hernández', 'miguel.hernandez@email.com', '849-555-2006', 'Av. Lincoln 890, Santo Domingo', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('cl777777-7777-4777-8777-777777777777', '40243210987', 'Sandra Beatriz Morales', 'sandra.morales@email.com', '809-555-2007', 'Calle Mella 234, La Vega', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('cl888888-8888-4888-8888-888888888888', '40232109876', 'Carlos Eduardo Peña', 'carlos.pena@email.com', '829-555-2008', 'Av. Gregorio Luperón 345, Puerto Plata', 'd2345678-9abc-4def-0123-456789abcdef', NOW(), NOW());

-- Insert Contracts - linked to dealers, clients, and vehicles
INSERT INTO contracts (id, client_id, vehicle_id, price, down_payment, months, monthly_payment, status, financing_type, date, dealer_id, created_at, updated_at) VALUES
('co111111-1111-4111-8111-111111111111', 'cl333333-3333-4333-8333-333333333333', '33333333-cccc-4ddd-8eee-ffffffffffff', '1250000', '350000', 48, '22500', 'active', 'financing', '2024-01-15', 'd2345678-9abc-4def-0123-456789abcdef', NOW(), NOW()),
('co222222-2222-4222-8222-222222222222', 'cl111111-1111-4111-8111-111111111111', '44444444-dddd-4eee-8fff-000000001111', '1150000', '0', 0, '0', 'completed', 'cash', '2024-02-01', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('co333333-3333-4333-8333-333333333333', 'cl666666-6666-4666-8666-666666666666', '66666666-ffff-4000-8111-222222223333', '1080000', '280000', 36, '25000', 'pending', 'financing', '2024-03-01', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW());

-- Insert Insurance policies - linked to dealers, vehicles, clients, and contracts  
INSERT INTO insurance (id, vehicle_id, client_id, contract_id, start_date, expiry_date, coverage_type, coverage_duration, premium, status, dealer_id, created_at, updated_at) VALUES
('in111111-1111-4111-8111-111111111111', '33333333-cccc-4ddd-8eee-ffffffffffff', 'cl333333-3333-4333-8333-333333333333', 'co111111-1111-4111-8111-111111111111', '2024-01-15', '2025-01-15', 'full', 12, '45000', 'active', 'd2345678-9abc-4def-0123-456789abcdef', NOW(), NOW()),
('in222222-2222-4222-8222-222222222222', '44444444-dddd-4eee-8fff-000000001111', 'cl111111-1111-4111-8111-111111111111', 'co222222-2222-4222-8222-222222222222', '2024-02-01', '2025-02-01', 'basic', 12, '32000', 'active', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW()),
('in333333-3333-4333-8333-333333333333', '66666666-ffff-4000-8111-222222223333', 'cl666666-6666-4666-8666-666666666666', 'co333333-3333-4333-8333-333333333333', '2024-03-01', '2025-03-01', 'motor_transmission', 12, '38000', 'active', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW());

-- Sample admin profiles (these will be created after user signup through auth)
-- The following are placeholders - real profiles will be created via the create-admin script

-- INSERT INTO profiles (id, email, full_name, role, dealer_id, created_at, updated_at) VALUES
-- ('admin-user-uuid-from-auth-users', 'admin@ramona.com', 'Admin Usuario', 'admin', 'd1234567-89ab-4cde-f012-3456789abcde', NOW(), NOW());

-- End of seed data
-- 
-- Summary:
-- - 2 dealers (Ramona Auto Group, Auto Excellence RD)
-- - 3 concesionarios (consignment partners) 
-- - 6 vehicles (various makes/models, distributed across dealers)
-- - 8 clients (distributed across dealers, all with cedula)
-- - 3 contracts (various statuses and financing types)
-- - 3 insurance policies (different coverage types)
--
-- All data properly linked with dealer_id for multi-tenant isolation
-- All column names now match the actual database schema
-- Run 'pnpm run db:create-admin' after this to create an admin user

-- Sample admin profiles (these will be created after user signup through auth)
-- The following are placeholders - real profiles will be created via the create-admin script

-- INSERT INTO profiles (id, email, full_name, role, dealer_id, created_at, updated_at) VALUES
-- ('admin-user-uuid-from-auth-users', 'admin@ramona.com', 'Admin Usuario', 'admin', 'd1111111-1111-4111-8111-111111111111', NOW(), NOW());

-- End of seed data
-- 
-- Summary:
-- - 2 dealers (Ramona Auto Group, Auto Excellence RD)
-- - 3 concesionarios (consignment partners) 
-- - 10 vehicles (various makes/models, distributed across dealers)
-- - 8 clients (distributed across dealers)
-- - 5 contracts (various statuses and financing types)
-- - 4 insurance policies (different coverage types)
--
-- All data properly linked with dealer_id for multi-tenant isolation
-- Run 'pnpm run db:create-admin' after this to create an admin user