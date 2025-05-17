-- Insert medical specialties
INSERT INTO specialties (name, description) VALUES
('Cardiology', 'Diagnosis and treatment of heart disorders and diseases'),
('Dermatology', 'Diagnosis and treatment of skin, hair, and nail conditions'),
('Neurology', 'Diagnosis and treatment of disorders of the nervous system'),
('Orthopedics', 'Diagnosis and treatment of musculoskeletal system disorders'),
('Pediatrics', 'Medical care of infants, children, and adolescents'),
('Psychiatry', 'Diagnosis and treatment of mental, emotional, and behavioral disorders'),
('Gynecology', 'Health care for women, especially the diagnosis and treatment of disorders affecting the female reproductive system'),
('Ophthalmology', 'Diagnosis and treatment of eye disorders and diseases'),
('ENT (Ear, Nose, and Throat)', 'Diagnosis and treatment of disorders of the ear, nose, throat, and related structures'),
('Gastroenterology', 'Diagnosis and treatment of disorders of the digestive system'),
('Endocrinology', 'Diagnosis and treatment of disorders of the endocrine system and hormones'),
('Rheumatology', 'Diagnosis and treatment of rheumatic diseases affecting joints, muscles, and bones'),
('Urology', 'Diagnosis and treatment of disorders of the urinary tract and male reproductive system'),
('Pulmonology', 'Diagnosis and treatment of disorders of the respiratory system'),
('Oncology', 'Diagnosis and treatment of cancer');

-- Insert doctors
INSERT INTO doctors (full_name, email, phone_number, bio, license_number, years_of_experience, user_id) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@healthcare.com', '555-0101', 'Experienced cardiologist with expertise in interventional procedures', 'MD123456', 15, 'user1'),
('Dr. Michael Chen', 'michael.chen@healthcare.com', '555-0102', 'Board-certified dermatologist specializing in cosmetic and medical dermatology', 'MD123457', 12, 'user2'),
('Dr. Emily Brown', 'emily.brown@healthcare.com', '555-0103', 'Neurologist with focus on movement disorders and epilepsy', 'MD123458', 10, 'user3'),
('Dr. James Wilson', 'james.wilson@healthcare.com', '555-0104', 'Orthopedic surgeon specializing in sports medicine and joint replacement', 'MD123459', 18, 'user4'),
('Dr. Lisa Patel', 'lisa.patel@healthcare.com', '555-0105', 'Pediatrician with expertise in developmental disorders', 'MD123460', 8, 'user5'),
('Dr. Robert Kim', 'robert.kim@healthcare.com', '555-0106', 'Psychiatrist specializing in mood disorders and psychotherapy', 'MD123461', 14, 'user6'),
('Dr. Maria Garcia', 'maria.garcia@healthcare.com', '555-0107', 'Gynecologist with focus on women''s reproductive health', 'MD123462', 11, 'user7'),
('Dr. David Lee', 'david.lee@healthcare.com', '555-0108', 'Ophthalmologist specializing in retinal diseases', 'MD123463', 16, 'user8'),
('Dr. Jennifer Taylor', 'jennifer.taylor@healthcare.com', '555-0109', 'ENT specialist with expertise in sinus surgery', 'MD123464', 9, 'user9'),
('Dr. Thomas Anderson', 'thomas.anderson@healthcare.com', '555-0110', 'Gastroenterologist focusing on digestive disorders', 'MD123465', 13, 'user10');

-- Insert doctor-specialty relationships
INSERT INTO doctor_specialties (doctor_id, specialty_id) VALUES
(1, 1), -- Dr. Sarah Johnson - Cardiology
(2, 2), -- Dr. Michael Chen - Dermatology
(3, 3), -- Dr. Emily Brown - Neurology
(4, 4), -- Dr. James Wilson - Orthopedics
(5, 5), -- Dr. Lisa Patel - Pediatrics
(6, 6), -- Dr. Robert Kim - Psychiatry
(7, 7), -- Dr. Maria Garcia - Gynecology
(8, 8), -- Dr. David Lee - Ophthalmology
(9, 9), -- Dr. Jennifer Taylor - ENT
(10, 10); -- Dr. Thomas Anderson - Gastroenterology 