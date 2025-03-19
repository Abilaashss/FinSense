CREATE DATABASE fintech_loan_system;
USE fintech_loan_system;

CREATE TABLE loan_users (
    s_no INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    userid VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(45) NOT NULL,
    acc_no VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    ifsc_code VARCHAR(11) NOT NULL,
    branch VARCHAR(100),
    cibil_score INT CHECK (cibil_score BETWEEN 300 AND 900),
    phone_number VARCHAR(15),
    email VARCHAR(100),
    loan_amount DECIMAL(15, 2),
    loan_type VARCHAR(50),
    interest_rate DECIMAL(5, 2),
    loan_status ENUM('Pending', 'Approved', 'Rejected', 'Closed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO loan_users (name, userid, password, acc_no, address, ifsc_code, branch, cibil_score, phone_number, email, loan_amount, loan_type, interest_rate, loan_status) VALUES
('John Doe', 'johndoe01', 'e38ad214943daad1d64c102faec29de4', 'ACC1001', '123 Elm Street', 'IFSC0001', 'Downtown Branch', 750, '1234567890', 'john.doe@example.com', 50000.00, 'Home Loan', 6.5, 'Approved'),
('Jane Smith', 'janesmith02', 'd8578edf8458ce06fbc5bb76a58c5ca4', 'ACC1002', '456 Oak Street', 'IFSC0002', 'Uptown Branch', 820, '0987654321', 'jane.smith@example.com', 75000.00, 'Personal Loan', 7.2, 'Pending'),
('Alice Johnson', 'alicej03', 'f379eaf3c831b04de153469d1bec345e', 'ACC1003', '789 Pine Street', 'IFSC0003', 'Central Branch', 690, '1122334455', 'alice.j@example.com', 30000.00, 'Car Loan', 5.9, 'Rejected'),
('Bob Brown', 'bobb04', 'c4ca4238a0b923820dcc509a6f75849b', 'ACC1004', '101 Maple Street', 'IFSC0004', 'Eastside Branch', 720, '2233445566', 'bob.brown@example.com', 40000.00, 'Home Loan', 6.8, 'Approved'),
('Carol White', 'carolw05', 'c81e728d9d4c2f636f067f89cc14862c', 'ACC1005', '202 Birch Street', 'IFSC0005', 'Westside Branch', 810, '3344556677', 'carol.white@example.com', 85000.00, 'Business Loan', 8.0, 'Pending'),
('David Green', 'davidg06', 'eccbc87e4b5ce2fe28308fd9f2a7baf3', 'ACC1006', '303 Cedar Street', 'IFSC0006', 'North Branch', 650, '4455667788', 'david.green@example.com', 20000.00, 'Personal Loan', 7.0, 'Rejected'),
('Eva Blue', 'evab07', 'a87ff679a2f3e71d9181a67b7542122c', 'ACC1007', '404 Willow Street', 'IFSC0007', 'South Branch', 780, '5566778899', 'eva.blue@example.com', 60000.00, 'Car Loan', 5.5, 'Approved'),
('Frank Black', 'frankb08', 'e4da3b7fbbce2345d7772b0674a318d5', 'ACC1008', '505 Ash Street', 'IFSC0008', 'River Branch', 730, '6677889900', 'frank.black@example.com', 55000.00, 'Home Loan', 6.3, 'Pending'),
('Grace Yellow', 'gracey09', '1679091c5a880faf6fb5e6087eb1b2dc', 'ACC1009', '606 Poplar Street', 'IFSC0009', 'Mountain Branch', 870, '7788990011', 'grace.yellow@example.com', 95000.00, 'Business Loan', 7.5, 'Approved'),
('Harry Orange', 'harryo10', '8f14e45fceea167a5a36dedd4bea2543', 'ACC1010', '707 Spruce Street', 'IFSC0010', 'Valley Branch', 710, '8899001122', 'harry.orange@example.com', 45000.00, 'Personal Loan', 6.9, 'Pending');


INSERT INTO loan_users (name, userid, password, acc_no, address, ifsc_code, branch, cibil_score, phone_number, email, loan_amount, loan_type, interest_rate, loan_status) VALUES
('Sara White', 'sara21', '1a79a4d60de6718e8e5b326e338ae533', 'ACC1021', '1818 White Street', 'IFSC0021', 'Snow Branch', 800, '1111222233', 'sara.white@example.com', 75000.00, 'Personal Loan', 7.0, 'Pending'),
('Tom Silver', 'tom22', '3c59dc048e8850243be8079a5c74d079', 'ACC1022', '1919 Silver Street', 'IFSC0022', 'Moonlight Branch', 690, '2222333344', 'tom.silver@example.com', 34000.00, 'Car Loan', 6.1, 'Approved'),
('Uma Brown', 'uma23', 'b6d767d2f8ed5d21a44b0e5886680cb9', 'ACC1023', '2020 Brown Street', 'IFSC0023', 'Forest Branch', 720, '3333444455', 'uma.brown@example.com', 56000.00, 'Home Loan', 6.7, 'Approved'),
('Victor Green', 'victor24', '37693cfc748049e45d87b8c7d8b9aacd', 'ACC1024', '2121 Green Street', 'IFSC0024', 'Park Branch', 760, '4444555566', 'victor.green@example.com', 83000.00, 'Business Loan', 7.8, 'Pending'),
('Wendy Blue', 'wendy25', '1ff1de774005f8da13f42943881c655f', 'ACC1025', '2222 Blue Street', 'IFSC0025', 'Lake Branch', 680, '5555666677', 'wendy.blue@example.com', 27000.00, 'Personal Loan', 6.4, 'Rejected'),
('Xander Red', 'xander26', '8e296a067a37563370ded05f5a3bf3ec', 'ACC1026', '2323 Red Street', 'IFSC0026', 'Sunrise Branch', 750, '6666777788', 'xander.red@example.com', 62000.00, 'Home Loan', 6.5, 'Approved'),
('Yara Gold', 'yara27', '4e732ced3463d06de0ca9a15b6153677', 'ACC1027', '2424 Gold Street', 'IFSC0027', 'Starry Branch', 800, '7777888899', 'yara.gold@example.com', 91000.00, 'Business Loan', 7.6, 'Pending'),
('Zane Black', 'zane28', '02e74f10e0327ad868d138f2b4fdd6f0', 'ACC1028', '2525 Black Street', 'IFSC0028', 'Shadow Branch', 730, '8888999900', 'zane.black@example.com', 58000.00, 'Car Loan', 5.8, 'Approved'),
('Amy Purple', 'amy29', '98f13708210194c475687be6106a3b84', 'ACC1029', '2626 Purple Street', 'IFSC0029', 'Rainy Branch', 670, '9999000011', 'amy.purple@example.com', 32000.00, 'Personal Loan', 7.1, 'Rejected'),
('Brian Cyan', 'brian30', '3f79bb7b435b05321651daefd374cd21', 'ACC1030', '2727 Cyan Street', 'IFSC0030', 'Oceanic Branch', 740, '0000111122', 'brian.cyan@example.com', 64000.00, 'Home Loan', 6.3, 'Approved');

