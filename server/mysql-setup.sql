-- Create the cooks table for kitchen registration data
CREATE TABLE IF NOT EXISTS cooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    kitchen_name VARCHAR(200) NOT NULL,
    kitchen_type VARCHAR(50) NOT NULL,
    cuisine_types JSON NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    fssai_license VARCHAR(100),
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    experience VARCHAR(50) NOT NULL,
    specialties JSON,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_cooks_email ON cooks(email);
CREATE INDEX idx_cooks_phone ON cooks(phone);
CREATE INDEX idx_cooks_status ON cooks(status);
CREATE INDEX idx_cooks_city ON cooks(city);
CREATE INDEX idx_cooks_created_at ON cooks(created_at);