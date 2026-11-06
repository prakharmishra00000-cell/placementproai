// scripts/seed.ts - Comprehensive seed for PlacementPro AI
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

const hash = (pw: string) => createHash('sha256').update(pw + '__ppa_salt__').digest('hex');

// ---- Branch catalogue (28 disciplines) ----
const BRANCHES = [
  ['CSE', 'Computer Science Engineering', 'IT', 'Cpu'],
  ['IT', 'Information Technology', 'IT', 'Network'],
  ['ECE', 'Electronics and Communication Engineering', 'ENGINEERING', 'CircuitBoard'],
  ['EEE', 'Electrical and Electronics Engineering', 'ENGINEERING', 'Zap'],
  ['EE', 'Electrical Engineering', 'ENGINEERING', 'Plug'],
  ['ME', 'Mechanical Engineering', 'ENGINEERING', 'Cog'],
  ['CE', 'Civil Engineering', 'ENGINEERING', 'Building2'],
  ['CHE', 'Chemical Engineering', 'ENGINEERING', 'FlaskConical'],
  ['BT', 'Biotechnology', 'ENGINEERING', 'Dna'],
  ['BME', 'Biomedical Engineering', 'ENGINEERING', 'HeartPulse'],
  ['AE', 'Aerospace Engineering', 'ENGINEERING', 'Plane'],
  ['AT', 'Automobile Engineering', 'ENGINEERING', 'Car'],
  ['PE', 'Production Engineering', 'ENGINEERING', 'Factory'],
  ['IE', 'Industrial Engineering', 'ENGINEERING', 'BarChart3'],
  ['MTE', 'Metallurgical Engineering', 'ENGINEERING', 'Hammer'],
  ['MNE', 'Mining Engineering', 'ENGINEERING', 'Pickaxe'],
  ['AGE', 'Agricultural Engineering', 'ENGINEERING', 'Sprout'],
  ['PEE', 'Petroleum Engineering', 'ENGINEERING', 'Fuel'],
  ['ICE', 'Instrumentation and Control Engineering', 'ENGINEERING', 'Gauge'],
  ['MTR', 'Mechatronics Engineering', 'ENGINEERING', 'Bot'],
  ['RAE', 'Robotics and Automation Engineering', 'ENGINEERING', 'Bot'],
  ['ENV', 'Environmental Engineering', 'ENGINEERING', 'Leaf'],
  ['MRE', 'Marine Engineering', 'ENGINEERING', 'Ship'],
  ['FT', 'Food Technology', 'ENGINEERING', 'UtensilsCrossed'],
  ['TE', 'Textile Engineering', 'ENGINEERING', 'Shirt'],
  ['PEX', 'Polymer Engineering', 'ENGINEERING', 'Layers'],
  ['CER', 'Ceramic Engineering', 'ENGINEERING', 'Mug'],
  ['GE', 'Genetic Engineering', 'ENGINEERING', 'Dna'],
];

// ---- Subject catalogue per branch (representative subset) ----
// [code, name, semester, category]
const SUBJECTS_BY_BRANCH: Record<string, [string, string, number, string][]> = {
  CSE: [
    ['CS101', 'Programming in C', 1, 'CORE'],
    ['CS102', 'Data Structures', 2, 'CORE'],
    ['CS103', 'Object Oriented Programming', 2, 'CORE'],
    ['CS201', 'Algorithms', 3, 'CORE'],
    ['CS202', 'Operating Systems', 4, 'CORE'],
    ['CS203', 'Database Management Systems', 4, 'CORE'],
    ['CS301', 'Computer Networks', 5, 'CORE'],
    ['CS302', 'Theory of Computation', 5, 'CORE'],
    ['CS303', 'Software Engineering', 5, 'CORE'],
    ['CS401', 'Artificial Intelligence', 6, 'CORE'],
    ['CS402', 'Machine Learning', 6, 'ELECTIVE'],
    ['CS403', 'Compiler Design', 6, 'CORE'],
    ['CS501', 'Cloud Computing', 7, 'ELECTIVE'],
    ['CS502', 'Cybersecurity', 7, 'ELECTIVE'],
    ['CS503', 'Web Technologies', 7, 'CORE'],
  ],
  IT: [
    ['IT101', 'Programming Fundamentals', 1, 'CORE'],
    ['IT102', 'Data Structures', 2, 'CORE'],
    ['IT201', 'Algorithms', 3, 'CORE'],
    ['IT202', 'Database Management Systems', 3, 'CORE'],
    ['IT203', 'Computer Networks', 4, 'CORE'],
    ['IT301', 'Operating Systems', 5, 'CORE'],
    ['IT302', 'Web Development', 5, 'CORE'],
    ['IT303', 'Software Engineering', 5, 'CORE'],
    ['IT401', 'Cloud Computing', 6, 'ELECTIVE'],
    ['IT402', 'Information Security', 6, 'ELECTIVE'],
    ['IT403', 'Mobile Development', 6, 'CORE'],
  ],
  ECE: [
    ['EC101', 'Network Theory', 1, 'CORE'],
    ['EC102', 'Electronic Devices and Circuits', 2, 'CORE'],
    ['EC201', 'Digital Electronics', 3, 'CORE'],
    ['EC202', 'Signals and Systems', 3, 'CORE'],
    ['EC203', 'Analog Electronics', 3, 'CORE'],
    ['EC301', 'Communication Systems', 4, 'CORE'],
    ['EC302', 'Microprocessors', 4, 'CORE'],
    ['EC303', 'Control Systems', 4, 'CORE'],
    ['EC401', 'Digital Signal Processing', 5, 'CORE'],
    ['EC402', 'VLSI Design', 5, 'ELECTIVE'],
    ['EC403', 'Embedded Systems', 5, 'CORE'],
    ['EC501', 'Antennas', 6, 'ELECTIVE'],
    ['EC502', 'Wireless Communication', 6, 'ELECTIVE'],
  ],
  EEE: [
    ['EE101', 'Circuit Analysis', 1, 'CORE'],
    ['EE102', 'Electrical Machines', 2, 'CORE'],
    ['EE201', 'Transformers', 3, 'CORE'],
    ['EE202', 'Power Systems', 3, 'CORE'],
    ['EE203', 'Control Systems', 3, 'CORE'],
    ['EE301', 'Power Electronics', 4, 'CORE'],
    ['EE302', 'Electrical Measurements', 4, 'CORE'],
    ['EE401', 'Switchgear and Protection', 5, 'CORE'],
    ['EE402', 'Renewable Energy', 5, 'ELECTIVE'],
    ['EE403', 'Electric Vehicles', 6, 'ELECTIVE'],
  ],
  EE: [
    ['E101', 'Circuit Analysis', 1, 'CORE'],
    ['E102', 'Electrical Machines', 2, 'CORE'],
    ['E201', 'Power Systems', 3, 'CORE'],
    ['E202', 'Power Generation', 3, 'CORE'],
    ['E301', 'Transmission and Distribution', 4, 'CORE'],
    ['E302', 'Power Electronics', 4, 'CORE'],
    ['E401', 'Smart Grids', 5, 'ELECTIVE'],
  ],
  ME: [
    ['ME101', 'Engineering Mechanics', 1, 'CORE'],
    ['ME102', 'Strength of Materials', 2, 'CORE'],
    ['ME201', 'Thermodynamics', 3, 'CORE'],
    ['ME202', 'Fluid Mechanics', 3, 'CORE'],
    ['ME203', 'Theory of Machines', 3, 'CORE'],
    ['ME301', 'Machine Design', 4, 'CORE'],
    ['ME302', 'Heat Transfer', 4, 'CORE'],
    ['ME303', 'Manufacturing Processes', 4, 'CORE'],
    ['ME401', 'Internal Combustion Engines', 5, 'CORE'],
    ['ME402', 'Refrigeration and Air Conditioning', 5, 'ELECTIVE'],
    ['ME403', 'CAD/CAM', 5, 'CORE'],
    ['ME501', 'Robotics', 6, 'ELECTIVE'],
    ['ME502', 'Automobile Engineering', 6, 'ELECTIVE'],
  ],
  CE: [
    ['CE101', 'Engineering Mechanics', 1, 'CORE'],
    ['CE102', 'Strength of Materials', 2, 'CORE'],
    ['CE201', 'Structural Analysis', 3, 'CORE'],
    ['CE202', 'Geotechnical Engineering', 3, 'CORE'],
    ['CE203', 'Fluid Mechanics', 3, 'CORE'],
    ['CE301', 'Reinforced Concrete Design', 4, 'CORE'],
    ['CE302', 'Steel Structures', 4, 'CORE'],
    ['CE303', 'Transportation Engineering', 4, 'CORE'],
    ['CE401', 'Environmental Engineering', 5, 'CORE'],
    ['CE402', 'Highway Engineering', 5, 'ELECTIVE'],
    ['CE403', 'Construction Management', 5, 'CORE'],
    ['CE501', 'Estimation and Costing', 6, 'CORE'],
    ['CE502', 'Earthquake Engineering', 6, 'ELECTIVE'],
  ],
  CHE: [
    ['CH101', 'Engineering Chemistry', 1, 'CORE'],
    ['CH102', 'Chemical Process Calculations', 2, 'CORE'],
    ['CH201', 'Fluid Mechanics', 3, 'CORE'],
    ['CH202', 'Heat Transfer', 3, 'CORE'],
    ['CH203', 'Mass Transfer', 3, 'CORE'],
    ['CH301', 'Chemical Reaction Engineering', 4, 'CORE'],
    ['CH302', 'Process Control', 4, 'CORE'],
    ['CH401', 'Plant Design', 5, 'CORE'],
    ['CH402', 'Petroleum Refining', 5, 'ELECTIVE'],
  ],
  BT: [
    ['BT101', 'Biochemistry', 1, 'CORE'],
    ['BT102', 'Cell Biology', 2, 'CORE'],
    ['BT201', 'Genetics', 3, 'CORE'],
    ['BT202', 'Microbiology', 3, 'CORE'],
    ['BT301', 'Bioprocess Engineering', 4, 'CORE'],
    ['BT401', 'Genetic Engineering', 5, 'ELECTIVE'],
  ],
  BME: [
    ['BME101', 'Anatomy and Physiology', 1, 'CORE'],
    ['BME102', 'Biomedical Instrumentation', 2, 'CORE'],
    ['BME201', 'Medical Imaging', 3, 'CORE'],
    ['BME202', 'Biomaterials', 3, 'CORE'],
    ['BME301', 'Biomechanics', 4, 'CORE'],
  ],
  AE: [
    ['AE101', 'Aerodynamics', 1, 'CORE'],
    ['AE102', 'Aircraft Structures', 2, 'CORE'],
    ['AE201', 'Propulsion', 3, 'CORE'],
    ['AE202', 'Flight Mechanics', 3, 'CORE'],
    ['AE301', 'Avionics', 4, 'ELECTIVE'],
  ],
  AT: [
    ['AT101', 'Automobile Mechanics', 1, 'CORE'],
    ['AT102', 'Vehicle Dynamics', 2, 'CORE'],
    ['AT201', 'Automobile Engines', 3, 'CORE'],
    ['AT202', 'Automotive Transmission', 3, 'CORE'],
    ['AT301', 'Electric and Hybrid Vehicles', 4, 'ELECTIVE'],
  ],
  PE: [
    ['PE101', 'Production Technology', 1, 'CORE'],
    ['PE102', 'Manufacturing Processes', 2, 'CORE'],
    ['PE201', 'Metal Cutting', 3, 'CORE'],
    ['PE202', 'CNC Programming', 3, 'CORE'],
    ['PE301', 'Lean Manufacturing', 4, 'ELECTIVE'],
  ],
  IE: [
    ['IE101', 'Industrial Engineering', 1, 'CORE'],
    ['IE102', 'Operations Research', 2, 'CORE'],
    ['IE201', 'Work Study', 3, 'CORE'],
    ['IE202', 'Quality Control', 3, 'CORE'],
    ['IE301', 'Supply Chain Management', 4, 'ELECTIVE'],
  ],
  MTE: [
    ['MTE101', 'Physical Metallurgy', 1, 'CORE'],
    ['MTE102', 'Mechanical Metallurgy', 2, 'CORE'],
    ['MTE201', 'Heat Treatment', 3, 'CORE'],
    ['MTE202', 'Iron Making', 3, 'CORE'],
    ['MTE301', 'Steel Making', 4, 'CORE'],
  ],
  MNE: [
    ['MNE101', 'Mining Geology', 1, 'CORE'],
    ['MNE102', 'Mine Development', 2, 'CORE'],
    ['MNE201', 'Surface Mining', 3, 'CORE'],
    ['MNE202', 'Underground Mining', 3, 'CORE'],
    ['MNE301', 'Mine Ventilation', 4, 'CORE'],
  ],
  AGE: [
    ['AGE101', 'Soil Science', 1, 'CORE'],
    ['AGE102', 'Crop Production', 2, 'CORE'],
    ['AGE201', 'Irrigation Engineering', 3, 'CORE'],
    ['AGE202', 'Agricultural Machinery', 3, 'CORE'],
    ['AGE301', 'Food Processing', 4, 'ELECTIVE'],
  ],
  PEE: [
    ['PEE101', 'Petroleum Geology', 1, 'CORE'],
    ['PEE102', 'Drilling Technology', 2, 'CORE'],
    ['PEE201', 'Reservoir Engineering', 3, 'CORE'],
    ['PEE202', 'Petroleum Refining', 3, 'CORE'],
    ['PEE301', 'Natural Gas Engineering', 4, 'ELECTIVE'],
  ],
  ICE: [
    ['ICE101', 'Instrumentation', 1, 'CORE'],
    ['ICE102', 'Sensors and Transducers', 2, 'CORE'],
    ['ICE201', 'Control Systems', 3, 'CORE'],
    ['ICE202', 'Industrial Automation', 3, 'CORE'],
    ['ICE301', 'PLC Programming', 4, 'CORE'],
  ],
  MTR: [
    ['MTR101', 'Mechanical Engineering Basics', 1, 'CORE'],
    ['MTR102', 'Electronics Engineering Basics', 2, 'CORE'],
    ['MTR201', 'Embedded Systems', 3, 'CORE'],
    ['MTR202', 'Control Systems', 3, 'CORE'],
    ['MTR301', 'Robotics', 4, 'CORE'],
  ],
  RAE: [
    ['RAE101', 'Robotics Fundamentals', 1, 'CORE'],
    ['RAE102', 'Kinematics', 2, 'CORE'],
    ['RAE201', 'Robot Dynamics', 3, 'CORE'],
    ['RAE202', 'Industrial Automation', 3, 'CORE'],
    ['RAE301', 'Robot Vision', 4, 'ELECTIVE'],
  ],
  ENV: [
    ['ENV101', 'Environmental Chemistry', 1, 'CORE'],
    ['ENV102', 'Ecology', 2, 'CORE'],
    ['ENV201', 'Air Pollution', 3, 'CORE'],
    ['ENV202', 'Water Pollution', 3, 'CORE'],
    ['ENV301', 'Solid Waste Management', 4, 'CORE'],
  ],
  MRE: [
    ['MRE101', 'Marine Engineering', 1, 'CORE'],
    ['MRE102', 'Naval Architecture', 2, 'CORE'],
    ['MRE201', 'Marine Propulsion', 3, 'CORE'],
    ['MRE202', 'Ship Design', 3, 'CORE'],
    ['MRE301', 'Offshore Engineering', 4, 'ELECTIVE'],
  ],
  FT: [
    ['FT101', 'Food Chemistry', 1, 'CORE'],
    ['FT102', 'Food Microbiology', 2, 'CORE'],
    ['FT201', 'Food Processing', 3, 'CORE'],
    ['FT202', 'Food Preservation', 3, 'CORE'],
    ['FT301', 'Dairy Technology', 4, 'ELECTIVE'],
  ],
  TE: [
    ['TE101', 'Textile Fibers', 1, 'CORE'],
    ['TE102', 'Yarn Manufacturing', 2, 'CORE'],
    ['TE201', 'Fabric Manufacturing', 3, 'CORE'],
    ['TE202', 'Textile Chemistry', 3, 'CORE'],
    ['TE301', 'Textile Testing', 4, 'CORE'],
  ],
  PEX: [
    ['PEX101', 'Polymer Chemistry', 1, 'CORE'],
    ['PEX102', 'Polymer Physics', 2, 'CORE'],
    ['PEX201', 'Polymer Processing', 3, 'CORE'],
    ['PEX202', 'Polymer Rheology', 3, 'CORE'],
    ['PEX301', 'Composite Materials', 4, 'ELECTIVE'],
  ],
  CER: [
    ['CER101', 'Ceramic Raw Materials', 1, 'CORE'],
    ['CER102', 'Ceramic Processing', 2, 'CORE'],
    ['CER201', 'Refractories', 3, 'CORE'],
    ['CER202', 'Glass Technology', 3, 'CORE'],
    ['CER301', 'Ceramic Coatings', 4, 'ELECTIVE'],
  ],
  GE: [
    ['GE101', 'Molecular Biology', 1, 'CORE'],
    ['GE102', 'Genetics', 2, 'CORE'],
    ['GE201', 'Gene Cloning', 3, 'CORE'],
    ['GE202', 'Genomics', 3, 'CORE'],
    ['GE301', 'Proteomics', 4, 'ELECTIVE'],
  ],
};

// Common subjects (aptitude, reasoning, verbal, programming) - isCommon = true, branchId = first branch
const COMMON_SUBJECTS = [
  ['AP101', 'Quantitative Aptitude', 1, 'CORE', 'Quantitative Aptitude'],
  ['AP102', 'Logical Reasoning', 1, 'CORE', 'Logical Reasoning'],
  ['AP103', 'Verbal Ability', 1, 'CORE', 'Verbal Ability'],
  ['AP104', 'Programming Preparation', 1, 'CORE', 'Programming Preparation'],
];

// Sample questions per subject - [type, difficulty, text, options(json), correctAnswer, explanation]
type Q = [string, string, string, string, string, string];

const QUESTIONS: Record<string, Q[]> = {
  // CSE - Data Structures
  'CS102': [
    ['MCQ', 'EASY', 'What is the time complexity of binary search on a sorted array?', '["O(1)","O(log n)","O(n)","O(n log n)"]', '["1"]', 'Binary search halves the search space at each step, giving O(log n).'],
    ['MCQ', 'EASY', 'Which data structure uses LIFO order?', '["Queue","Stack","Tree","Graph"]', '["1"]', 'Stack is Last-In-First-Out: the last pushed element is the first popped.'],
    ['MCQ', 'MEDIUM', 'What is the inorder traversal of a BST?', '["Left-Root-Right","Root-Left-Right","Left-Right-Root","Right-Root-Left"]', '["0"]', 'Inorder traversal visits Left subtree, Root, then Right subtree, giving sorted order in a BST.'],
    ['MCQ', 'MEDIUM', 'Which sorting algorithm has the best average time complexity?', '["Bubble Sort","Quick Sort","Merge Sort","Selection Sort"]', '["2"]', 'Merge Sort has O(n log n) average and worst-case, stable sort.'],
    ['NUMERICAL', 'MEDIUM', 'How many comparisons are needed to find an element in a balanced BST of 1024 nodes (worst case)?', '[]', '10', 'A balanced BST with 1024=2^10 nodes has height 10, so 10 comparisons worst case.'],
  ],
  // CSE - Algorithms
  'CS201': [
    ['MCQ', 'EASY', 'What is the time complexity of inserting into a sorted array?', '["O(1)","O(log n)","O(n)","O(n^2)"]', '["2"]', 'You must shift elements, so O(n).'],
    ['MCQ', 'MEDIUM', 'Dijkstra\'s algorithm uses which data structure?', '["Stack","Queue","Priority Queue","Hash Map"]', '["2"]', 'Dijkstra uses a min-priority queue for the next shortest path node.'],
    ['MCQ', 'HARD', 'Which problem is NP-complete?', '["Sorting","Matrix Multiplication","Travelling Salesman","Binary Search"]', '["2"]', 'Travelling Salesman Decision version is NP-complete.'],
  ],
  // CSE - Operating Systems
  'CS202': [
    ['MCQ', 'EASY', 'Which scheduling can cause starvation?', '["FCFS","Round Robin","Shortest Job First","Multilevel Queue"]', '["2"]', 'Shortest Job First can starve long jobs if short jobs keep arriving.'],
    ['MCQ', 'EASY', 'A semaphore with initial value 1 is used for?', '["Counting resources","Mutual exclusion","Signaling","Deadlock detection"]', '["1"]', 'A binary semaphore (init=1) is used for mutual exclusion.'],
    ['MCQ', 'MEDIUM', 'Which page replacement algorithm suffers from Belady\'s anomaly?', '["FIFO","LRU","Optimal","LFU"]', '["0"]', 'FIFO can suffer Belady\'s anomaly where more frames cause more faults.'],
  ],
  // CSE - DBMS
  'CS203': [
    ['MCQ', 'EASY', 'Which normal form removes transitive dependencies?', '["1NF","2NF","3NF","BCNF"]', '["2"]', '3NF removes transitive dependencies between non-key attributes.'],
    ['MCQ', 'EASY', 'ACID stands for?', '["Atomicity, Consistency, Isolation, Durability","Availability, Consistency, Integrity, Durability","Atomicity, Concurrency, Isolation, Distribution","Accuracy, Consistency, Isolation, Durability"]', '["0"]', 'ACID = Atomicity, Consistency, Isolation, Durability.'],
    ['MCQ', 'MEDIUM', 'Which JOIN returns all rows from both tables with NULLs where no match?', '["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"]', '["3"]', 'FULL OUTER JOIN keeps all rows from both sides.'],
  ],
  // CSE - OOP
  'CS103': [
    ['MCQ', 'EASY', 'Which OOP principle hides internal object details?', '["Inheritance","Polymorphism","Encapsulation","Abstraction"]', '["2"]', 'Encapsulation hides internal state and only exposes methods.'],
    ['MCQ', 'EASY', 'Runtime polymorphism is achieved using?', '["Method Overloading","Method Overriding","Operator Overloading","Templates"]', '["1"]', 'Method overriding enables runtime (dynamic) polymorphism.'],
  ],
  // CSE - Networks
  'CS301': [
    ['MCQ', 'EASY', 'How many bits in an IPv4 address?', '["32","64","128","16"]', '["0"]', 'IPv4 uses 32 bits divided into 4 octets.'],
    ['MCQ', 'MEDIUM', 'Which transport protocol is connection-oriented?', '["UDP","TCP","ICMP","ARP"]', '["1"]', 'TCP establishes a connection with 3-way handshake; UDP is connectionless.'],
  ],
  // CSE - AI
  'CS401': [
    ['MCQ', 'EASY', 'Which algorithm is used for decision tree induction?', '["ID3","KNN","K-Means","Apriori"]', '["0"]', 'ID3 is a classic decision tree algorithm using information gain.'],
    ['MCQ', 'MEDIUM', 'A* algorithm uses which heuristic property to guarantee optimality?', '["Completeness","Admissibility","Consistency","Optimality"]', '["1"]', 'A* with an admissible heuristic guarantees optimal solutions.'],
  ],
  // ECE - Digital Electronics
  'EC201': [
    ['MCQ', 'EASY', 'How many flip-flops are needed for a mod-8 counter?', '["2","3","4","8"]', '["1"]', 'A mod-N counter needs ceil(log2 N) flip-flops = 3 for mod-8.'],
    ['MCQ', 'EASY', 'Which gate is a universal gate?', '["AND","OR","NAND","XOR"]', '["2"]', 'NAND and NOR are universal gates; any logic can be built using them.'],
    ['MCQ', 'MEDIUM', 'A 4:1 MUX has how many select lines?', '["1","2","3","4"]', '["1"]', 'A 2^n:1 MUX needs n select lines, so 4:1 needs 2 select lines.'],
  ],
  // ECE - Signals and Systems
  'EC202': [
    ['MCQ', 'EASY', 'The Fourier transform of an impulse signal is?', '["A constant","An impulse","Sinc function","Exponential"]', '["0"]', 'The Fourier transform of delta(t) is 1 (a constant across all frequencies).'],
    ['MCQ', 'MEDIUM', 'A system is LTI if it satisfies?', '["Linearity only","Time invariance only","Both linearity and time invariance","Stability"]', '["2"]', 'LTI = Linear AND Time-Invariant.'],
  ],
  // ECE - Communication Systems
  'EC301': [
    ['MCQ', 'EASY', 'AM stands for?', '["Angle Modulation","Amplitude Modulation","Analog Modulation","Active Modulation"]', '["1"]', 'AM = Amplitude Modulation; carrier amplitude varies with the signal.'],
    ['MCQ', 'MEDIUM', 'Shannon capacity for a channel with SNR of 30 dB and bandwidth 3 kHz is?', '["30 kbps","9 kbps","3 kbps","300 kbps"]', '["0"]', 'C = B log2(1+SNR) = 3000 * log2(1+1000) ≈ 3000 * 10 = 30 kbps.'],
  ],
  // ME - Thermodynamics
  'ME201': [
    ['MCQ', 'EASY', 'The first law of thermodynamics is the law of?', '["Entropy","Conservation of energy","Heat engines","Absolute zero"]', '["1"]', 'First law: energy is conserved; ΔU = Q - W.'],
    ['MCQ', 'MEDIUM', 'For an isentropic process, what is constant?', '["Temperature","Pressure","Entropy","Volume"]', '["2"]', 'Isentropic means constant entropy (reversible adiabatic).'],
    ['NUMERICAL', 'MEDIUM', 'Carnot efficiency with T_hot=600K and T_cold=300K (in %)?', '[]', '50', 'η = 1 - T_cold/T_hot = 1 - 300/600 = 0.5 = 50%.'],
  ],
  // ME - Strength of Materials
  'ME102': [
    ['MCQ', 'EASY', 'Stress is defined as?', '["Force per unit area","Force per unit length","Force per unit volume","Force per unit time"]', '["0"]', 'Stress = Force / Area. Units: Pa or N/m².'],
    ['MCQ', 'MEDIUM', 'Young\'s modulus has units of?', '["N","N/m","Pa","Dimensionless"]', '["2"]', 'Young\'s modulus = Stress/Strain; stress has units of Pa, strain is dimensionless.'],
  ],
  // ME - Fluid Mechanics
  'ME202': [
    ['MCQ', 'EASY', 'Reynolds number is the ratio of?', '["Viscous to inertia forces","Inertia to viscous forces","Pressure to viscous forces","Gravity to viscous forces"]', '["1"]', 'Re = Inertia force / Viscous force.'],
    ['MCQ', 'MEDIUM', 'For pipe flow, transition to turbulence begins at Reynolds number around?', '["100","2300","10000","100000"]', '["1"]', 'For pipe flow, transition from laminar to turbulent starts around Re=2300.'],
  ],
  // CE - Strength of Materials
  'CE102': [
    ['MCQ', 'EASY', 'The unit of strain is?', '["N/m²","Dimensionless","m","N"]', '["1"]', 'Strain = ΔL/L, dimensionless.'],
    ['MCQ', 'MEDIUM', 'Poisson\'s ratio for most metals lies in the range?', '["0 to 0.1","0.25 to 0.35","0.5 to 0.7","0.7 to 1.0"]', '["1"]', 'Most metals have Poisson\'s ratio 0.25-0.35.'],
  ],
  // CE - Structural Analysis
  'CE201': [
    ['MCQ', 'EASY', 'A simply supported beam with UDL has maximum bending moment at?', '["Ends","Quarter span","Mid span","Supports"]', '["2"]', 'For UDL, max BM is at mid-span: wL²/8.'],
    ['MCQ', 'MEDIUM', 'Degree of static indeterminacy for a fixed beam is?', '["0","1","2","3"]', '["2"]', 'A fixed beam has 3 reactions at each end (6 total) - 3 equilibrium = 3 indeterminacy, but commonly stated as 3; here convention says 3.'],
  ],
  // CE - Geotechnical Engineering
  'CE202': [
    ['MCQ', 'EASY', 'Which soil has the smallest particle size?', '["Gravel","Sand","Silt","Clay"]', '["3"]', 'Clay particles are < 0.002 mm, smallest of these.'],
    ['MCQ', 'MEDIUM', 'The bearing capacity of soil is typically expressed in?', '["N/m","kN/m²","N/mm","kg/m³"]', '["1"]', 'Bearing capacity is in kN/m² or kPa.'],
  ],
  // EEE - Circuit Analysis
  'EE101': [
    ['MCQ', 'EASY', 'Ohm\'s law states V = ?', '["I/R","R/I","I*R","I/R^2"]', '["2"]', 'Ohm\'s law: V = I*R.'],
    ['MCQ', 'MEDIUM', 'Two 10Ω resistors in parallel give?', '["20Ω","10Ω","5Ω","2.5Ω"]', '["2"]', 'Parallel: (10*10)/(10+10) = 100/20 = 5Ω.'],
    ['NUMERICAL', 'EASY', 'A 12V battery drives 2A through a resistor. Resistance in ohms?', '[]', '6', 'R = V/I = 12/2 = 6Ω.'],
  ],
  // EEE - Power Systems
  'EE202': [
    ['MCQ', 'EASY', 'In India, transmission voltage levels typically are?', '["110V, 220V","415V, 11kV","132kV, 220kV, 400kV","230kV only"]', '["2"]', 'India uses 132kV, 220kV, 400kV, 765kV HVAC for transmission.'],
    ['MCQ', 'MEDIUM', 'Skin effect in transmission lines increases with?', '["Decreasing frequency","Increasing frequency","Decreasing voltage","Increasing voltage"]', '["1"]', 'Skin effect increases with frequency; AC current crowds to the surface.'],
  ],
  // CHE - Heat Transfer
  'CH202': [
    ['MCQ', 'EASY', 'Fourier\'s law applies to?', '["Conduction","Convection","Radiation","Phase change"]', '["0"]', 'Fourier\'s law: q = -k dT/dx (heat conduction).'],
    ['MCQ', 'MEDIUM', 'Nusselt number is the ratio of?', '["Conduction to convection resistance","Convection to conduction resistance","Momentum to heat transfer","Inertia to viscous forces"]', '["1"]', 'Nu = (convection resistance)/(conduction resistance).'],
  ],
  // BT - Biochemistry
  'BT101': [
    ['MCQ', 'EASY', 'The basic building block of proteins is?', '["Nucleotides","Amino acids","Glucose","Fatty acids"]', '["1"]', 'Proteins are polymers of amino acids.'],
    ['MCQ', 'MEDIUM', 'ATP contains how many phosphate groups?', '["1","2","3","4"]', '["2"]', 'ATP (Adenosine TriPhosphate) has 3 phosphate groups.'],
  ],
  // BME - Anatomy and Physiology
  'BME101': [
    ['MCQ', 'EASY', 'How many chambers does the human heart have?', '["2","3","4","5"]', '["2"]', 'The human heart has 4 chambers: 2 atria + 2 ventricles.'],
    ['MCQ', 'EASY', 'The basic functional unit of the kidney is?', '["Neuron","Nephron","Alveolus","Hepatocyte"]', '["1"]', 'The nephron is the functional unit of the kidney.'],
  ],
  // Common - Quantitative Aptitude
  'AP101': [
    ['MCQ', 'EASY', 'What is 15% of 200?', '["20","25","30","35"]', '["2"]', '15% of 200 = 0.15*200 = 30.'],
    ['MCQ', 'EASY', 'If a train travels 60 km in 1.5 hours, its speed is?', '["30 kmph","40 kmph","45 kmph","50 kmph"]', '["1"]', 'Speed = 60/1.5 = 40 kmph.'],
    ['MCQ', 'MEDIUM', 'The simple interest on Rs 5000 at 8% per annum for 2 years is?', '["Rs 600","Rs 700","Rs 800","Rs 900"]', '["2"]', 'SI = P*R*T/100 = 5000*8*2/100 = 800.'],
    ['NUMERICAL', 'MEDIUM', 'A sum doubles in 8 years at simple interest. The rate per annum is (in %)?', '[]', '12.5', 'SI = P in 8 years means rate = 100/8 = 12.5%.'],
  ],
  // Common - Logical Reasoning
  'AP102': [
    ['MCQ', 'EASY', 'Find the next: 2, 6, 12, 20, 30, ?', '["40","42","44","46"]', '["1"]', 'Differences: 4,6,8,10,12 → next term = 30+12 = 42.'],
    ['MCQ', 'MEDIUM', 'If ALL cats are animals and SOME animals are wild, then?', '["All cats are wild","Some cats are wild","No conclusion can be drawn","No cats are wild"]', '["2"]', 'The syllogism does not link cats with wild; no valid conclusion.'],
    ['MCQ', 'EASY', 'In a certain code, BRISK is written as CSJTL. How is HOTEL written?', '["IPUFM","IPUNE","IPULD","JPUME"]', '["0"]', 'Each letter shifted by +1: H→I, O→P, T→U, E→F, L→M = IPUFM.'],
  ],
  // Common - Verbal Ability
  'AP103': [
    ['MCQ', 'EASY', 'Choose the correct synonym of "Abundant":', '["Scarce","Plentiful","Limited","Insufficient"]', '["1"]', 'Abundant means plentiful; large in quantity.'],
    ['MCQ', 'MEDIUM', 'Identify the correct sentence:', '["He don\'t like tea","He doesn\'t likes tea","He doesn\'t like tea","He not like tea"]', '["2"]', 'Correct: He doesn\'t (does not) + base verb (like).'],
    ['MCQ', 'EASY', 'Antonym of "Benevolent":', '["Kind","Generous","Cruel","Charitable"]', '["2"]', 'Benevolent means kind; antonym is cruel.'],
  ],
  // Common - Programming Preparation
  'AP104': [
    ['MCQ', 'EASY', 'In Python, which data type is immutable?', '["list","dict","tuple","set"]', '["2"]', 'Tuples are immutable in Python; lists, dicts, and sets are mutable.'],
    ['MCQ', 'EASY', 'What does HTML stand for?', '["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Language","Home Tool Markup Language"]', '["0"]', 'HTML = HyperText Markup Language.'],
    ['MCQ', 'MEDIUM', 'In SQL, which clause filters rows after grouping?', '["WHERE","HAVING","GROUP BY","ORDER BY"]', '["1"]', 'HAVING filters after GROUP BY; WHERE filters before.'],
    ['CODING', 'MEDIUM', 'Write a function that reverses a string. (Python)', '[]', 'def reverse(s): return s[::-1]', 'Use Python slicing with step -1 to reverse: s[::-1].'],
  ],
};

// Jobs
const JOBS = [
  // [title, company, industry, location, type, expYears, salaryMin, salaryMax, branches(json), minCgpa, maxBacklogs, skills(json)]
  ['Software Engineer - Frontend', 'TechNova Solutions', 'IT Services', 'Bengaluru', 'FULL_TIME', 0, 600000, 1000000, '["CSE","IT"]', 7.0, 0, '["React","TypeScript","HTML","CSS"]'],
  ['Backend Developer', 'DataForge Labs', 'Product SaaS', 'Hyderabad', 'FULL_TIME', 0, 800000, 1400000, '["CSE","IT"]', 7.5, 0, '["Python","SQL","REST","AWS"]'],
  ['Embedded Systems Engineer', 'SiliconCraft Semiconductors', 'Semiconductor', 'Pune', 'FULL_TIME', 0, 700000, 1200000, '["ECE","EEE","ICE"]', 7.0, 1, '["Embedded C","RTOS","Microcontroller"]'],
  ['VLSI Design Engineer', 'ChipLogic Systems', 'Semiconductor', 'Bengaluru', 'FULL_TIME', 0, 900000, 1500000, '["ECE"]', 7.5, 0, '["Verilog","SystemVerilog","VLSI"]'],
  ['Power Systems Engineer', 'GreenGrid Energy', 'Energy', 'Chennai', 'FULL_TIME', 0, 600000, 950000, '["EEE","EE"]', 6.5, 1, '["Power Systems","ETAP","SCADA"]'],
  ['Mechanical Design Engineer', 'AutoMech Industries', 'Automotive', 'Pune', 'FULL_TIME', 0, 550000, 900000, '["ME","MTE","PE"]', 6.5, 1, '["SolidWorks","ANSYS","GD&T"]'],
  ['Civil Site Engineer', 'BuildRight Constructions', 'Construction', 'Mumbai', 'FULL_TIME', 0, 450000, 750000, '["CE"]', 6.0, 2, '["AutoCAD","STAAD Pro","Site Management"]'],
  ['Chemical Process Engineer', 'PetroChem Industries', 'Chemical', 'Vadodara', 'FULL_TIME', 0, 600000, 950000, '["CHE"]', 7.0, 1, '["Aspen Plus","Process Design","Safety"]'],
  ['Data Analyst (Internship)', 'Insight Analytics', 'Analytics', 'Remote', 'INTERNSHIP', 0, 25000, 35000, '["CSE","IT","ECE","EEE","ME","CE"]', 7.0, 0, '["SQL","Excel","Python","Statistics"]'],
  ['Software Development Engineer', 'CloudScale Tech', 'Cloud Services', 'Bengaluru', 'FULL_TIME', 0, 1200000, 1800000, '["CSE","IT"]', 8.0, 0, '["Java","Spring","Microservices","AWS"]'],
  ['Robotics Engineer', 'AutoBots Robotics', 'Robotics', 'Bengaluru', 'FULL_TIME', 0, 700000, 1100000, '["RAE","MTR","EEE","ECE","ME"]', 7.0, 0, '["ROS","Python","Control Systems"]'],
  ['AI/ML Engineer', 'NeuralWorks AI', 'AI/ML', 'Bengaluru', 'FULL_TIME', 0, 1100000, 1600000, '["CSE","IT","ECE"]', 7.5, 0, '["Python","PyTorch","TensorFlow","NLP"]'],
  ['Graduate Engineer Trainee', 'Core Industries Group', 'Manufacturing', 'Pan India', 'FULL_TIME', 0, 400000, 600000, '["ME","EE","EEE","CE","CHE","ECE","MTE","PE"]', 6.0, 2, '["Communication","Teamwork","Technical Fundamentals"]'],
];

// Subscription plans
const PLANS = [
  ['FREE', 'Free', 'FREE', 0, 0, '["Basic learning","Limited assessments","Basic student profile"]'],
  ['STUDENT_PRO', 'Student Premium', 'STUDENT_PREMIUM', 299, 2999, '["AI career mentor","Advanced assessments","Resume and interview tools","Advanced analytics"]'],
  ['COLLEGE_STARTER', 'College Starter', 'COLLEGE_STARTER', 4999, 49999, '["Student management","Learning modules","Basic placement analytics"]'],
  ['COLLEGE_PRO', 'College Professional', 'COLLEGE_PROFESSIONAL', 14999, 149999, '["AI tools","Placement management","Advanced analytics","Question bank admin"]'],
  ['COLLEGE_ENT', 'College Enterprise', 'COLLEGE_ENTERPRISE', 49999, 499999, '["White-label","Custom integrations","Advanced permissions","Enterprise reporting"]'],
  ['RECRUITER', 'Recruiter', 'RECRUITER', 4999, 49999, '["Candidate discovery","Assessments","Recruitment management"]'],
];

// Simulation scenarios
const SIMS = [
  // [branchCode, title, description, objectives, constraints, rubric, difficulty]
  ['CSE', 'Debug a REST API', 'A Node.js/Express REST API for a todo app has 3 bugs: missing auth on DELETE, race condition in update, and SQL injection in search. Find and fix all three.', '["Identify the 3 bugs","Provide minimal patches","Explain each fix"]', '["Do not rewrite the whole file","Use parameterized queries"]', '["Correctness (60%)","Code quality (20%)","Explanation (20%)"]', 'HARD'],
  ['CSE', 'Design a URL Shortener', 'Design a URL shortening service like bit.ly that handles 100M URLs and 10K QPS.', '["Define data model","Choose hashing strategy","Plan scaling"]', '["Must be available 99.9%","Low latency < 100ms"]', '["Data model (30%)","Scaling approach (40%)","Trade-off awareness (30%)"]', 'HARD'],
  ['ECE', 'Design a 4-bit ALU', 'Using basic gates, design a 4-bit ALU that performs ADD, SUB, AND, OR, NOT.', '["Provide gate-level diagram","Define control signals","Verify truth table"]', '["Use only basic gates","Max 3 control bits"]', '["Correctness (60%)","Diagram clarity (20%)","Gate count (20%)"]', 'MEDIUM'],
  ['ECE', 'Embedded Firmware Debug', 'A microcontroller-based temperature monitor reads wrong values. Identify the issue in the firmware and propose a fix.', '["Identify ADC configuration bug","Propose calibration","Suggest fault handling"]', '["Do not change hardware"]', '["Root cause (50%)","Fix quality (30%)","Testing plan (20%)"]', 'MEDIUM'],
  ['EEE', 'Power System Load Flow', 'Perform load flow analysis for a 5-bus system using Newton-Raphson method.', '["Set up Y-bus matrix","Run 3 iterations","Report voltages and losses"]', '["Use per-unit values","Tolerance 0.0001"]', '["Matrix setup (40%)","Iteration accuracy (40%)","Report clarity (20%)"]', 'HARD'],
  ['ME', 'Shaft Design', 'Design a transmission shaft transmitting 20 kW at 1500 rpm with a safety factor of 3.', '["Calculate torque","Find diameter using torsion formula","Select material"]', '["Use ASME code","Max bending moment = 800 Nm"]', '["Torque calc (30%)","Diameter calc (40%)","Material selection (30%)"]', 'MEDIUM'],
  ['ME', 'Thermal Analysis of Heat Exchanger', 'A shell-and-tube heat exchanger cools oil from 120°C to 60°C using water at 30°C. Calculate the LMTD and required area.', '["Compute LMTD","Find U from correlations","Compute area"]', '["Counter-flow arrangement","U = 300 W/m²K"]', '["LMTD (40%)","Area calc (40%)","Units/clarity (20%)"]', 'MEDIUM'],
  ['CE', 'Slab Design', 'Design a simply supported RCC slab of 4m x 5m carrying a live load of 3 kN/m².', '["Compute moments","Find depth and steel","Check deflection"]', '["Use M20 concrete, Fe415 steel","Use IS 456 code"]', '["Load calc (30%)","Design (50%)","Code compliance (20%)"]', 'MEDIUM'],
  ['CE', 'Soil Bearing Capacity', 'Determine the safe bearing capacity of a 1.5m square footing at 2m depth in sandy soil (φ=30°, γ=18 kN/m³).', '["Apply Terzaghi formula","Apply appropriate factor of safety","Report net and gross values"]', '["FoS = 3","Water table at 4m depth"]', '["Formula (40%)","Calculation (40%)","Reporting (20%)"]', 'MEDIUM'],
  ['CHE', 'Heat Exchanger Sizing', 'Size a counter-flow shell-and-tube heat exchanger to cool 2 kg/s of water from 80°C to 40°C using cooling water entering at 25°C.', '["Energy balance","Compute LMTD","Compute area"]', '["Cold water flow = 2.5 kg/s","U = 800 W/m²K"]', '["Balance (30%)","LMTD (30%)","Area (30%)","Clarity (10%)"]', 'MEDIUM'],
  ['BT', 'Bioreactor Scale-up', 'A lab-scale bioreactor (5L) achieves 4 g/L of product. Scale up to 500L industrial fermenter and estimate product yield.', '["Apply scale-up principles","Estimate oxygen transfer","Estimate yield"]', '["Constant kLa","Sterile operation"]', '["Scale-up logic (50%)","Calculations (30%)","Assumptions (20%)"]', 'HARD'],
  ['RAE', 'Robot Pick-and-Place', 'Program a 6-DOF robot to pick objects from a conveyor and place them in a bin 50cm away in 5 seconds.', '["Plan trajectory","Compute joint angles","Define velocity profile"]', '["Avoid obstacles","End-effector payload 2 kg"]', '["Trajectory (40%)","Joint calc (40%)","Velocity (20%)"]', 'MEDIUM'],
];

// Project listings
const PROJECTS = [
  // [title, branchCode, description, requiredSkills, deliverables, timeline, evaluation, mentor, status]
  ['IoT Smart Agriculture Dashboard', 'CSE', 'Build a dashboard that pulls sensor data (soil moisture, temperature, humidity) and recommends irrigation.', '["React","Node.js","MQTT","Python"]', 'Working dashboard + 5-page report', '8 weeks', 'Demo (50%) + report (50%)', 'Dr. Rajesh Kumar', 'OPEN'],
  ['Electric Vehicle Motor Controller', 'EEE', 'Design and simulate a BLDC motor controller for an electric two-wheeler.', '["MATLAB","Simulink","Power Electronics"]', 'Simulink model + analysis report', '6 weeks', 'Model (60%) + report (40%)', 'Dr. S. Mehta', 'OPEN'],
  ['Cantilever Beam FEA', 'ME', 'Perform FEA on a steel cantilever beam with various loads and cross-sections.', '["ANSYS","SolidWorks","FEA fundamentals"]', 'ANSYS files + comparison report', '4 weeks', 'Accuracy (60%) + analysis (40%)', 'Prof. A. Banerjee', 'OPEN'],
  ['Water Quality Monitoring System', 'ECE', 'Build an embedded system that monitors pH, TDS, and turbidity of a water body and reports to cloud.', '["Embedded C","MQTT","ESP32"]', 'Hardware + cloud dashboard', '8 weeks', 'Functionality (60%) + report (40%)', 'Dr. P. Singh', 'OPEN'],
  ['Building Information Modeling Pilot', 'CE', 'Create a BIM model for a G+3 residential building with structural, MEP, and architectural coordination.', '["Revit","Navisworks","BIM basics"]', 'Revit file + coordination report', '10 weeks', 'Model quality (60%) + report (40%)', 'Er. S. Reddy', 'OPEN'],
  ['Distillation Column Optimization', 'CHE', 'Optimize a distillation column separating ethanol-water using Aspen Plus.', '["Aspen Plus","Process Control"]', 'Aspen file + optimization report', '6 weeks', 'Optimization (60%) + report (40%)', 'Dr. K. Iyer', 'OPEN'],
  ['AI Chatbot for Hospital Triage', 'CSE', 'Build a multilingual AI chatbot that triages patient symptoms and recommends departments.', '["NLP","Python","Rasa or Dialogflow"]', 'Working bot + 10-page report', '8 weeks', 'Accuracy (50%) + UX (30%) + report (20%)', 'Dr. M. Chatterjee', 'OPEN'],
  ['Robotic Arm for Sorting', 'RAE', 'Build a 4-DOF robotic arm that sorts objects by color using computer vision.', '["ROS","Python","OpenCV"]', 'Working robot + demo video', '12 weeks', 'Functionality (60%) + code (30%) + video (10%)', 'Dr. R. Subramanian', 'OPEN'],
];

// Daily challenges
function getDailyChallenges() {
  const today = new Date();
  const challenges = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const pool = [
      ['APTITUDE', 'Daily Quant', 'Solve this percentage problem', 'A shop offers 20% discount on a marked price of Rs 1500. What is the selling price?', '1200'],
      ['REASONING', 'Number Series', 'Find the next number', '2, 9, 28, 65, 126, ?', '217'],
      ['VERBAL', 'Synonym Challenge', 'Pick the closest synonym', 'Synonym of "Diligent" is: hardworking / lazy / careless / weak', 'hardworking'],
      ['PROGRAMMING', 'Python Snippet', 'What is the output?', 'print([x**2 for x in range(4)]) outputs what?', '[0, 1, 4, 9]'],
      ['CORE', 'Electronics Basics', 'Diode forward voltage', 'What is the typical forward voltage drop of a silicon diode (in volts)?', '0.7'],
      ['INTERVIEW', 'HR Question', 'Common HR question', 'Why do you want to join our company? (Sample keyword answer)', 'learning'],
      ['COMMUNICATION', 'Email Etiquette', 'Spot the formal phrase', 'Which is more formal: "Hi team" / "Dear Team" / "Hey all" / "Yo"', 'Dear Team'],
    ];
    const c = pool[i % pool.length];
    challenges.push({ date: dateStr, ...c, points: 10, ...(c as any).title });
  }
  return challenges;
}

async function main() {
  console.log('Seeding PlacementPro AI...');

  // 1. Branches
  for (const [code, name, cat, icon] of BRANCHES) {
    await prisma.branch.upsert({
      where: { code },
      update: {},
      create: { code, name, category: cat, icon, totalSemesters: 8 },
    });
  }
  console.log(`✓ ${BRANCHES.length} branches`);

  // 2. Subscription plans
  for (const [code, name, tier, monthly, yearly, features] of PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { code },
      update: {},
      create: { code, name, tier, priceMonthly: monthly, priceYearly: yearly, features },
    });
  }
  console.log(`✓ ${PLANS.length} subscription plans`);

  // 3. Colleges
  const colleges = [
    ['National Institute of Technology, Rourkela', 'NIT Rourkela', 'nit-rourkela', 'Rourkela', 'Odisha'],
    ['Indian Institute of Technology, Madras', 'IIT Madras', 'iit-madras', 'Chennai', 'Tamil Nadu'],
    ['Birla Institute of Technology and Science, Pilani', 'BITS Pilani', 'bits-pilani', 'Pilani', 'Rajasthan'],
    ['College of Engineering, Pune', 'COEP Pune', 'coep-pune', 'Pune', 'Maharashtra'],
  ];
  const collegeIds: Record<string, string> = {};
  for (const [name, short, domain, city, state] of colleges) {
    const c = await prisma.college.create({ data: { name, shortName: short, domain, city, state, plan: 'COLLEGE_PROFESSIONAL' } });
    collegeIds[short] = c.id;
  }
  console.log(`✓ ${colleges.length} colleges`);

  // 4. Departments + CollegeBranches (link all 28 branches to each college)
  for (const short of Object.keys(collegeIds)) {
    const collegeId = collegeIds[short];
    const dept = await prisma.department.create({ data: { collegeId, name: 'School of Engineering' } });
    const branches = await prisma.branch.findMany();
    for (const b of branches) {
      await prisma.collegeBranch.create({ data: { collegeId, branchId: b.id, departmentId: dept.id, intake: 60 } });
    }
    // Syllabus version
    await prisma.syllabusVersion.create({ data: { collegeId, branchId: (await prisma.branch.findFirst())!.id, regulation: 'R2021', effectiveYear: 2021 } });
  }
  console.log('✓ College departments, branches, syllabus versions');

  // 5. Subjects for every branch
  let subjectCount = 0;
  for (const [branchCode, subjects] of Object.entries(SUBJECTS_BY_BRANCH)) {
    const branch = await prisma.branch.findUnique({ where: { code: branchCode } });
    if (!branch) continue;
    for (const [code, name, semester, category] of subjects) {
      await prisma.subject.create({
        data: { branchId: branch.id, code, name, semester, category, isCommon: false, credits: 4 },
      });
      subjectCount++;
    }
  }
  // Common subjects (linked to CSE branch but isCommon=true)
  const cseBranch = await prisma.branch.findUnique({ where: { code: 'CSE' } });
  if (cseBranch) {
    for (const [code, name, semester, category] of COMMON_SUBJECTS) {
      await prisma.subject.create({
        data: { branchId: cseBranch.id, code, name, semester, category, isCommon: true, credits: 2 },
      });
      subjectCount++;
    }
  }
  console.log(`✓ ${subjectCount} subjects across branches`);

  // 6. Topics and questions
  let qCount = 0;
  for (const [subjectCode, qs] of Object.entries(QUESTIONS)) {
    const subject = await prisma.subject.findFirst({ where: { code: subjectCode } });
    if (!subject) continue;
    // Create one unit + topic
    const unit = await prisma.unit.create({ data: { subjectId: subject.id, number: 1, title: 'Unit 1: Fundamentals' } });
    const topic = await prisma.topic.create({ data: { unitId: unit.id, name: 'Core Concepts' } });
    for (const [type, difficulty, text, options, correct, explanation] of qs) {
      const branch = subject.branchId ? await prisma.branch.findUnique({ where: { id: subject.branchId } }) : null;
      await prisma.question.create({
        data: {
          subjectId: subject.id,
          topicId: topic.id,
          branchId: subject.isCommon ? null : (branch?.id ?? null),
          type,
          difficulty,
          text,
          options,
          correctAnswer: correct,
          explanation,
          marks: 1,
          negativeMarks: type === 'MCQ' ? 0.25 : 0,
          expectedTimeSec: 120,
          verificationStatus: 'VERIFIED',
        },
      });
      qCount++;
    }
  }
  console.log(`✓ ${qCount} questions`);

  // 7. Companies + Jobs
  const companyIds: Record<string, string> = {};
  for (const [title, company, industry, location, type, expYears, sMin, sMax, branches, cgpa, backlogs, skills] of JOBS) {
    if (!companyIds[company]) {
      const c = await prisma.company.create({ data: { name: company, industry, verified: true } });
      companyIds[company] = c.id;
    }
    await prisma.jobListing.create({
      data: {
        companyId: companyIds[company],
        title, description: `${title} role at ${company}. Looking for fresh engineering graduates.`,
        location, jobType: type, experienceYears: expYears, salaryMin: sMin, salaryMax: sMax,
        requiredBranches: branches, minCgpa: cgpa, maxBacklogs: backlogs, requiredSkills: skills,
        status: 'OPEN', source: 'RECRUITER',
      },
    });
  }
  console.log(`✓ ${JOBS.length} job listings`);

  // 8. Simulation scenarios
  for (const [branchCode, title, description, objectives, constraints, rubric, difficulty] of SIMS) {
    await prisma.simulationScenario.create({
      data: { branchCode, title, description, objectives, constraints, rubric, difficulty },
    });
  }
  console.log(`✓ ${SIMS.length} simulation scenarios`);

  // 9. Project marketplace
  for (const [title, branchCode, description, skills, deliverables, timeline, evalCrit, mentor, status] of PROJECTS) {
    await prisma.projectListing.create({
      data: { title, branchCode, description, requiredSkills: skills, deliverables, timeline, evaluationCriteria: evalCrit, mentor, status },
    });
  }
  console.log(`✓ ${PROJECTS.length} projects`);

  // 10. Daily challenges
  const challenges = getDailyChallenges();
  for (const c of challenges) {
    await prisma.dailyChallenge.create({
      data: {
        date: (c as any).date,
        category: (c as any)[0],
        title: (c as any)[1],
        description: (c as any)[2],
        question: (c as any)[3],
        answer: (c as any)[4],
        points: 10,
      },
    });
  }
  console.log(`✓ ${challenges.length} daily challenges`);

  // 11. Demo users
  // Super Admin
  const superAdmin = await prisma.user.create({
    data: { email: 'admin@placementpro.ai', passwordHash: hash('admin123'), name: 'Super Admin', role: 'SUPER_ADMIN' },
  });
  // College Admin
  const collegeAdmin = await prisma.user.create({
    data: { email: 'admin@nitrourkela.edu', passwordHash: hash('college123'), name: 'College Admin - NITR', role: 'COLLEGE_ADMIN', collegeId: collegeIds['NIT Rourkela'] },
  });
  // Placement Officer
  const po = await prisma.user.create({
    data: { email: 'placement@nitrourkela.edu', passwordHash: hash('placement123'), name: 'Placement Officer - NITR', role: 'PLACEMENT_OFFICER', collegeId: collegeIds['NIT Rourkela'] },
  });
  // Faculty
  const faculty = await prisma.user.create({
    data: { email: 'faculty@nitrourkela.edu', passwordHash: hash('faculty123'), name: 'Prof. Anita Sharma', role: 'FACULTY', collegeId: collegeIds['NIT Rourkela'] },
  });
  await prisma.facultyProfile.create({ data: { userId: faculty.id, collegeId: collegeIds['NIT Rourkela'], department: 'Computer Science', designation: 'Professor' } });
  // Recruiter
  const recruiterUser = await prisma.user.create({
    data: { email: 'recruiter@technova.com', passwordHash: hash('recruiter123'), name: 'TechNova Recruiter', role: 'RECRUITER' },
  });
  const techNova = await prisma.company.findFirst({ where: { name: 'TechNova Solutions' } });
  if (techNova) await prisma.recruiter.create({ data: { userId: recruiterUser.id, companyId: techNova.id, position: 'Talent Acquisition' } });

  // Demo students across multiple branches
  const studentData = [
    ['arjun@nitrourkela.edu', 'Arjun Sharma', 'CSE', 6, 8.4, 0, 2026, 'SOFTWARE', 'Software Engineer'],
    ['priya@nitrourkela.edu', 'Priya Patel', 'ECE', 6, 8.7, 0, 2026, 'CORE', 'VLSI Design Engineer'],
    ['rahul@nitrourkela.edu', 'Rahul Verma', 'ME', 6, 7.2, 1, 2026, 'CORE', 'Mechanical Design Engineer'],
    ['sneha@nitrourkela.edu', 'Sneha Reddy', 'CE', 6, 7.8, 0, 2026, 'CORE', 'Civil Site Engineer'],
    ['karan@nitrourkela.edu', 'Karan Mehta', 'EEE', 6, 8.1, 0, 2026, 'CORE', 'Power Systems Engineer'],
    ['divya@iitmadras.edu', 'Divya Iyer', 'CSE', 5, 9.1, 0, 2027, 'SOFTWARE', 'AI Engineer'],
    ['rohan@bitspilani.edu', 'Rohan Gupta', 'CHE', 7, 7.6, 0, 2025, 'CORE', 'Chemical Process Engineer'],
  ];

  for (const [email, name, branchCode, semester, cgpa, backlogs, gradYear, careerGoal, targetJob] of studentData) {
    const collegeShort = email.split('@')[1].includes('nitrourkela') ? 'NIT Rourkela'
      : email.includes('iitmadras') ? 'IIT Madras'
      : email.includes('bitspilani') ? 'BITS Pilani' : 'COEP Pune';
    const collegeId = collegeIds[collegeShort] || collegeIds['NIT Rourkela'];
    const branch = await prisma.branch.findUnique({ where: { code: branchCode } });
    if (!branch) continue;
    const firstName = name.split(' ')[0].toLowerCase();
    const u = await prisma.user.create({
      data: { email, passwordHash: hash('student123'), name, role: 'STUDENT', collegeId },
    });
    const sp = await prisma.studentProfile.create({
      data: {
        userId: u.id, collegeId, branchId: branch.id, semester, cgpa,
        percentage: cgpa * 9.5, activeBacklogs: backlogs, historyBacklogs: backlogs,
        graduationYear: gradYear, careerGoal, targetJob,
        bio: `${name} is a ${branchCode} engineering student passionate about ${careerGoal.toLowerCase()}.`,
        linkedinUrl: `https://linkedin.com/in/${firstName}`,
        githubUrl: `https://github.com/${firstName}`,
      },
    });
    // Seed skills for student
    const skillPool: Record<string, [string, string, number, string][]> = {
      CSE: [['Python', 'PROGRAMMING', 0.85, 'ASSESSMENT'], ['JavaScript', 'PROGRAMMING', 0.75, 'ASSESSMENT'], ['React', 'TOOL', 0.7, 'SELF'], ['SQL', 'PROGRAMMING', 0.8, 'ASSESSMENT'], ['Data Structures', 'TECHNICAL', 0.8, 'ASSESSMENT']],
      ECE: [['Verilog', 'TECHNICAL', 0.7, 'ASSESSMENT'], ['Embedded C', 'PROGRAMMING', 0.75, 'ASSESSMENT'], ['Digital Electronics', 'TECHNICAL', 0.85, 'ASSESSMENT'], ['MATLAB', 'TOOL', 0.65, 'SELF']],
      ME: [['SolidWorks', 'TOOL', 0.8, 'ASSESSMENT'], ['ANSYS', 'TOOL', 0.7, 'SELF'], ['Thermodynamics', 'TECHNICAL', 0.75, 'ASSESSMENT'], ['Manufacturing', 'DOMAIN', 0.7, 'ASSESSMENT']],
      CE: [['AutoCAD', 'TOOL', 0.8, 'ASSESSMENT'], ['STAAD Pro', 'TOOL', 0.65, 'SELF'], ['Structural Analysis', 'TECHNICAL', 0.75, 'ASSESSMENT'], ['Surveying', 'DOMAIN', 0.7, 'ASSESSMENT']],
      EEE: [['Power Systems', 'TECHNICAL', 0.8, 'ASSESSMENT'], ['ETAP', 'TOOL', 0.65, 'SELF'], ['Control Systems', 'TECHNICAL', 0.75, 'ASSESSMENT'], ['Circuit Design', 'TECHNICAL', 0.8, 'ASSESSMENT']],
      CHE: [['Aspen Plus', 'TOOL', 0.7, 'ASSESSMENT'], ['Heat Transfer', 'TECHNICAL', 0.75, 'ASSESSMENT'], ['Process Control', 'TECHNICAL', 0.7, 'ASSESSMENT']],
    };
    const skills = skillPool[branchCode] || [];
    for (const [skillName, cat, prof, verifiedBy] of skills) {
      await prisma.studentSkill.create({ data: { studentId: sp.id, name: skillName, category: cat, proficiency: prof, verifiedBy } });
    }
    // Seed digital credential
    await prisma.digitalCredential.create({
      data: { studentId: sp.id, title: `${branch.name} - Semester ${semester} Certificate`, issuer: 'PlacementPro AI', skill: branch.name, signature: createHash('sha256').update(sp.id).digest('hex').slice(0, 32) },
    });
    // Seed career roadmap
    await prisma.careerRoadmap.create({
      data: { studentId: sp.id, goal: targetJob || 'Engineer', milestones: JSON.stringify([['Build foundational skills', true], ['Complete 2 projects', true], ['Take 5 mock interviews', false], ['Apply to 10 companies', false], ['Clear interviews', false]]), progress: 0.4 },
    });
    // Seed skill gap analysis
    const targetSkillsByRole: Record<string, string[]> = {
      'Software Engineer': ['Python', 'JavaScript', 'React', 'SQL', 'Data Structures', 'Algorithms', 'System Design', 'AWS'],
      'VLSI Design Engineer': ['Verilog', 'SystemVerilog', 'VLSI', 'Digital Electronics', 'CMOS', 'Embedded C'],
      'Mechanical Design Engineer': ['SolidWorks', 'ANSYS', 'GD&T', 'Thermodynamics', 'Manufacturing', 'AutoCAD'],
      'Civil Site Engineer': ['AutoCAD', 'STAAD Pro', 'Site Management', 'Structural Analysis', 'Surveying', 'Construction'],
      'Power Systems Engineer': ['Power Systems', 'ETAP', 'SCADA', 'Control Systems', 'Circuit Design', 'Renewable Energy'],
      'Chemical Process Engineer': ['Aspen Plus', 'Heat Transfer', 'Process Control', 'Mass Transfer', 'Safety Engineering'],
      'AI Engineer': ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Deep Learning', 'Statistics', 'MLOps'],
    };
    const required = targetSkillsByRole[targetJob || 'Software Engineer'] || [];
    const existing = skills.map(s => s[0]);
    const missing = required.filter(r => !existing.includes(r));
    const readiness = Math.round((existing.filter(e => required.includes(e)).length / required.length) * 100);
    await prisma.skillGap.create({
      data: { studentId: sp.id, targetRole: targetJob || 'Engineer', requiredSkills: JSON.stringify(required), existingSkills: JSON.stringify(existing), missingSkills: JSON.stringify(missing), readinessPct: readiness },
    });
    // Seed a resume
    await prisma.resume.create({
      data: {
        userId: u.id, title: 'Primary Resume', template: 'ATS_CLASSIC',
        data: JSON.stringify({
          summary: `${name} - ${branch.name} student seeking ${targetJob} role.`,
          education: [{ degree: 'B.Tech ' + branch.name, college: collegeShort, year: gradYear, cgpa }],
          experience: [{ company: 'TechNova Solutions', role: 'Intern', duration: '3 months', description: 'Built features for production systems.' }],
          projects: [{ title: 'Capstone Project', description: 'Engineering capstone project showcasing skills.', link: '' }],
          skills: skills.map(s => s[0]),
          certifications: ['NPTEL ' + branch.name, 'Coursera specialization'],
        }),
        isPrimary: true,
      },
    });
  }
  console.log(`✓ ${studentData.length} demo students with profiles, skills, credentials, resumes, roadmaps`);

  // Alumni profiles
  const alumniData = [
    ['alumni1@placementpro.ai', 'Suresh Kumar', 'CSE', 2020, 'Google', 'Senior Software Engineer', 'IT', 'Ex-Googler mentoring students in distributed systems.'],
    ['alumni2@placementpro.ai', 'Meera Joshi', 'ECE', 2018, 'Intel', 'Design Engineer', 'Semiconductor', 'VLSI specialist, mentors for chip design careers.'],
    ['alumni3@placementpro.ai', 'Vikram Singh', 'ME', 2019, 'Tata Motors', 'Senior Design Engineer', 'Automotive', 'Mechanical designer mentoring on CAD careers.'],
    ['alumni4@placementpro.ai', 'Anita Desai', 'CE', 2017, 'L&T Construction', 'Project Manager', 'Construction', 'Civil engineer mentoring on infrastructure careers.'],
  ];
  for (const [email, name, branchCode, gradYear, company, role, industry, bio] of alumniData) {
    const u = await prisma.user.create({ data: { email, passwordHash: hash('alumni123'), name, role: 'ALUMNI', collegeId: collegeIds['NIT Rourkela'] } });
    await prisma.alumniProfile.create({ data: { userId: u.id, collegeId: collegeIds['NIT Rourkela'], branchCode, graduationYear: gradYear, currentCompany: company, currentRole: role, industry, bio, availableForMentorship: true } });
  }
  console.log(`✓ ${alumniData.length} alumni profiles`);

  // Notifications for student 1
  const arjun = await prisma.user.findUnique({ where: { email: 'arjun@nitrourkela.edu' } });
  if (arjun) {
    await prisma.notification.create({ data: { userId: arjun.id, title: 'Welcome to PlacementPro AI', message: 'Complete your profile to unlock all features.', type: 'INFO' } });
    await prisma.notification.create({ data: { userId: arjun.id, title: 'New job match', message: 'Software Engineer - Frontend at TechNova Solutions matches your profile.', type: 'JOB' } });
    await prisma.notification.create({ data: { userId: arjun.id, title: 'Daily challenge', message: 'Don\'t break your streak! Solve today\'s challenge.', type: 'INFO' } });
  }

  // Audit log
  await prisma.auditLog.create({ data: { userId: superAdmin.id, action: 'SYSTEM_SEED', resource: 'database', details: 'Initial database seeded with demo data.' } });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
