USE grafana_db;

CREATE TABLE metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(255),
    value FLOAT,
    timestamp DATETIME
);

INSERT INTO metrics (metric_name, value, timestamp) VALUES
('CPU Usage', 75.5, '2024-12-13 10:00:00'),
('Memory Usage', 60.2, '2024-12-13 10:00:00'),
('Disk Usage', 80.1, '2024-12-13 10:00:00');
