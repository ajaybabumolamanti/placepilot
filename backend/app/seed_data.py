import datetime
from sqlalchemy.orm import Session
from app.models import (
    User, Department, Company, Round, Question, Attempt, 
    InterviewSession, Resume, CodingSubmission, GuidanceVideo,
    Job, JobApplication, Notification, ResumeProfile, AssessmentSession, CareerPlan
)

def seed_database(db: Session):
    # Check if database is already seeded
    first_dept = db.query(Department).first()
    if not first_dept:
        # 1. Departments
        depts = [
            Department(code="CSE", name="Computer Science & Engineering", description="Full suite for Software Engineering, DSA, Web Dev & Systems", icon="code"),
            Department(code="ECE", name="Electronics & Communication Engineering", description="Digital Electronics, Embedded Systems, Signals & Comm", icon="cpu"),
            Department(code="EEE", name="Electrical & Electronics Engineering", description="Power Systems, Electrical Machines, Circuits & Control", icon="zap"),
            Department(code="BIOTECH", name="Biotechnology Engineering", description="Biochemistry, Bioprocess Tech, Molecular Biology & Lab Concepts", icon="dna")
        ]
        db.add_all(depts)
        db.commit()

    # 2. Companies
    if not db.query(Company).first():
        companies = [
            # Service
            Company(
                name="TCS", category="SERVICE", logo="/logos/tcs.png",
                description="Tata Consultancy Services - Global IT services and consulting leader.",
                eligible_departments=["CSE", "ECE", "EEE", "BIOTECH"],
                round_count=4, difficulty="Moderate",
                topics=["NQT Aptitude", "C/Python Coding", "Technical Interview", "HR Round"],
                package_range="3.6 - 7.0 LPA",
                min_cgpa=6.0, max_backlogs=1,
                required_skills=["Python", "SQL", "Communication"],
                location="Pan India", website="https://www.tcs.com/careers"
            ),
            Company(
                name="Infosys", category="SERVICE", logo="/logos/infosys.png",
                description="Infosys - Digital services and next-generation consulting.",
                eligible_departments=["CSE", "ECE", "EEE", "BIOTECH"],
                round_count=4, difficulty="Moderate",
                topics=["Quantitative & Logical", "Pseudocode", "DBMS & OOP", "HR Round"],
                package_range="3.6 - 9.5 LPA",
                min_cgpa=6.5, max_backlogs=0,
                required_skills=["Data Structures", "Java", "SQL"],
                location="Bangalore / Pune / Hyderabad", website="https://www.infosys.com/careers"
            ),
            Company(
                name="Wipro", category="SERVICE", logo="/logos/wipro.png",
                description="Wipro - Information technology, consulting and business process services.",
                eligible_departments=["CSE", "ECE", "EEE"],
                round_count=3, difficulty="Moderate",
                topics=["Quantitative", "Verbal", "Basic Coding", "Tech HR"],
                package_range="3.5 - 6.5 LPA",
                min_cgpa=6.0, max_backlogs=1,
                required_skills=["C++", "Python", "Problem Solving"],
                location="Bangalore / Chennai", website="https://careers.wipro.com"
            ),
            Company(
                name="Cognizant", category="SERVICE", logo="/logos/cognizant.png",
                description="GenC & GenC Elevate placement tracks.",
                eligible_departments=["CSE", "ECE", "EEE", "BIOTECH"],
                round_count=4, difficulty="Moderate",
                topics=["Aptitude", "GenC Coding", "Cloud & Web Tech", "HR Round"],
                package_range="4.0 - 6.7 LPA",
                min_cgpa=6.0, max_backlogs=0,
                required_skills=["SQL", "Web Development", "Java"],
                location="Chennai / Hyderabad", website="https://careers.cognizant.com"
            ),

            # Product
            Company(
                name="Zoho", category="PRODUCT", logo="/logos/zoho.png",
                description="Zoho Corporation - Software product company creating suite of business applications.",
                eligible_departments=["CSE", "ECE"],
                round_count=5, difficulty="High",
                topics=["Complex Aptitude", "Advanced C/Java Coding", "System Design", "HR"],
                package_range="6.0 - 12.0 LPA",
                min_cgpa=7.0, max_backlogs=0,
                required_skills=["Data Structures", "Algorithms", "C++", "Java", "System Design"],
                location="Chennai / Tenkasi", website="https://www.zoho.com/careers"
            ),
            Company(
                name="Freshworks", category="PRODUCT", logo="/logos/freshworks.png",
                description="Freshworks - Customer engagement software suite.",
                eligible_departments=["CSE", "ECE"],
                round_count=4, difficulty="High",
                topics=["DSA & Algorithms", "Object-Oriented Design", "Live Coding", "Culture Fit"],
                package_range="8.0 - 15.0 LPA",
                min_cgpa=7.5, max_backlogs=0,
                required_skills=["React", "Node.js", "Python", "Data Structures"],
                location="Bangalore / Chennai", website="https://www.freshworks.com/company/careers"
            ),

            # Core
            Company(
                name="Bosch", category="CORE", logo="/logos/bosch.png",
                description="Bosch Engineering & Mobility Solutions.",
                eligible_departments=["ECE", "EEE", "CSE"],
                round_count=4, difficulty="High",
                topics=["Core Electronics", "Microcontrollers", "Control Systems", "Technical HR"],
                package_range="6.0 - 10.0 LPA",
                min_cgpa=7.0, max_backlogs=0,
                required_skills=["Embedded C", "Microcontrollers", "Digital Electronics"],
                location="Bangalore / Coimbatore", website="https://www.bosch.in/careers"
            ),
            Company(
                name="L&T", category="CORE", logo="/logos/lnt.png",
                description="Larsen & Toubro Core Engineering conglomerate.",
                eligible_departments=["EEE", "ECE"],
                round_count=3, difficulty="Moderate",
                topics=["Electrical Machines", "Power Systems", "Circuit Analysis", "Managerial HR"],
                package_range="5.5 - 8.5 LPA",
                min_cgpa=6.8, max_backlogs=0,
                required_skills=["Power Systems", "Circuit Analysis", "Electrical Machines"],
                location="Mumbai / Chennai", website="https://www.larsentoubro.com/corporate/careers"
            ),
            Company(
                name="Siemens", category="CORE", logo="/logos/siemens.png",
                description="Siemens Technology and Automation Systems.",
                eligible_departments=["ECE", "EEE", "CSE", "BIOTECH"],
                round_count=4, difficulty="High",
                topics=["Automation", "Embedded C", "Signal Processing", "Panel HR"],
                package_range="6.5 - 11.0 LPA",
                min_cgpa=7.0, max_backlogs=0,
                required_skills=["Automation", "PLC", "Python", "Embedded Systems"],
                location="Bangalore / Pune", website="https://jobs.siemens.com"
            )
        ]
        db.add_all(companies)
        db.commit()

    # 3. Default Users (Student, Recruiter, Admin)
    student = db.query(User).filter(User.email == "demo@placementpilot.ai").first()
    if not student:
        student = User(
            email="demo@placementpilot.ai",
            name="Demo Student",
            password_hash="password123",
            role="STUDENT",
            department_code="CSE",
            cgpa=8.2,
            backlogs=0,
            tenth_pct=92.0,
            twelfth_pct=88.5,
            phone="+91 98765 43210",
            bio="Aspiring Software Engineer passionate about full-stack web architectures, distributed systems, and modern AI.",
            skills=["Python", "JavaScript", "React", "Next.js", "SQL", "FastAPI", "Data Structures", "Git"],
            is_placed=False
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    recruiter = db.query(User).filter(User.email == "recruiter@tcs.com").first()
    if not recruiter:
        recruiter = User(
            email="recruiter@tcs.com",
            name="Sarah Jenkins",
            password_hash="password123",
            role="RECRUITER",
            department_code="CSE",
            company_name="TCS",
            phone="+91 91234 56789"
        )
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)

    admin = db.query(User).filter(User.email == "admin@placementpilot.ai").first()
    if not admin:
        admin = User(
            email="admin@placementpilot.ai",
            name="Dr. K. Sharma (Placement Dean)",
            password_hash="password123",
            role="ADMIN",
            department_code="CSE"
        )
        db.add(admin)
        db.commit()

    # 4. Jobs & Opportunities
    if not db.query(Job).first():
        tcs = db.query(Company).filter(Company.name == "TCS").first()
        zoho = db.query(Company).filter(Company.name == "Zoho").first()
        freshworks = db.query(Company).filter(Company.name == "Freshworks").first()
        bosch = db.query(Company).filter(Company.name == "Bosch").first()
        infosys = db.query(Company).filter(Company.name == "Infosys").first()
        siemens = db.query(Company).filter(Company.name == "Siemens").first()

        jobs = [
            Job(
                company_id=tcs.id if tcs else 1,
                recruiter_id=recruiter.id if recruiter else 2,
                title="Graduate Software Engineer (TCS Digital Track)",
                role_type="Full-Time",
                department_eligibility=["CSE", "ECE", "EEE"],
                min_cgpa=7.0, max_backlogs=0,
                required_skills=["Python", "SQL", "Data Structures", "Git"],
                salary_package="7.5 - 9.0 LPA",
                location="Bangalore / Hyderabad / Pune",
                description="TCS Digital hiring track seeking talented graduate engineers with strong analytical thinking, data structures foundations, and hands-on coding proficiency in Python or Java.",
                openings=25, deadline="2026-11-30", status="OPEN"
            ),
            Job(
                company_id=zoho.id if zoho else 2,
                recruiter_id=recruiter.id if recruiter else 2,
                title="Product Development Engineer (Full Stack)",
                role_type="Full-Time",
                department_eligibility=["CSE", "ECE"],
                min_cgpa=7.2, max_backlogs=0,
                required_skills=["Data Structures", "Algorithms", "C++", "Java", "SQL"],
                salary_package="8.5 - 12.0 LPA",
                location="Chennai / Tenkasi",
                description="Join Zoho's core engineering teams to architect scalable SaaS platforms serving over 100 million global users. Focus on clean code, multithreading, and algorithmic efficiency.",
                openings=12, deadline="2026-12-15", status="OPEN"
            ),
            Job(
                company_id=freshworks.id if freshworks else 3,
                recruiter_id=recruiter.id if recruiter else 2,
                title="Frontend Engineering Intern (React / Next.js)",
                role_type="Internship",
                department_eligibility=["CSE", "ECE"],
                min_cgpa=7.5, max_backlogs=0,
                required_skills=["React", "JavaScript", "TypeScript", "Tailwind CSS"],
                salary_package="35,000 / month (Stipend)",
                location="Bangalore (Hybrid)",
                description="6-month pre-placement internship opportunity. Build interactive, accessible web interfaces and micro-frontends with React, TypeScript, and modern design systems.",
                openings=8, deadline="2026-11-20", status="OPEN"
            ),
            Job(
                company_id=bosch.id if bosch else 4,
                recruiter_id=recruiter.id if recruiter else 2,
                title="Embedded Software Engineer (Automotive)",
                role_type="Full-Time",
                department_eligibility=["ECE", "EEE", "CSE"],
                min_cgpa=7.0, max_backlogs=0,
                required_skills=["Embedded C", "Microcontrollers", "RTOS", "CAN"],
                salary_package="6.5 - 9.5 LPA",
                location="Bangalore / Coimbatore",
                description="Develop real-time embedded software for electric mobility and connected vehicle architectures. Hands-on experience with microcontrollers and communication protocols.",
                openings=10, deadline="2026-12-10", status="OPEN"
            ),
            Job(
                company_id=infosys.id if infosys else 5,
                recruiter_id=recruiter.id if recruiter else 2,
                title="Specialist Programmer (Power Programmer)",
                role_type="Full-Time",
                department_eligibility=["CSE", "ECE", "EEE", "BIOTECH"],
                min_cgpa=6.8, max_backlogs=0,
                required_skills=["Python", "Java", "Data Structures", "Algorithms"],
                salary_package="9.5 LPA",
                location="Bangalore / Mysore / Hyderabad",
                description="High-tier programming track focusing on advanced algorithmic problem solving, cloud architecture, and competitive coding benchmarks.",
                openings=15, deadline="2026-11-25", status="OPEN"
            ),
            Job(
                company_id=siemens.id if siemens else 6,
                recruiter_id=recruiter.id if recruiter else 2,
                title="Industrial Automation Intern",
                role_type="Internship",
                department_eligibility=["ECE", "EEE", "BIOTECH"],
                min_cgpa=6.8, max_backlogs=1,
                required_skills=["Python", "Automation", "Digital Electronics"],
                salary_package="28,000 / month (Stipend)",
                location="Bangalore",
                description="Hands-on internship working on IoT telemetry, industrial control systems, and automated test rigs for energy systems.",
                openings=6, deadline="2026-12-05", status="OPEN"
            )
        ]
        db.add_all(jobs)
        db.commit()

    # 5. Student Applications & Notifications
    if not db.query(JobApplication).first():
        all_jobs = db.query(Job).all()
        if all_jobs and student:
            app1 = JobApplication(
                job_id=all_jobs[0].id,
                user_id=student.id,
                status="Interview Scheduled",
                match_percentage=92.0,
                applied_at=datetime.datetime.utcnow() - datetime.timedelta(days=7),
                interview_date="Tomorrow at 10:30 AM",
                interview_mode="Online Google Meet (Panel: Technical & HR)",
                recruiter_notes="Candidate has high aptitude score and solid React/FastAPI portfolio. Cleared Round 1."
            )
            app2 = JobApplication(
                job_id=all_jobs[1].id,
                user_id=student.id,
                status="Shortlisted",
                match_percentage=88.5,
                applied_at=datetime.datetime.utcnow() - datetime.timedelta(days=5),
                recruiter_notes="Profile shortlisted for Technical Assessment Round."
            )
            app3 = JobApplication(
                job_id=all_jobs[2].id,
                user_id=student.id,
                status="Under Review",
                match_percentage=94.0,
                applied_at=datetime.datetime.utcnow() - datetime.timedelta(days=2),
                recruiter_notes="Resume reviewed by hiring team."
            )
            db.add_all([app1, app2, app3])

            # Seed in-app notifications
            notifs = [
                Notification(
                    user_id=student.id,
                    title="Interview Scheduled with TCS",
                    message="Your Technical Interview round for 'Graduate Software Engineer' is scheduled for Tomorrow at 10:30 AM via Google Meet.",
                    type="INTERVIEW_INVITE",
                    link="/applications",
                    is_read=False
                ),
                Notification(
                    user_id=student.id,
                    title="Application Shortlisted at Zoho",
                    message="Congratulations! Your application for 'Product Development Engineer' has been shortlisted for technical screening.",
                    type="APPLICATION_STATUS",
                    link="/applications",
                    is_read=False
                ),
                Notification(
                    user_id=student.id,
                    title="Placement Eligibility Alert",
                    message="You are eligible for 8 out of 9 campus hiring drives! Keep maintaining your 8.2 CGPA.",
                    type="ELIGIBILITY",
                    link="/eligibility",
                    is_read=True
                )
            ]
            db.add_all(notifs)
            db.commit()

    # 6. Questions (Aptitude, Technical, Coding, HR)
    if not db.query(Question).first():
        questions = [
            # Aptitude - Quantitative
            Question(
                category="APTITUDE", department_code="ALL", topic="Quantitative Aptitude",
                title="Speed, Distance & Time",
                prompt="A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
                options=["120 m", "150 m", "180 m", "324 m"],
                correct_answer="150 m",
                explanation="Speed = 60 * (5/18) m/sec = 50/3 m/sec. Length = Speed * Time = (50/3) * 9 = 150 meters.",
                difficulty="Easy"
            ),
            Question(
                category="APTITUDE", department_code="ALL", topic="Quantitative Aptitude",
                title="Time & Work Efficiency",
                prompt="A can finish a work in 18 days and B can do the same work in 15 days. B worked for 10 days and left the job. In how many days, A alone can finish the remaining work?",
                options=["5 days", "6 days", "8 days", "10 days"],
                correct_answer="6 days",
                explanation="B's 10 day work = 10/15 = 2/3. Remaining work = 1 - 2/3 = 1/3. A completes work in 18 days, so 1/3 work = 18 * (1/3) = 6 days.",
                difficulty="Medium"
            ),
            Question(
                category="APTITUDE", department_code="ALL", topic="Quantitative Aptitude",
                title="Profit and Loss Margin",
                prompt="A person incurs 5% loss by selling a watch for Rs. 1140. At what price should the watch be sold to earn 5% profit?",
                options=["Rs. 1200", "Rs. 1230", "Rs. 1260", "Rs. 1300"],
                correct_answer="Rs. 1260",
                explanation="CP = 1140 / 0.95 = Rs. 1200. SP for 5% profit = 1200 * 1.05 = Rs. 1260.",
                difficulty="Medium"
            ),

            # Aptitude - Logical
            Question(
                category="APTITUDE", department_code="ALL", topic="Logical Reasoning",
                title="Blood Relations",
                prompt="Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
                options=["His own", "His son's", "His father's", "His nephew's"],
                correct_answer="His son's",
                explanation="Since the speaker has no brother or sister, 'my father's son' means the speaker himself. So 'that man's father is myself' -> the photo is of his son.",
                difficulty="Medium"
            ),
            Question(
                category="APTITUDE", department_code="ALL", topic="Logical Reasoning",
                title="Number Series Pattern",
                prompt="Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
                options=["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
                correct_answer="(1/8)",
                explanation="This is a simple division series; each number is one-half of the previous number: (1/4) / 2 = 1/8.",
                difficulty="Easy"
            ),

            # Aptitude - Verbal
            Question(
                category="APTITUDE", department_code="ALL", topic="Verbal Ability",
                title="Synonyms & Context",
                prompt="Choose the word that is most nearly SIMILAR in meaning to 'METICULOUS'.",
                options=["Careless", "Painstaking", "Rapid", "Negligent"],
                correct_answer="Painstaking",
                explanation="'Meticulous' means showing great attention to detail or carefulness, which matches 'Painstaking'.",
                difficulty="Easy"
            ),
            Question(
                category="APTITUDE", department_code="ALL", topic="Verbal Ability",
                title="Sentence Correction",
                prompt="Identify the grammatically correct sentence:",
                options=[
                    "Neither the manager nor the employees was present.",
                    "Neither the manager nor the employees were present.",
                    "Neither the manager or the employees were present.",
                    "Neither the manager nor the employees is present."
                ],
                correct_answer="Neither the manager nor the employees were present.",
                explanation="With 'neither... nor', the verb agrees with the subject closest to it. 'employees' is plural, so 'were' is correct.",
                difficulty="Medium"
            ),

            # Technical CSE
            Question(
                category="TECHNICAL", department_code="CSE", topic="DBMS",
                title="SQL Join Types",
                prompt="Which SQL clause returns all records when there is a match in either left or right table records?",
                options=["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"],
                correct_answer="FULL OUTER JOIN",
                explanation="FULL OUTER JOIN combines the results of both LEFT and RIGHT joins.",
                difficulty="Easy"
            ),
            Question(
                category="TECHNICAL", department_code="CSE", topic="Operating Systems",
                title="Virtual Memory & Page Faults",
                prompt="What occurs when a program attempts to access a block of memory that is not currently mapped in RAM?",
                options=["Segmentation Fault", "Page Fault", "Deadlock", "Cache Miss"],
                correct_answer="Page Fault",
                explanation="A Page Fault is an interrupt raised by hardware when a page table entry is invalid or not in main memory.",
                difficulty="Medium"
            ),
            Question(
                category="TECHNICAL", department_code="CSE", topic="Data Structures",
                title="Tree Traversal Order",
                prompt="Which tree traversal visits the root node AFTER visiting both its left and right subtrees?",
                options=["Pre-order", "In-order", "Post-order", "Level-order"],
                correct_answer="Post-order",
                explanation="Post-order traversal follows: Left -> Right -> Root.",
                difficulty="Easy"
            ),

            # Technical ECE / EEE
            Question(
                category="TECHNICAL", department_code="ECE", topic="Digital Electronics",
                title="Logic Gates & Boolean Algebra",
                prompt="Which logic gate outputs HIGH (1) only when all of its inputs are LOW (0)?",
                options=["AND", "NAND", "NOR", "XOR"],
                correct_answer="NOR",
                explanation="NOR gate is the negation of OR. It outputs 1 only when inputs are 0 and 0.",
                difficulty="Easy"
            ),
            Question(
                category="TECHNICAL", department_code="EEE", topic="Electrical Machines",
                title="Transformer Core Loss",
                prompt="Lamination of a transformer core is done primarily to reduce which type of loss?",
                options=["Copper Loss", "Eddy Current Loss", "Hysteresis Loss", "Friction Loss"],
                correct_answer="Eddy Current Loss",
                explanation="Laminations increase core resistance to circulating currents, significantly reducing Eddy Current losses.",
                difficulty="Easy"
            ),

            # Coding Challenges
            Question(
                category="CODING", department_code="CSE", topic="Arrays & Hashing",
                title="Two Sum Problem",
                prompt="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
                difficulty="Easy",
                code_starter={
                    "python": "def two_sum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\nif __name__ == '__main__':\n    import sys\n    lines = sys.stdin.read().split()\n    if lines:\n        target = int(lines[0])\n        nums = [int(x) for x in lines[1:]]\n        print(two_sum(nums, target))",
                    "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    cout << \"[0, 1]\" << endl;\n    return 0;\n}",
                    "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"[0, 1]\");\n    }\n}"
                },
                test_cases=[
                    {"input": "9 2 7 11 15", "expected": "[0, 1]"},
                    {"input": "6 3 2 4", "expected": "[1, 2]"}
                ]
            ),
            Question(
                category="CODING", department_code="CSE", topic="Strings & Algorithms",
                title="Valid Palindrome",
                prompt="Determine whether a string is a palindrome, considering only alphanumeric characters and ignoring cases.",
                difficulty="Easy",
                code_starter={
                    "python": "def is_palindrome(s: str) -> bool:\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]\n\nimport sys\ninp = sys.stdin.read().strip()\nprint(is_palindrome(inp))",
                    "cpp": "#include <iostream>\nusing namespace std;\nint main() { cout << \"True\"; }",
                    "java": "public class Main { public static void main(String[] args) { System.out.println(\"True\"); } }"
                },
                test_cases=[
                    {"input": "A man, a plan, a canal: Panama", "expected": "True"},
                    {"input": "race a car", "expected": "False"}
                ]
            ),

            # HR STAR Behavioral
            Question(
                category="HR", department_code="ALL", topic="Behavioral HR",
                title="Tell Me About Yourself",
                prompt="Introduce yourself, your academic background, key projects, and why you are interested in joining our company.",
                difficulty="Easy"
            ),
            Question(
                category="HR", department_code="ALL", topic="Behavioral HR",
                title="Overcoming a Technical Challenge",
                prompt="Describe a situation where a project or code failed close to deadline. What action did you take using the STAR framework?",
                difficulty="Medium"
            )
        ]
        db.add_all(questions)
        db.commit()

    # 7. Seed Sample Resume Profile
    if not db.query(ResumeProfile).first() and student:
        profile = ResumeProfile(
            user_id=student.id,
            title="Full Stack Software Engineer Resume",
            template_name="modern",
            personal_info={
                "fullName": "Ajay Babu",
                "email": "ajaybabumolamanti13@gmail.com",
                "phone": "+91 98765 43210",
                "location": "Hyderabad, India",
                "linkedin": "https://linkedin.com/in/ajaybabu",
                "github": "https://github.com/ajaybabumolamanti13-cyber",
                "portfolio": "https://placementpilot.ai"
            },
            summary="Driven Software Engineering student with high-impact project experience in React, Next.js, FastAPI, and scalable system design. Skilled at translating complex algorithmic challenges into responsive, production-ready web platforms with 95%+ test coverage.",
            education=[
                {"institution": "National Institute of Technology", "degree": "B.Tech", "field": "Computer Science & Engineering", "year": "2023 - 2027", "score": "8.4 CGPA"},
                {"institution": "City Model Junior College", "degree": "Class XII (State Board)", "field": "MPC", "year": "2021 - 2023", "score": "92.4%"}
            ],
            experience=[
                {"company": "NexGen Innovations", "role": "Full-Stack Web Intern", "duration": "May 2025 - Jul 2025", "location": "Remote", "points": [
                    "Engineered RESTful microservices in FastAPI reducing query latency by 40% using Redis caching.",
                    "Designed dynamic analytics dashboard in Next.js & Tailwind CSS consumed by 2,000+ daily active users."
                ]}
            ],
            projects=[
                {"title": "PlacementPilot AI Platform", "tech": "Next.js, FastAPI, Monaco Editor, Recharts", "link": "https://github.com/ajaybabumolamanti13-cyber/placepilot", "points": [
                    "Architected unified placement readiness portal with AI Mock Interviews, ATS Resume Builder, and automated code runner.",
                    "Integrated client-side audio/video processing and algorithmic company eligibility tracker."
                ]},
                {"title": "Distributed Task Queue & Cache", "tech": "Python, Redis, Docker, PostgreSQL", "link": "https://github.com/ajaybabumolamanti13-cyber", "points": [
                    "Implemented resilient asynchronous background job processing engine handling 500+ tasks/sec."
                ]}
            ],
            skills={
                "technical": ["Python", "JavaScript", "TypeScript", "React", "Next.js", "FastAPI", "PostgreSQL", "SQL", "Docker", "Git"],
                "soft": ["Problem Solving", "Agile Collaboration", "Technical Writing", "Critical Thinking"],
                "tools": ["VS Code", "Postman", "Monaco Editor", "Figma", "Linux/Bash"]
            },
            certifications=[
                {"name": "AWS Certified Cloud Practitioner", "issuer": "Amazon Web Services", "year": "2025"},
                {"name": "Meta Front-End Developer Specialization", "issuer": "Meta / Coursera", "year": "2024"}
            ],
            ats_score=89.5
        )
        db.add(profile)
        db.commit()

    # 8. Guidance Videos
    if not db.query(GuidanceVideo).first():
        videos = [
            GuidanceVideo(title="Mastering the STAR Framework for HR Interviews", category="STAR Framework", duration="6:45", url="https://youtube.com", recommended_for_weakness="STAR Framework Result Quantify Gap"),
            GuidanceVideo(title="How to Eliminate Filler Words (Um, Uh, Basically)", category="Communication", duration="5:20", url="https://youtube.com", recommended_for_weakness="High Filler Word Usage"),
            GuidanceVideo(title="Webcam Eye Contact & Body Language Masterclass", category="Body Language", duration="4:15", url="https://youtube.com", recommended_for_weakness="Camera-Directed Gaze Deviation"),
            GuidanceVideo(title="Top 20 DBMS Join & Indexing Questions Explained", category="Technical Prep", duration="12:30", url="https://youtube.com", recommended_for_weakness="DBMS")
        ]
        db.add_all(videos)
        db.commit()
