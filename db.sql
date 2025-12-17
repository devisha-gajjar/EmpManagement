employee mgmt system db

dotnet ef dbcontext scaffold "Name=ConnectionStrings:DefaultConnection" Npgsql.EntityFrameworkCore.PostgreSQL -o ../EmployeeAPI.Entities/Models --context EmployeeMgmtContext --context-dir ../EmployeeAPI.Entities/Data -f --namespace EmployeeAPI.Entities.Models --context-namespace EmployeeAPI.Entities.Data


ALTER TABLE public.users
    ADD COLUMN employment_start_date DATE,
    ADD COLUMN date_of_birth DATE,
    ADD COLUMN position VARCHAR(100);


CREATE TABLE IF NOT EXISTS public.attendance (
    attendance_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(user_id),
    clock_in TIMESTAMP NOT NULL,
    clock_out TIMESTAMP,
    date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Present', 'Absent', 'On Leave')) DEFAULT 'Present',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS public.leave_requests (
    leave_request_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(user_id),
    leave_type VARCHAR(50),  -- E.g., 'Sick', 'Vacation', etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Approved', 'Denied')) DEFAULT 'Pending',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS public.user_task(
    task_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(user_id),
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_by INTEGER REFERENCES public.users(user_id),
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(50) CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    status VARCHAR(50) CHECK (status IN ('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments
    ADD COLUMN manager_id INTEGER REFERENCES public.users(user_id);



CREATE TABLE IF NOT EXISTS public.employee_departments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(user_id),
    department_id INTEGER REFERENCES public.departments(id),
    start_date DATE NOT NULL,  -- The date the employee joined the department
    end_date DATE,  -- The date the employee left the department, if applicable
    current BOOLEAN DEFAULT TRUE  -- Whether the employee is currently in the department
);



CREATE TABLE IF NOT EXISTS public.performance_reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(user_id),
    reviewed_by INTEGER REFERENCES public.users(user_id),  -- Manager or admin
    review_date DATE NOT NULL,
    score INTEGER,  -- A score or rating (e.g., 1-5)
    comments TEXT,  -- Review comments
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Convert columns from DATE to TIMESTAMP

-- For the 'users' table:
ALTER TABLE public.users
    ALTER COLUMN employment_start_date TYPE TIMESTAMP USING employment_start_date::TIMESTAMP,
    ALTER COLUMN date_of_birth TYPE TIMESTAMP USING date_of_birth::TIMESTAMP;

-- For the 'attendance' table (if required):
ALTER TABLE public.attendance
    ALTER COLUMN date TYPE TIMESTAMP USING date::TIMESTAMP;

-- For the 'leave_requests' table:
ALTER TABLE public.leave_requests
    ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::TIMESTAMP,
    ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::TIMESTAMP;

ALTER TABLE "leave_requests"
ALTER COLUMN "CreatedOn" TYPE timestamp with time zone;

-- For the 'user_task' table:
ALTER TABLE public.user_task
    ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::TIMESTAMP,
    ALTER COLUMN due_date TYPE TIMESTAMP USING due_date::TIMESTAMP;

-- For the 'employee_departments' table:
ALTER TABLE public.employee_departments
    ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::TIMESTAMP,
    ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::TIMESTAMP;

-- For the 'performance_reviews' table:
ALTER TABLE public.performance_reviews
    ALTER COLUMN review_date TYPE TIMESTAMP USING review_date::TIMESTAMP;


ALTER TABLE public.user_task
    DROP CONSTRAINT tasks_status_check;

ALTER TABLE public.user_task
    ADD CONSTRAINT tasks_status_check CHECK (
        status IN (
            'Pending',
            'In Progress',
            'Dev Completed',
            'Ready for Testing',
            'Completed'
        )
    );


ALTER TABLE public.user_task
    ADD COLUMN estimated_hours numeric(5,2),
    ADD COLUMN spent_hours numeric(5,2) DEFAULT 0,
    ADD COLUMN completed_on timestamp,
    ADD COLUMN updated_on timestamp DEFAULT CURRENT_TIMESTAMP;


-- Table: projects
-- Purpose: stores top-level projects
CREATE TABLE IF NOT EXISTS public.projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES public.users(user_id),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: project_members
-- Purpose: users assigned to a project
CREATE TABLE IF NOT EXISTS public.project_members (
    project_member_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES public.projects(project_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id),
    role VARCHAR(50) DEFAULT 'Member',   -- Owner / Manager / Developer / QA
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: user_task
-- Purpose: main task table with status, hours, priority
CREATE TABLE IF NOT EXISTS public.user_task (
    task_id INTEGER NOT NULL DEFAULT nextval('tasks_task_id_seq'::regclass),
    project_id INTEGER REFERENCES public.projects(project_id),
    user_id INTEGER,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_by INTEGER,
    start_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Pending',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_hours NUMERIC(5,2),
    spent_hours NUMERIC(5,2) DEFAULT 0,
    completed_on TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tasks_pkey PRIMARY KEY (task_id),

    CONSTRAINT tasks_assigned_by_fkey FOREIGN KEY (assigned_by)
        REFERENCES public.users(user_id),

    CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users(user_id),

    CONSTRAINT tasks_priority_check CHECK (
        priority IN ('Low', 'Medium', 'High')
    ),

    CONSTRAINT tasks_status_check CHECK (
        status IN (
            'Pending',
            'In Progress',
            'Dev Completed',
            'Ready for Testing',
            'Completed'
        )
    )
);


-- Table: task_work_logs
-- Purpose: time spent by users on tasks
CREATE TABLE IF NOT EXISTS public.task_work_logs (
    work_log_id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES public.user_task(task_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id),

    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hours_spent NUMERIC(5,2) NOT NULL,
    description TEXT,

    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: task_comments
-- Purpose: comments/discussion on tasks
CREATE TABLE IF NOT EXISTS public.task_comments (
    comment_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES public.user_task(task_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES public.users(user_id),

    comment TEXT NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: task_attachments
-- Purpose: file attachments for tasks
CREATE TABLE IF NOT EXISTS public.task_attachments (
    attachment_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES public.user_task(task_id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES public.users(user_id),

    file_url TEXT NOT NULL,
    uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: task_tags
-- Purpose: master table of available tags
CREATE TABLE IF NOT EXISTS public.task_tags (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);


-- Table: task_tag_map
-- Purpose: many-to-many mapping between tasks and tags
CREATE TABLE IF NOT EXISTS public.task_tag_map (
    task_id INTEGER REFERENCES public.user_task(task_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES public.task_tags(tag_id) ON DELETE CASCADE,

    PRIMARY KEY (task_id, tag_id)
);


-- Table: task_activity_log
-- Purpose: history of task actions (status change, assignment, etc.)
CREATE TABLE IF NOT EXISTS public.task_activity_log (
    activity_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES public.user_task(task_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES public.users(user_id),

    action VARCHAR(255) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: subtasks
-- Purpose: smaller child tasks under a main task
CREATE TABLE IF NOT EXISTS public.subtasks (
    subtask_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES public.user_task(task_id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_task
    ADD COLUMN project_id integer REFERENCES public.projects(project_id);


ALTER TABLE public.projects
ADD COLUMN start_date TIMESTAMP;

ALTER TABLE public.projects
ADD COLUMN end_date TIMESTAMP;


ALTER TABLE public.project_members
    DROP COLUMN role;


-- role : 1 = project manager 2 = team leader 3 = develper 4 = tester 5 = designer
ALTER TABLE public.project_members
    ADD COLUMN role INTEGER NOT NULL DEFAULT 0;


-- Date : 15/12/2025
-- '1 = Pending, 2 = Planning, 3 = In Progress, 4 = Completed, 5 = On Hold'
ALTER TABLE public.projects
ADD COLUMN status INT;
