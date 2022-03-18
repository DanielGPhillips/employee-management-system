INSERT INTO department_table (department_name)
VALUES ("Accounting"),
        ("HR"),
        ("Engineering"),
        ("Service"),
        ("Sales");

INSERT INTO role_table (title, salary, department_id)
VALUES ("junior accountant", 73000, 1),
        ("senior accountant", 150000, 1),
        ("HR representative", 54000, 2),
        ("HR manager", 120000, 2),
        ("general manager", 220000, 2),
        ("junior engineer", 80000, 3),
        ("senior engineer", 160000, 3),
        ("service representative", 40000, 4),
        ("service department head", 150000, 4),
        ("junior sales rep", 60000, 5),
        ("senior sales rep", 140000, 5);

INSERT INTO employee_table (first_name, last_name, role_id, manager_id)
VALUES ("Alfred", "Bossman", 5, null),
        ("John", "Accounting", 2, 1),
        ("Jimmy", "Accounting", 1, 2),
        ("Karen", "Handler", 9, 1),
        ("Custo", "Merservice", 8, 4),
        ("Always", "Right", 8, 4),
        ("Nikola", "Tesla", 7, 1),
        ("Error", "Handling", 6, 7),
        ("Syn", "Tachs", 6, 7),
        ("Hugh", "Manh", 4, 1),
        ("Lay", "Ophs", 3, 10),
        ("Don", "Draper", 11, 1),
        ("Peggy", "Olson", 10, 12);