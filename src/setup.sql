USE cse340;

-- 1. Eliminar tablas si ya existen (en orden inverso por las dependencias de las llaves foráneas)
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

-- 2. Crear la tabla organizations primero
CREATE TABLE organizations (
    organization_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT
);

-- 3. Insertar las organizaciones base (IDs 1, 2 y 3)
INSERT INTO organizations (organization_id, name, description) VALUES
(1, 'GreenEarth Initiative', 'Environmental conservation and community programs.'),
(2, 'EduBridge Foundation', 'Educational support and digital literacy workshops.'),
(3, 'Community Care Network', 'Food distribution, health clinics, and family support.');

-- 4. Crear la tabla categories
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 5. Insertar al menos 3 categorías relevantes
INSERT INTO categories (category_id, name) VALUES
(1, 'Environment & Sustainability'),
(2, 'Education & Technology'),
(3, 'Community Welfare & Health');

-- 6. Crear la tabla projects con la llave foránea
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    date DATE,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organizations(organization_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 7. Crear la tabla intermedia para la relación muchos a muchos (projects <-> categories)
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_pc_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. Insertar los proyectos de servicio (al menos 5 por organización)
INSERT INTO projects (organization_id, title, description, location, date) VALUES
-- GreenEarth Initiative (ID: 1)
(1, 'Community Tree Planting', 'Planting native trees along local park trails.', 'Central Park', '2026-04-12'),
(1, 'River Cleanup Drive', 'Removing plastic and debris from the riverbank.', 'River Valley', '2026-05-18'),
(1, 'Organic Gardening Workshop', 'Teaching locals how to set up sustainable backyard composts.', 'Community Center', '2026-06-05'),
(1, 'Eco-Awareness Seminar', 'Presenting recycling and conservation strategies to schools.', 'High School Auditorium', '2026-07-22'),
(1, 'Urban Bee Sanctuary Setup', 'Installing pollinator-friendly boxes and flora.', 'Botanical Gardens', '2026-08-14'),

-- EduBridge Foundation (ID: 2)
(2, 'After-School Math Tutoring', 'Providing free tutoring for middle school students.', 'Public Library', '2026-04-15'),
(2, 'Digital Literacy for Seniors', 'Teaching basic computer and smartphone skills to older adults.', 'Senior Center', '2026-05-10'),
(2, 'Book Drive & Distribution', 'Collecting and distributing textbooks to underfunded schools.', 'EduBridge HQ', '2026-06-01'),
(2, 'Coding Bootcamp for Teens', 'Introductory JavaScript and HTML workshop.', 'Tech Hub', '2026-07-10'),
(2, 'School Supply Giveaway', 'Handing out backpacks and notebooks ahead of the new term.', 'District School #4', '2026-08-25'),

-- Community Care Network (ID: 3)
(3, 'Food Bank Meal Pack', 'Assembling and distributing food boxes for low-income families.', 'Community Warehouse', '2026-04-20'),
(3, 'Mobile Health Clinic', 'Offering free blood pressure and basic health screenings.', 'Town Square', '2026-05-14'),
(3, 'Winter Blanket Drive', 'Collecting and distributing warm blankets to shelter residents.', 'Shelter Downtown', '2026-06-19'),
(3, 'Senior Companionship Day', 'Spending time and organizing games with nursing home residents.', 'Sunrise Care Home', '2026-07-08'),
(3, 'Emergency Relief Fundraiser', 'Charity bake sale and community dinner to support local families.', 'Community Hall', '2026-08-30');

-- 9. Asociar cada proyecto con su respectiva categoría
INSERT INTO project_categories (project_id, category_id) VALUES
-- GreenEarth Initiative Projects -> Categoría 1
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
-- EduBridge Foundation Projects -> Categoría 2
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
-- Community Care Network Projects -> Categoría 3
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3);
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
-- EduBridge Foundation Projects -> Categoría 2
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
-- Community Care Network Projects -> Categoría 3
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3);