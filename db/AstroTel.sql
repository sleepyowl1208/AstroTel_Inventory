-- 👨‍💼 Employee Table (Independent, No Foreign Keys)
CREATE TABLE Employees (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Role VARCHAR(50) CHECK (Role IN ('Admin', 'User')) NOT NULL
);

-- Drop the existing ID column
ALTER TABLE Employees DROP COLUMN ID;

-- Add the new ID column with VARCHAR(15) and set it as PRIMARY KEY
ALTER TABLE Employees ADD COLUMN ID VARCHAR(15) PRIMARY KEY;


SELECT * FROM Employees;

INSERT INTO Employees (ID, Name, Email, Role)
SELECT 
    'Astro' || (FLOOR(RANDOM() * 9000000) + 1000000)::TEXT AS ID,
    Name, Email, Role
FROM (VALUES
    ('Krishna Tandon', 'krishna.tandon@astrotel.com', 'Admin'),
    ('Oskar Johansson', 'oskar.johansson@astrotel.com', 'User'),
    ('Elias Andersson', 'elias.andersson@astrotel.com', 'User'),
    ('Liam Eriksson', 'liam.eriksson@astrotel.com', 'Admin'),
    ('Noah Lindberg', 'noah.lindberg@astrotel.com', 'User'),
    ('Felix Svensson', 'felix.svensson@astrotel.com', 'User'),
    ('Viktor Nyström', 'viktor.nystrom@astrotel.com', 'Admin'),
    ('Alva Sjöberg', 'alva.sjoberg@astrotel.com', 'User'),
    ('Maja Bergström', 'maja.bergstrom@astrotel.com', 'User'),
    ('Linnea Holm', 'linnea.holm@astrotel.com', 'Admin')
) AS emp (Name, Email, Role)
WHERE NOT EXISTS (
    SELECT 1 FROM Employees e WHERE e.ID = 'Astro' || (FLOOR(RANDOM() * 9000000) + 1000000)::TEXT
);


-- 🛍️ Customer Table
CREATE TABLE Customer (
    AccountID VARCHAR(100) PRIMARY KEY,
    AccountType VARCHAR(20) CHECK (AccountType IN ('Residential', 'Business')),
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    MainPhone VARCHAR(20) UNIQUE,
    Country VARCHAR(50),
    PriceList VARCHAR(50)
);

-- 🛍️ Insert 10 Customers with Unique Random AccountID
INSERT INTO Customer (AccountID, AccountType, Name, Email, MainPhone, Country, PriceList)
VALUES 
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Residential', 'Emma Karlsson', 'emma.karlsson@gmail.com', '+46701234567', 'Sweden', 'Standard'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Business', 'William Berg', 'william.berg@outlook.com', '+46709876543', 'Sweden', 'Premium'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Residential', 'Olivia Lund', 'olivia.lund@gmail.com', '+46703456789', 'Sweden', 'Basic'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Business', 'Lucas Engström', 'lucas.engstrom@outlook.com', '+46701112233', 'Sweden', 'Enterprise'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Residential', 'Alice Wallin', 'alice.wallin@gmail.com', '+46702233445', 'Sweden', 'Standard'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Business', 'Oscar Håkansson', 'oscar.hakansson@outlook.com', '+46703344556', 'Sweden', 'Premium'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Residential', 'Ella Björk', 'ella.bjork@gmail.com', '+46704455667', 'Sweden', 'Basic'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Business', 'Erik Söderström', 'erik.soderstrom@outlook.com', '+46705566778', 'Sweden', 'Enterprise'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Residential', 'Isabella Falk', 'isabella.falk@gmail.com', '+46706677889', 'Sweden', 'Standard'),
    ('Astro-' || (FLOOR(RANDOM() * 900000) + 100000)::TEXT, 'Business', 'Hugo Blom', 'hugo.blom@outlook.com', '+46707788990', 'Sweden', 'Premium');

SELECT * from Customer;

-- 🏠 Address Table (Linked to Customer)
CREATE TABLE Address (
    AddressID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    StreetAddress VARCHAR(255),
    StreetAddress2 VARCHAR(255),
    City VARCHAR(100),
    State VARCHAR(50),
    ZipCode VARCHAR(10),
    Country VARCHAR(50)
);

-- 🏠 Insert 10 Unique Addresses for Each Customer
INSERT INTO Address (AccountID, StreetAddress, StreetAddress2, City, State, ZipCode, Country)
SELECT 
    AccountID,
    -- Generate different street names
    CASE WHEN ROW_NUMBER() OVER () = 1 THEN 'Birch Street 12'
         WHEN ROW_NUMBER() OVER () = 2 THEN 'Oak Avenue 23'
         WHEN ROW_NUMBER() OVER () = 3 THEN 'Maple Lane 34'
         WHEN ROW_NUMBER() OVER () = 4 THEN 'Pine Road 45'
         WHEN ROW_NUMBER() OVER () = 5 THEN 'Willow Drive 56'
         WHEN ROW_NUMBER() OVER () = 6 THEN 'Cedar Street 67'
         WHEN ROW_NUMBER() OVER () = 7 THEN 'Elm Boulevard 78'
         WHEN ROW_NUMBER() OVER () = 8 THEN 'Spruce Way 89'
         WHEN ROW_NUMBER() OVER () = 9 THEN 'Aspen Terrace 90'
         ELSE 'Redwood Lane 101' 
    END,

    -- Generate different apartment/suite numbers
    CASE WHEN ROW_NUMBER() OVER () <= 5 THEN 'Apt ' || (FLOOR(RANDOM() * 50) + 1)::TEXT
         ELSE 'Suite ' || (FLOOR(RANDOM() * 300) + 100)::TEXT
    END,

    -- City, State, and Country remain constant
    'Stockholm', 
    'Stockholm', 

    -- Generate different zip codes
    CASE WHEN ROW_NUMBER() OVER () = 1 THEN '11420'
         WHEN ROW_NUMBER() OVER () = 2 THEN '11530'
         WHEN ROW_NUMBER() OVER () = 3 THEN '11640'
         WHEN ROW_NUMBER() OVER () = 4 THEN '11750'
         WHEN ROW_NUMBER() OVER () = 5 THEN '11860'
         WHEN ROW_NUMBER() OVER () = 6 THEN '11970'
         WHEN ROW_NUMBER() OVER () = 7 THEN '12080'
         WHEN ROW_NUMBER() OVER () = 8 THEN '12190'
         WHEN ROW_NUMBER() OVER () = 9 THEN '12200'
         ELSE '12310' 
    END,

    'Sweden'
FROM Customer
ORDER BY AccountID;  -- Ensures consistent insertion order

SELECT accountid from Address;

SELECT c.AccountID, c.Name, c.Email, a.StreetAddress, a.City, a.ZipCode
FROM Customer c
JOIN Address a ON c.AccountID = a.AccountID;


-- 📦 Purchases Table
CREATE TABLE Purchases (
    PurchaseID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    ProductType VARCHAR(50),
    ProductName VARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    Price DECIMAL(10,2),
    DataUsage INT DEFAULT 0,  -- Store GB Used
    CallMinutes INT DEFAULT 0,
    TVHours INT DEFAULT 0
);

INSERT INTO Purchases (AccountID, ProductType, ProductName, StartDate, EndDate, Price, DataUsage, CallMinutes, TVHours)
VALUES 
    -- 🌐 Customer 1 (Astro-116709): Broadband + Mobile
    ('Astro-116709', 'Broadband', 'Fiber Max 100 Mbps', '2024-01-10', '2025-01-10', 49.99, 500, 0, 0),
    ('Astro-116709', 'Mobile', 'Unlimited 5G Plan', '2023-12-15', '2024-12-15', 29.99, 100, 2000, 0),

    -- 📺 Customer 2 (Astro-235040): Streaming + Mobile
    ('Astro-235040', 'Streaming TV', 'AstroTV Premium', '2024-02-01', '2025-02-01', 15.99, 0, 0, 120),
    ('Astro-235040', 'Mobile', '5G Family Pack', '2024-03-01', '2025-03-01', 39.99, 200, 5000, 0),

    -- 🌍 Customer 3 (Astro-258152): Broadband + Mobile + TV
    ('Astro-258152', 'Broadband', 'Fiber Ultra 500 Mbps', '2024-01-20', '2025-01-20', 79.99, 1000, 0, 0),
    ('Astro-258152', 'Mobile', 'Prepaid Plan 10GB', '2024-01-01', '2024-07-01', 14.99, 50, 1000, 0),
    ('Astro-258152', 'Streaming TV', 'Sports Add-on', '2024-02-15', '2025-02-15', 12.99, 0, 0, 100),

    -- 📡 Customer 4 (Astro-348746): Only Broadband
    ('Astro-348746', 'Broadband', 'Gigabit Pro', '2023-10-20', '2024-10-20', 99.99, 2000, 0, 0),
    ('Astro-348746', 'Broadband', 'Fiber Start 50 Mbps', '2023-12-05', '2024-12-05', 39.99, 250, 0, 0),

    -- 📞 Customer 5 (Astro-492301): Mobile + Mobile
    ('Astro-492301', 'Mobile', 'Unlimited 5G Plan', '2024-01-05', '2025-01-05', 29.99, 100, 2000, 0),
    ('Astro-492301', 'Mobile', 'Prepaid Plan 20GB', '2024-02-10', '2024-08-10', 19.99, 75, 1500, 0),

    -- 🎬 Customer 6 (Astro-535696): Streaming + Broadband
    ('Astro-535696', 'Streaming TV', 'AstroTV Premium', '2023-11-10', '2024-11-10', 9.99, 0, 0, 80),
    ('Astro-535696', 'Broadband', 'Fiber Max 100 Mbps', '2024-01-15', '2025-01-15', 49.99, 500, 0, 0),

    -- 🌐 Customer 7 (Astro-544848): Broadband + Mobile + TV
    ('Astro-544848', 'Broadband', 'Fiber Ultra 500 Mbps', '2024-02-01', '2025-02-01', 79.99, 1000, 0, 0),
    ('Astro-544848', 'Mobile', 'Unlimited 5G Plan', '2024-01-05', '2025-01-05', 29.99, 100, 2000, 0),
    ('Astro-544848', 'Streaming TV', 'Sports Add-on', '2024-03-01', '2025-03-01', 12.99, 0, 0, 100),

    -- 📶 Customer 8 (Astro-632535): Mobile Only
    ('Astro-632535', 'Mobile', 'Prepaid Plan 10GB', '2024-01-01', '2024-07-01', 14.99, 50, 1000, 0),
    ('Astro-632535', 'Mobile', '5G Family Pack', '2024-02-01', '2025-02-01', 39.99, 200, 5000, 0),

    -- 📡 Customer 9 (Astro-671544): Streaming + Mobile
    ('Astro-671544', 'Streaming TV', 'AstroTV Basic', '2024-02-10', '2025-02-10', 9.99, 0, 0, 60),
    ('Astro-671544', 'Mobile', 'Prepaid Plan 5GB', '2024-01-15', '2024-06-15', 9.99, 25, 500, 0),

    -- 🏠 Customer 10 (Astro-719190): Broadband + Streaming
    ('Astro-719190', 'Broadband', 'Fiber Start 50 Mbps', '2023-12-20', '2024-12-20', 39.99, 250, 0, 0),
    ('Astro-719190', 'Streaming TV', 'AstroTV Premium', '2024-02-01', '2025-02-01', 15.99, 0, 0, 120);


--Test the relationship between customer and purchasesSELECT c.Name, p.ProductType, p.ProductName, p.StartDate, p.EndDate, p.Price
SELECT c.Name, p.ProductType, p.ProductName, p.StartDate, p.EndDate, p.Price
FROM Customer c
JOIN Purchases p ON c.AccountID = p.AccountID;

Select * from Purchases;

-- 📜 Orders Table
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    ProductType VARCHAR(50),
    ProductName VARCHAR(100),
    OrderDate DATE DEFAULT CURRENT_DATE,
    Status VARCHAR(20) CHECK (Status IN ('Pending', 'Shipped', 'Completed', 'Cancelled', 'Out for Delivery'))
);

INSERT INTO Orders (AccountID, ProductType, ProductName, OrderDate, Status) VALUES
-- 📌 Astro-116709
('Astro-116709', 'Mobile', 'Unlimited 5G Plan', '2024-02-01', 'Completed'),
('Astro-116709', 'Broadband', 'Fiber Max 100 Mbps', '2024-02-05', 'Shipped'),

-- 📌 Astro-235040
('Astro-235040', 'Mobile', '5G Family Pack', '2024-02-10', 'Out for Delivery'),
('Astro-235040', 'Mobile', 'Prepaid Plan 10GB', '2024-02-15', 'Completed'),
('Astro-235040', 'Streaming TV', 'AstroTV Premium', '2024-02-20', 'Pending'),

-- 📌 Astro-258152
('Astro-258152', 'Broadband', 'Fiber Start 50 Mbps', '2024-03-01', 'Completed'),
('Astro-258152', 'Streaming TV', 'Sports Add-on', '2024-03-05', 'Out for Delivery'),

-- 📌 Astro-348746
('Astro-348746', 'Mobile', 'Prepaid Plan 5GB', '2024-01-20', 'Shipped'),
('Astro-348746', 'Streaming TV', 'AstroTV Basic', '2024-02-05', 'Completed'),
('Astro-348746', 'Broadband', 'Gigabit Pro', '2024-02-10', 'Pending'),

-- 📌 Astro-492301
('Astro-492301', 'Streaming TV', 'Sports Add-on', '2024-02-01', 'Out for Delivery'),
('Astro-492301', 'Mobile', 'Unlimited 5G Plan', '2024-02-05', 'Completed'),

-- 📌 Astro-535696
('Astro-535696', 'Broadband', 'Fiber Ultra 500 Mbps', '2024-01-15', 'Shipped'),
('Astro-535696', 'Streaming TV', 'AstroTV Premium', '2024-01-20', 'Pending'),

-- 📌 Astro-544848
('Astro-544848', 'Mobile', 'Unlimited 5G Plan', '2024-01-10', 'Completed'),
('Astro-544848', 'Broadband', 'Fiber Max 100 Mbps', '2024-01-15', 'Shipped'),
('Astro-544848', 'Streaming TV', 'AstroTV Premium', '2024-01-20', 'Cancelled'),

-- 📌 Astro-632535
('Astro-632535', 'Mobile', 'Prepaid Plan 10GB', '2024-02-01', 'Completed'),
('Astro-632535', 'Broadband', 'Fiber Ultra 500 Mbps', '2024-02-10', 'Out for Delivery'),

-- 📌 Astro-671544
('Astro-671544', 'Streaming TV', 'AstroTV Basic', '2024-01-05', 'Completed'),
('Astro-671544', 'Broadband', 'Fiber Start 50 Mbps', '2024-01-10', 'Pending'),
('Astro-671544', 'Mobile', '5G Family Pack', '2024-01-15', 'Shipped'),

-- 📌 Astro-719190
('Astro-719190', 'Broadband', 'Gigabit Pro', '2024-01-20', 'Shipped'),
('Astro-719190', 'Mobile', 'Unlimited 5G Plan', '2024-01-25', 'Completed');

Select * from Orders;

-- 💳 Billing Table
CREATE TABLE Billing (
    BillID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    TotalAmount DECIMAL(10,2),
    DueDate DATE,
    Paid BOOLEAN DEFAULT FALSE
);

INSERT INTO Billing (AccountID, TotalAmount, DueDate, Paid) VALUES
-- 📌 Astro-116709
('Astro-116709', 79.98, '2024-03-01', TRUE),
('Astro-116709', 39.99, '2024-04-01', FALSE),
('Astro-116709', 119.97, '2024-05-01', TRUE),

-- 📌 Astro-235040
('Astro-235040', 29.99, '2024-02-01', FALSE),
('Astro-235040', 19.99, '2024-03-01', TRUE),
('Astro-235040', 49.99, '2024-04-01', FALSE),

-- 📌 Astro-258152
('Astro-258152', 99.99, '2024-01-20', TRUE),
('Astro-258152', 29.99, '2024-02-20', TRUE),
('Astro-258152', 79.99, '2024-03-20', FALSE),
('Astro-258152', 14.99, '2024-04-20', TRUE),

-- 📌 Astro-348746
('Astro-348746', 39.99, '2024-01-15', FALSE),
('Astro-348746', 59.99, '2024-02-15', TRUE),
('Astro-348746', 79.99, '2024-03-15', FALSE),

-- 📌 Astro-492301
('Astro-492301', 29.99, '2024-02-10', FALSE),
('Astro-492301', 15.99, '2024-03-10', TRUE),
('Astro-492301', 9.99, '2024-04-10', TRUE),

-- 📌 Astro-535696
('Astro-535696', 14.99, '2024-01-05', TRUE),
('Astro-535696', 12.99, '2024-02-05', TRUE),
('Astro-535696', 9.99, '2024-03-05', FALSE),

-- 📌 Astro-544848
('Astro-544848', 39.99, '2024-01-01', TRUE),
('Astro-544848', 49.99, '2024-02-01', FALSE),
('Astro-544848', 99.99, '2024-03-01', TRUE),
('Astro-544848', 15.99, '2024-04-01', FALSE),

-- 📌 Astro-632535
('Astro-632535', 49.99, '2024-02-15', TRUE),
('Astro-632535', 79.99, '2024-03-15', FALSE),
('Astro-632535', 9.99, '2024-04-15', TRUE),

-- 📌 Astro-671544
('Astro-671544', 12.99, '2024-01-10', FALSE),
('Astro-671544', 14.99, '2024-02-10', TRUE),
('Astro-671544', 29.99, '2024-03-10', TRUE),

-- 📌 Astro-719190
('Astro-719190', 15.99, '2024-01-05', FALSE),
('Astro-719190', 39.99, '2024-02-05', TRUE),
('Astro-719190', 49.99, '2024-03-05', TRUE),
('Astro-719190', 79.99, '2024-04-05', FALSE);

Select * from Billing;

-- 🔥 Spotlight Table (Customer Issues/Tickets)
CREATE TABLE Spotlight (
    TicketID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    IssueType VARCHAR(50),
    Status VARCHAR(20) CHECK (Status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    CreatedAt TIMESTAMP DEFAULT NOW()
);

INSERT INTO Spotlight (AccountID, IssueType, Status, CreatedAt) VALUES
-- 📌 Astro-116709
('Astro-116709', 'Billing Dispute', 'Resolved', '2024-02-10 10:15:00'),
('Astro-116709', 'Network Issue', 'Open', '2024-02-20 14:30:00'),

-- 📌 Astro-235040
('Astro-235040', 'Slow Internet', 'In Progress', '2024-03-01 09:45:00'),
('Astro-235040', 'Incorrect Charge', 'Closed', '2024-03-05 12:00:00'),
('Astro-235040', 'Service Downtime', 'Resolved', '2024-03-07 16:20:00'),

-- 📌 Astro-258152
('Astro-258152', 'Streaming Buffering Issue', 'Open', '2024-02-15 08:00:00'),
('Astro-258152', 'Failed Payment', 'Resolved', '2024-02-18 11:10:00'),

-- 📌 Astro-348746
('Astro-348746', 'Mobile Data Not Working', 'Closed', '2024-01-25 17:30:00'),
('Astro-348746', 'Billing Query', 'Open', '2024-02-01 13:50:00'),

-- 📌 Astro-492301
('Astro-492301', 'Roaming Not Activated', 'In Progress', '2024-02-05 07:20:00'),

-- 📌 Astro-535696
('Astro-535696', 'TV Subscription Not Available', 'Resolved', '2024-01-12 15:40:00'),
('Astro-535696', 'Broadband Installation Delay', 'Open', '2024-01-18 10:00:00'),

-- 📌 Astro-544848
('Astro-544848', 'Payment Not Reflecting', 'Closed', '2024-01-22 18:00:00'),
('Astro-544848', 'Frequent Disconnections', 'In Progress', '2024-02-02 09:15:00'),

-- 📌 Astro-632535
('Astro-632535', 'Mobile Plan Upgrade Issue', 'Resolved', '2024-02-07 14:00:00'),

-- 📌 Astro-671544
('Astro-671544', 'Incorrect Plan Activation', 'Open', '2024-01-30 16:45:00'),
('Astro-671544', 'Technical Support Request', 'Closed', '2024-02-08 11:30:00'),

-- 📌 Astro-719190
('Astro-719190', 'WiFi Signal Weak', 'In Progress', '2024-01-28 08:50:00'),
('Astro-719190', 'Service Request Delay', 'Resolved', '2024-02-10 17:00:00');

SELECT 
    C.AccountID, 
    C.Name, 
    S.TicketID, 
    S.IssueType, 
    S.Status, 
    S.CreatedAt
FROM Spotlight S
JOIN Customer C ON S.AccountID = C.AccountID
ORDER BY S.CreatedAt DESC;

CREATE TABLE SupportUpdates (
    UpdateID SERIAL PRIMARY KEY,
    TicketID INT REFERENCES Spotlight(TicketID) ON DELETE CASCADE,
    Status VARCHAR(20) CHECK (Status IN ('Awaiting Response', 'Under Investigation', 'Escalated', 'Resolved')),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    Notes TEXT
);

--CREATE TABLE SupportUpdates (
--    UpdateID SERIAL PRIMARY KEY,
--    TicketID VARCHAR(20) REFERENCES Spotlight(TicketID) ON DELETE CASCADE,  -- Now matches formatted ID
--    Status VARCHAR(20) CHECK (Status IN ('Awaiting Response', 'Under Investigation', 'Escalated', 'Resolved')),
--    UpdatedAt TIMESTAMP DEFAULT NOW(),
--    Notes TEXT
--);


INSERT INTO SupportUpdates (TicketID, Status, UpdatedAt, Notes) VALUES
-- 🛠️ Billing Dispute - Started, Investigated, Resolved
(1, 'Awaiting Response', '2024-02-10 11:00:00', 'Customer submitted a billing dispute.'),
(1, 'Under Investigation', '2024-02-11 09:30:00', 'Billing team reviewing transaction history.'),
(1, 'Resolved', '2024-02-12 15:00:00', 'Dispute resolved. Refund issued.'),

-- 🚀 Network Issue - Still open, under investigation
(2, 'Awaiting Response', '2024-02-20 15:00:00', 'Customer reported slow internet speeds.'),
(2, 'Under Investigation', '2024-02-21 10:45:00', 'Technical team analyzing network logs.'),

-- 🔥 Slow Internet - Escalated due to complaints
(3, 'Awaiting Response', '2024-03-01 10:00:00', 'User complained about slow connection.'),
(3, 'Under Investigation', '2024-03-02 12:15:00', 'Network team checking line quality.'),
(3, 'Escalated', '2024-03-03 08:30:00', 'Issue reported to higher support level.'),

-- 💰 Incorrect Charge - Quickly resolved
(4, 'Awaiting Response', '2024-03-05 12:30:00', 'Customer raised a query about extra charge.'),
(4, 'Resolved', '2024-03-05 17:00:00', 'Charge reversed. Customer notified.'),

-- 🔄 Service Downtime - Ongoing issue
(5, 'Awaiting Response', '2024-03-07 16:30:00', 'Customer reported complete service outage.'),
(5, 'Under Investigation', '2024-03-08 09:00:00', 'Engineering team checking backend systems.'),

-- 📺 Streaming Buffering - Progressing
(6, 'Awaiting Response', '2024-02-15 08:15:00', 'User reported buffering issues on AstroTV.'),
(6, 'Under Investigation', '2024-02-16 10:00:00', 'Testing bandwidth performance.'),
(6, 'Resolved', '2024-02-17 14:45:00', 'Issue resolved after firmware update.'),

-- 🛑 Failed Payment - Quickly fixed
(7, 'Awaiting Response', '2024-02-18 11:30:00', 'Payment failed. Customer unable to renew plan.'),
(7, 'Resolved', '2024-02-18 18:00:00', 'Payment issue resolved after retry.'),

-- 📶 Mobile Data Issue - Still unresolved
(8, 'Awaiting Response', '2024-01-25 18:00:00', 'User unable to use mobile data.'),
(8, 'Under Investigation', '2024-01-26 14:20:00', 'Carrier settings checked, issue persists.'),

-- 💵 Payment Not Reflecting - Escalated
(9, 'Awaiting Response', '2024-01-22 19:00:00', 'Customer made payment but balance unchanged.'),
(9, 'Under Investigation', '2024-01-23 09:40:00', 'Finance team reviewing transactions.'),
(9, 'Escalated', '2024-01-24 16:30:00', 'Bank reconciliation requested.'),
(9, 'Resolved', '2024-01-25 12:00:00', 'Payment credited to account successfully.');

SELECT 
    S.TicketID, 
    C.Name AS CustomerName, 
    S.IssueType, 
    SU.Status, 
    SU.UpdatedAt, 
    SU.Notes
FROM SupportUpdates SU
JOIN Spotlight S ON SU.TicketID = S.TicketID
JOIN Customer C ON S.AccountID = C.AccountID
ORDER BY SU.UpdatedAt DESC;


-- 🎁 Offers Table (AI-Predicted Recommendations)
CREATE TABLE Offers (
    OfferID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    OfferName VARCHAR(100),
    Discount INT CHECK (Discount BETWEEN 0 AND 100),
    RecommendationReason TEXT,
    CreatedOn TIMESTAMP DEFAULT NOW()
);

INSERT INTO Offers (AccountID, OfferName, Discount, RecommendationReason)
VALUES
    ('Astro-116709', '50% Off on Next Mobile Plan', 50, 'High mobile data usage detected.'),
    ('Astro-235040', '20% Off on Broadband Upgrade', 20, 'Frequent slow speed complaints.'),
    ('Astro-258152', 'Buy 1 Get 1 Free - AstroTV', 100, 'User frequently watches streaming TV.'),
    ('Astro-348746', '30% Discount on Family Plan', 30, 'Multiple mobile plans detected under the account.'),
    ('Astro-492301', '10% Off on New 5G Device', 10, 'Eligible for a device upgrade.'),
    ('Astro-535696', '25% Discount on Sports Package', 25, 'Regular sports streaming activity noted.'),
    ('Astro-544848', 'First 3 Months Free - Gigabit Plan', 100, 'Current broadband plan up for renewal.'),
    ('Astro-632535', 'Special Discount on AstroTV Premium', 15, 'User subscribes to basic AstroTV package.'),
    ('Astro-671544', 'Exclusive Offer: Extra 50GB Data Free', 0, 'User exceeds monthly data limit frequently.'),
    ('Astro-719190', 'Upgrade to 500 Mbps with 40% Off', 40, 'High broadband data consumption detected.');

SELECT 
    o.OfferID, 
    o.AccountID, 
    c.Name AS CustomerName, 
    c.Email AS CustomerEmail, 
    o.OfferName, 
    o.Discount, 
    o.RecommendationReason, 
    o.CreatedOn
FROM Offers o
JOIN Customer c ON o.AccountID = c.AccountID;


-- 📅 Timeline Table (Customer Events & Actions)
CREATE TABLE Timeline (
    EventID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    Title VARCHAR(255),
    Icon VARCHAR(50),
    EventDate TIMESTAMP DEFAULT NOW()
);

-- 🛒 Cart Table
CREATE TABLE Cart (
    CartID SERIAL PRIMARY KEY,
    AccountID VARCHAR(100) REFERENCES Customer(AccountID) ON DELETE CASCADE,
    ProductName VARCHAR(100),
    Quantity INT CHECK (Quantity > 0),
    Price DECIMAL(10,2)
);

INSERT INTO Timeline (AccountID, Title, Icon, EventDate)
VALUES 
    ('Astro-116709', 'New Plan Activated', '📱', '2024-02-15 10:30:00'),
    ('Astro-116709', 'Bill Payment Successful', '💰', '2024-02-20 15:45:00'),
    ('Astro-235040', 'Customer Support Ticket Opened', '🎫', '2024-02-10 09:00:00'),
    ('Astro-235040', 'Offer Applied - 20% Off', '🔥', '2024-02-18 14:20:00'),
    ('Astro-258152', 'Broadband Installation Completed', '🏠', '2024-02-25 11:00:00'),
    ('Astro-258152', 'Mobile Plan Upgrade', '📶', '2024-03-01 08:30:00'),
    ('Astro-348746', 'Streaming Subscription Renewal', '📺', '2024-02-05 12:15:00'),
    ('Astro-348746', 'Order Placed - New Router', '🛒', '2024-03-02 18:00:00'),
    ('Astro-492301', 'Customer Support Issue Resolved', '✅', '2024-03-01 16:10:00'),
    ('Astro-492301', 'Data Usage Alert Sent', '⚠️', '2024-02-27 20:45:00');

SELECT * from Timeline;

SELECT 
    t.EventID, 
    t.AccountID, 
    c.Name AS CustomerName, 
    t.Title, 
    t.Icon, 
    t.EventDate
FROM Timeline t
JOIN Customer c ON t.AccountID = c.AccountID;


SELECT t.*
FROM Timeline t
LEFT JOIN Customer c ON t.AccountID = c.AccountID
WHERE c.AccountID IS NULL;


UPDATE Customer
SET email = 'jan.anderson@gmail.com'
WHERE email = 'olivia.lund@gmail.com';

SELECT * FROM Address;

SELECT * FROM Purchases;

UPDATE Purchases
SET AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson')
WHERE AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Olivia Lund');


UPDATE Billing
SET AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson')
WHERE AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Olivia Lund');

UPDATE Orders
SET AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson')
WHERE AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Olivia Lund');

UPDATE Spotlight
SET AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson')
WHERE AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Olivia Lund');


UPDATE Offers
SET AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson')
WHERE AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Olivia Lund');

UPDATE Timeline
SET AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson')
WHERE AccountID = (SELECT AccountID FROM Customer WHERE Name = 'Olivia Lund');

SELECT * FROM Customer WHERE Name = 'Jan Anderson';
SELECT * FROM Purchases WHERE AccountID IN (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson');
SELECT * FROM Billing WHERE AccountID IN (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson');
SELECT * FROM Orders WHERE AccountID IN (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson');
SELECT * FROM Spotlight WHERE AccountID IN (SELECT AccountID FROM Cusstomer WHERE Name = 'Jan Anderson');
SELECT * FROM Offers WHERE AccountID IN (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson');s
SELECT * FROM Timeline WHERE AccountID IN (SELECT AccountID FROM Customer WHERE Name = 'Jan Anderson');






