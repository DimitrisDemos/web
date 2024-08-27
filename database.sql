-- Create the database
CREATE DATABASE DisasterReliefSystem;
USE DisasterReliefSystem;

-- Create table for Users (Administrator, Rescuer, Citizen)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    user_type ENUM('Admin', 'Rescuer', 'Citizen') NOT NULL,
    location POINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Categories
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Items
CREATE TABLE Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Warehouse Inventory
CREATE TABLE Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    quantity INT NOT NULL DEFAULT 0,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Announcements
CREATE TABLE Announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    announcement_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create table for Citizen Requests
CREATE TABLE Requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id INT,
    item_id INT,
    quantity INT,
    request_status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE SET NULL
);

-- Create table for Citizen Offers
CREATE TABLE Offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id INT,
    item_id INT,
    quantity INT,
    offer_status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE SET NULL
);

-- Create table for Rescuer Vehicles
CREATE TABLE Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    rescuer_id INT,
    vehicle_name VARCHAR(50) NOT NULL,
    current_location POINT,
    load_capacity INT,
    status ENUM('Available', 'In Task', 'Out of Service') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rescuer_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create table for Tasks (either a request or an offer assigned to a rescuer)
CREATE TABLE Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    task_type ENUM('Request', 'Offer'),
    task_id_ref INT, -- Refers to either Requests or Offers table
    status ENUM('Assigned', 'Completed', 'Cancelled') DEFAULT 'Assigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (task_id_ref) REFERENCES Requests(request_id) ON DELETE SET NULL,
    FOREIGN KEY (task_id_ref) REFERENCES Offers(offer_id) ON DELETE SET NULL
);

-- Create table for Statistics (for tracking completed tasks and system usage)
CREATE TABLE Statistics (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    new_requests INT DEFAULT 0,
    new_offers INT DEFAULT 0,
    completed_requests INT DEFAULT 0,
    completed_offers INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (username, password, fullname, phone, user_type)
VALUES
('admin', 'admin1123', 'Administrator', '6981490351', '1'),
('rescuer', 'pass', 'rescuer', '6946872608', '2');

INSERT INTO Categories (category_name)
VALUES
    ('Water'),
    ('Food'),
    ('Medical Supplies'),
    ('Hygiene Kits');


-- Insert items into the Items table and corresponding entries into the Inventory table
INSERT INTO Items (item_name, category_id)
VALUES
    ('Water Bottles', (SELECT category_id FROM Categories WHERE category_name = 'Water')),
    ('Meals Ready-to-Eat (MREs)', (SELECT category_id FROM Categories WHERE category_name = 'Food')),
    ('First Aid Kits', (SELECT category_id FROM Categories WHERE category_name = 'Medical Supplies')),
    ('Diapers', (SELECT category_id FROM Categories WHERE category_name = 'Hygiene Kits')),
    ('Sanitary Pads', (SELECT category_id FROM Categories WHERE category_name = 'Hygiene Kits')),
    ('Soap Bars', (SELECT category_id FROM Categories WHERE category_name = 'Hygiene Kits')),
    ('Blankets', (SELECT category_id FROM Categories WHERE category_name = 'Hygiene Kits')),
    ('Baby Formula', (SELECT category_id FROM Categories WHERE category_name = 'Food'));

-- Insert corresponding entries into the Inventory table with a default quantity
INSERT INTO Inventory (item_id, quantity)
SELECT item_id, 0 FROM Items WHERE item_name IN ('Water Bottles', 'Meals Ready-to-Eat (MREs)', 'First Aid Kits', 'Diapers', 'Sanitary Pads', 'Soap Bars', 'Blankets', 'Baby Formula');
