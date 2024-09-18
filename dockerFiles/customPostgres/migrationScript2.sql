CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    salt VARCHAR(64) NOT NULL
);

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    contact_name TEXT UNIQUE NOT NULL,
    link_name TEXT NOT NULL,
    image_name TEXT NOT NULL
);

INSERT INTO contacts (contact_name, link_name, image_name)
VALUES
    ('GitHub: JackKammerer', 'https://github.com/JackKammerer', '/images/GitHubLogo.svg'),
    ('GitHub: kammererer12', 'https://github.com/kammererer12', '/images/GitHubLogo.svg'),
    ('LinkedIn: Jack Kammerer', 'https://www.linkedin.com/in/jack-kammerer', '/images/LinkedInLogo.webp'),
    ('Gmail: jackkammerer16@gmail.com', 'mailto:jackkammerer16@gmail.com', '/images/GmailLogo.webp'),
    ('Twitter: @jackkammerer2', 'https://twitter.com/jackkammerer2', '/images/TwitterLogo.webp');


DROP TABLE IF EXISTS projectData; 
CREATE TABLE projectData (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    project_name TEXT NOT NULL,
    project_description TEXT NOT NULL,
    github_repo TEXT,
    image_link TEXT NOT NULL,
    tools_used TEXT ARRAY NOT NULL
);

INSERT INTO projectData (project_name, project_description, github_repo, image_link, tools_used)
VALUES
    (
        'Graph.com', 
        'This is a basic graphing application that is served on the web. It is written in basic HTML, CSS, and vanilla Javascript. Handlebars is used for templating and Express.js is used for routing and middleware functions. This app was written in a team of three others to develop the project in a group environment with consistent communication and a smooth process flow. This application allows a user to create scatter plots, line graphs, pie charts, and bar graphs. These graphs can be saved to a public page where users can like, search, and sort others graphs. Finally, users are able to create variations and their own versions of other people''s graphs.', 
        'https://github.com/osu-cs290-f22/final-project-graph-builder',
        '/images/GraphcomImage.webp',
        '{
        "HTML", "CSS", "Javascript", "NodeJS", "Express.js", "Handlebars", "JSON"
        }'
    ),
    (
        'Quizzler',
        'This is a basic quiz-creation and practice site. This was based on other apps such as Quizlet. This was written as a part of a three day long hackathon, which was written and developed in a team of three. This was written in HTML, CSS, and Vanilla Javascript, with Express.js used for routing and middleware functionality. Quizzes could be created, deleted, edited, and used to generate quizzes. Quizzes are tested using the OpenAI API, to test the ability of any definition, no matter its wording, to define a term.',
        'https://github.com/JackKammerer/HackathonProjectSpring',
        '/images/QuizzlerImage.webp',
        '{
        "HTML", "CSS", "Javascript", "NodeJS", "Express.js", "OpenAI API"
        }'
    ),
    (
        'MP3 Player',
        'This is an MP3 Player Application. It was written in C++ and utilized the Qt Framework to create a GUI. This application allows users to create an playlist containing MP3 files. A user can add songs to a playlist, remove songs from a playlist, and edit the order of songs in a playlist. Playlists can be imported, exported, and rewritten. Additionally, the user has the ability to sort through playlists based on the name of a song, the name of the album the song is contained in, or the name of the artist that performed the song. The user can skip, rewind, play, and pause songs, as well as randomize the order of songs and apply equalizer settings to a song which can be later saved. This project was created in a team of six over the course of seven weeks using Scrum and other Agile methodologies.',
        'https://github.com/OctoBrownie/SEProject',
        '/images/MP3PlayerImage.webp',
        '{
        "C++", "QT Framework", "FFMPEG", "Simple DirectMedia Layer", "TagLib Library"
        }'
    ),
    (
        'Home Server',
        'This is my own personal home server. This is a device with Ubuntu Server running. It has been setup to automatically update at regular intervals, and shutdown at certain times, through the use of cron. This server runs Docker, which, through the use of docker-compose, starts up several containers on startup. This server is responsible for running VaultWarden, an open source password manager, Nextcloud, an open source cloud-based storage application, Portainer, an application that provides a GUI for docker management, and Nginx Proxy Manager which is used for providing TLS/SSL certificates for all of the services, allowing secure https access to my services. These services have been personally setup and are actively maintained by myself. The server also hosts a Kali Linux Virtual Machine, which is managed by the Virsh Hypervisor. This virtual machine is used for writing code, performing tests, and experimenting with the cybersecurity tools provided by default in Kali Linux.',
        NULL,
        '/images/GitHubLogo.svg',
        '{
        "Docker and Docker Compose", "Virsh Hypervisor", "Ubuntu and Kali Linux", "Universal Firewall (ufw)", "Nginx Proxy Manager"
        }'
    ),
    (
        'Home Network Setup',
        'This is a brief description of my personal working network. I have setup PiHole to provide ad-blocking and to more easily resolve DNS queries using Unbound, which saves IP addresses associated with certain domains. PiHole also saves an IP table for DNS sub domain queries to properly resolve them and route them through the TLS proxy. A PiKVM is also a component of the network, which allows me to have remote access to my home server from any location. This device is also automated (through systemd timers) to automatically startup the homeserver at specific times. The final component of this network is a Tailscale VPN client, which is installed on several devices, and allows communication throughout the network through obstacles such as NAT. It allows PiHole to block ads and manage DNS no matter the location of a device. It also allows devices such as my homeserver and its services to be usuable remotely, even when hidden from the wider internet and other users.',
        NULL,
        '/images/GitHubLogo.svg',
        '{
        "PiHole", "Unbound", "PiKVM", "Tailscale VPN"
        }'
    );

DROP TABLE IF EXISTS schoolData;
CREATE TABLE schoolData (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    school_name TEXT NOT NULL,
    school_dates TEXT NOT NULL,
    degree TEXT NOT NULL,
    awards TEXT ARRAY NOT NULL
);

INSERT INTO schoolData (school_name, school_dates, degree, awards)
VALUES
    (
        'Clackamas Middle College',
        '< 09/2018 - 06/2022 >',
        'High School Diploma',
        '{
        "Graduated with a 4.0 GPA", 
        "Graduated as the valedictorian of my class.", 
        "Dual enrolled at Clackamas Community College and Clackamas Middle College where I earned college credits and gained experience with college-level coursework.", 
        "Graduated with 126 college credits from Clackamas Community College"
        }'
    ),
    (
        'Clackamas Community College',
        '< 04/2019 - 06/2022 >',
        'Associate of Arts Degree',
        '{
        "Graduated with a 4.0 GPA.", 
        "Graduated with an Associate of Arts (Oregon Transfer) Degree, Graduated with 126 college credits at the same time as my high school graduation"
        }'
    ),
    (
        'Oregon State University',
        '< 09/2022 - Present >',
        'Bachelor of Science (Computer Science) Degree',
        '{
        "Maintained a 4.0 GPA, Dean''s List Fall 2022-Fall 2023.", 
        "Technology Officer of the Oregon State University Chapter of the Google Student Developer Club", 
        "Member of the Oregon State Cybersecurity Club and the Oregon State ACM chapter"
        }'
    );

DROP TABLE IF EXISTS workData;
CREATE TABLE workData (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    dates TEXT NOT NULL,
    details TEXT ARRAY NOT NULL
);

INSERT INTO workData (position, company, dates, details)
VALUES
    (
        'Math Tutor', 'Clackamas Community College', '< 09/2021 - 06/2022 >', 
        '{
        "Worked with students in a wide variety of subjects including geometry, calculus, trigonometry, and statistics.", 
        "Aided students in remote and in-person environments.", 
        "Used and demonstrated resources including Desmos, Wolfram Alpha''s web interface, and other online information sources such as Google and Youtube.", 
        "Helped over 30 different students with solving and understanding mathematical ideas."
        }'
    ),
    (
        'Extended Reality Intern', 'Portland State University', '< 06/2021 - 08/2021 >',
        '{
        "This internship was the focus of a 3-month internship through the Saturday Academy''s ASE internship program.", 
        "Tested the lab material for CS 410/510 with Dr. Ehsan Aryafar and his graduate student Samuel Shippey.", 
        "Worked with Unity, C#, and Vuforia to create virtual reality and augmented reality applications.", 
        "Worked remotely, with meetings every two weeks to communicate progress.", 
        "Worked full time, eight hours a day, five days a week.", 
        "Created a virtual reality puzzle game to demonstrate the knowledge gained through the use of the labs."
        }'
    ),
    (
        'SOC Analyst', 'Oregon State University', '< 09/2022 - Present >',
        '{
        "Analyzed and responded to potential security flags.", 
        "Used the Microsoft Azure suite of tools, including Sentinel and Defender XDR.", 
        "Worked in a team environment with up to five other analysts when triaging alerts.", 
        "Created new automation tools to better identify suspicious behavior and close alerts.", 
        "Refined and updated old automation rules.", 
        "Examined phishing and spam emails for suspicious activity."
        }'
    );

DROP TABLE IF EXISTS arrayData;
CREATE TABLE arrayData (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    items TEXT ARRAY NOT NULL,
    label TEXT NOT NULL
); 

INSERT INTO arrayData (items, label)
VALUES
    (
        '{
        "C", "C++", 
        "HTML", "CSS", "Javascript", "Typescript", "Java", 
        "C#", "Python", "Rust", "x86 Assembly", "Microsoft Macro Assembly (MASM)", 
        "Bash Script", "SQL", "Kusto Query Language", "PHP", "QT Framework", 
        "React", "NodeJS", "Express.js", "Vite", "NextJS", "Ghidra", 
        "gdb", "gcc/g++", "Github", "Git", "Unity", "Docker"
        }',
        'toolList'
    ),
    (
        '{
        "Graduated high school with 126 college credits, an Associate of Arts Oregon Transfer Degree, and a 4.0 GPA", 
        "Acceptance into the MECOP internship program", 
        "Completion of the ASE internship program", 
        "Holds the position of the Oregon State University Google Student Developer Club Technical Officer", 
        "Awarded the North Clackamas Education Foundation Bridges to Success Scholarship", 
        "Accepted into the Oregon State University Honors College"
        }',
        'achievementList'
    ),
    (
        '{
        "/images/ClackamasMiddleCollege.webp", 
        "/images/ClackamasCommunityCollege.webp", 
        "/images/OregonStateUniversity.webp"
        }',
        'schoolImagesList'
    ),
    (
        '{
        "/images/MecopLogo.webp", 
        "/images/GDSCLogo.webp"
        }',
        'leftAchievementImageList'
    ),
    (
        '{
        "/images/ASELogo.webp", "/images/OregonStateHonorsCollegeLogo.webp"
        }',
        'rightAchievementImageList'
    );



GRANT SELECT, INSERT ON TABLE accounts TO external_connection;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contacts TO external_connection;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE projectData TO external_connection;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE schoolData TO external_connection;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE workData TO external_connection;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE arrayData TO external_connection;