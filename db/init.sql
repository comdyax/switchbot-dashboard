CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    mac VARCHAR(17) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS readings (
    id SERIAL PRIMARY KEY,
    device_mac VARCHAR(17) NOT NULL,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    battery INTEGER NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readings_device_mac ON readings(device_mac);
CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON readings(timestamp);