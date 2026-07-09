import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import User from './models/User.js';
import Enrollment from './models/Enrollment.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learningdash';

const seedData = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected for Seeding');

        // Wipe existing course data only (preserve Users and Enrollments)
        await Course.deleteMany();

        // Create a mock user if it doesn't exist
        const userId = new mongoose.Types.ObjectId('64c12a8f89e1a12e8c2a30fc');
        let user = await User.findById(userId);
        let savedUser = user;
        
        if (!user) {
            user = new User({
                _id: userId,
                name: 'Alex M.',
                email: 'alex@example.com',
                password: 'password123'
            });
            savedUser = await user.save();
        }

        // Standard Youtube video fallback for different categories
        const ML_VIDEO = 'https://www.youtube.com/watch?v=Gv9_4yMHFhI'; // freeCodeCamp ML course
        const DL_VIDEO = 'https://www.youtube.com/watch?v=aircAruvnKk'; // 3B1B Neural Networks
        const AI_VIDEO = 'https://www.youtube.com/watch?v=kCc8FmEb1nY'; // Andrej Karpathy LLM
        const WEB_VIDEO = 'https://www.youtube.com/watch?v=NuXRfEaG5sM'; // React Crash Course
        const DSA_VIDEO = 'https://www.youtube.com/watch?v=RBSGKlAvoiM'; // freeCodeCamp DSA

        // Create Courses
        const courses = [
            {
                title: 'Machine Learning Fundamentals',
                description: 'Learn the core concepts of algorithms, data modeling, and supervised vs unsupervised machine learning techniques. Build intuition for how machines learn from data.',
                category: 'Machine Learning',
                instructor: 'Dr. Jane Smith',
                difficulty: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80',
                totalLessons: 8,
                documentation: '## Machine Learning Fundamentals\n\n### Course Overview\nThis course provides a comprehensive introduction to machine learning, covering essential algorithms and techniques used in modern AI systems.\n\n### Prerequisites\n- Basic Python programming\n- High school mathematics (algebra, basic statistics)\n\n### What You Will Learn\n- Understand supervised vs unsupervised learning paradigms\n- Implement linear regression, logistic regression, and decision trees\n- Evaluate model performance with metrics like accuracy, precision, recall\n- Handle data preprocessing and feature engineering\n- Apply cross-validation and hyperparameter tuning\n\n### Syllabus\n1. Introduction to Machine Learning & Setup\n2. Supervised Learning: Regression\n3. Supervised Learning: Classification\n4. Unsupervised Learning: Clustering\n5. Feature Engineering & Data Preprocessing\n6. Model Evaluation Metrics\n7. Cross-Validation & Hyperparameter Tuning\n8. Capstone Project: Build Your Own ML Pipeline',
                lessons: [
                    { title: 'Introduction to Machine Learning', duration: 20, order: 1, videoUrl: ML_VIDEO },
                    { title: 'Setting Up Your ML Environment', duration: 15, order: 2, videoUrl: ML_VIDEO },
                    { title: 'Supervised Learning: Regression', duration: 30, order: 3, videoUrl: ML_VIDEO },
                    { title: 'Supervised Learning: Classification', duration: 35, order: 4, videoUrl: ML_VIDEO },
                    { title: 'Unsupervised Learning: Clustering', duration: 25, order: 5, videoUrl: ML_VIDEO },
                    { title: 'Feature Engineering & Data Cleaning', duration: 30, order: 6, videoUrl: ML_VIDEO },
                    { title: 'Model Evaluation & Metrics', duration: 25, order: 7, videoUrl: ML_VIDEO },
                    { title: 'Capstone: Build an ML Pipeline', duration: 45, order: 8, videoUrl: ML_VIDEO }
                ]
            },
            {
                title: 'Deep Learning with Python',
                description: 'Build neural networks from scratch using PyTorch and TensorFlow. Train deep learning models on image, text, and tabular data with real-world datasets.',
                category: 'Data Science',
                instructor: 'Dr. Andrew Ng',
                difficulty: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80',
                totalLessons: 10,
                documentation: '## Deep Learning with Python\n\n### Course Overview\nDive deep into neural networks, convolutional networks, recurrent networks, and transformers. Build production-grade deep learning models.\n\n### Prerequisites\n- Python proficiency\n- Linear algebra & calculus fundamentals\n- Basic machine learning knowledge\n\n### What You Will Learn\n- Build neural networks from scratch with NumPy\n- Use PyTorch and TensorFlow for model training\n- Implement CNNs for image classification\n- Build RNNs and LSTMs for sequence modeling\n- Transfer learning and fine-tuning pretrained models\n- Deploy models using ONNX and TorchServe\n\n### Syllabus\n1. What is a Neural Network?\n2. Forward & Backward Propagation\n3. Activation Functions & Optimization\n4. Convolutional Neural Networks (CNNs)\n5. Image Classification Project\n6. Recurrent Neural Networks (RNNs)\n7. LSTMs & GRUs for Sequences\n8. Transfer Learning & Fine-tuning\n9. Model Deployment Strategies\n10. Capstone: End-to-End Deep Learning Project',
                lessons: [
                    { title: 'What is a Neural Network?', duration: 20, order: 1, videoUrl: DL_VIDEO },
                    { title: 'Forward & Backward Propagation', duration: 30, order: 2, videoUrl: DL_VIDEO },
                    { title: 'Activation Functions & Optimizers', duration: 25, order: 3, videoUrl: DL_VIDEO },
                    { title: 'Convolutional Neural Networks', duration: 35, order: 4, videoUrl: DL_VIDEO },
                    { title: 'Image Classification with CNNs', duration: 40, order: 5, videoUrl: DL_VIDEO },
                    { title: 'Recurrent Neural Networks', duration: 30, order: 6, videoUrl: DL_VIDEO },
                    { title: 'LSTMs & GRUs for Sequences', duration: 35, order: 7, videoUrl: DL_VIDEO },
                    { title: 'Transfer Learning & Fine-tuning', duration: 30, order: 8, videoUrl: DL_VIDEO },
                    { title: 'Model Deployment with TorchServe', duration: 25, order: 9, videoUrl: DL_VIDEO },
                    { title: 'Capstone: End-to-End DL Project', duration: 60, order: 10, videoUrl: DL_VIDEO }
                ]
            },
            {
                title: 'Generative AI & LLMs',
                description: 'Master how large language models work — from transformer architecture to prompt engineering. Build AI-powered apps with GPT, Claude, and open-source LLMs.',
                category: 'AI',
                instructor: 'Sam Altman',
                difficulty: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
                totalLessons: 8,
                documentation: '## Generative AI & Large Language Models\n\n### Course Overview\nUnderstand the technology behind ChatGPT, Claude, and other generative AI systems. Learn to build applications powered by LLMs.\n\n### Prerequisites\n- Basic Python\n- Familiarity with APIs\n- General understanding of AI concepts\n\n### What You Will Learn\n- Transformer architecture deep dive\n- Tokenization and embedding strategies\n- Prompt engineering techniques (zero-shot, few-shot, chain-of-thought)\n- Fine-tuning LLMs with LoRA and QLoRA\n- Building RAG (Retrieval-Augmented Generation) systems\n- AI safety and responsible development\n\n### Syllabus\n1. History of Language Models\n2. Transformer Architecture Deep Dive\n3. Tokenization & Embeddings\n4. Prompt Engineering Mastery\n5. Fine-tuning with LoRA\n6. Building RAG Applications\n7. AI Agents & Tool Use\n8. AI Safety & Ethics',
                lessons: [
                    { title: 'History of Language Models', duration: 20, order: 1, videoUrl: AI_VIDEO },
                    { title: 'Transformer Architecture Deep Dive', duration: 40, order: 2, videoUrl: AI_VIDEO },
                    { title: 'Tokenization & Embeddings', duration: 25, order: 3, videoUrl: AI_VIDEO },
                    { title: 'Prompt Engineering Mastery', duration: 30, order: 4, videoUrl: AI_VIDEO },
                    { title: 'Fine-tuning LLMs with LoRA', duration: 35, order: 5, videoUrl: AI_VIDEO },
                    { title: 'Building RAG Applications', duration: 45, order: 6, videoUrl: AI_VIDEO },
                    { title: 'AI Agents & Tool Use', duration: 35, order: 7, videoUrl: AI_VIDEO },
                    { title: 'AI Safety & Responsible AI', duration: 25, order: 8, videoUrl: AI_VIDEO }
                ]
            },
            {
                title: 'Full Stack Web Development',
                description: 'Build modern responsive full stack applications using React, Next.js, Node.js, and Express. Deploy to the cloud with CI/CD pipelines.',
                category: 'Web Development',
                instructor: 'Sarah Drasner',
                difficulty: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
                totalLessons: 10,
                documentation: '## Full Stack Web Development\n\n### Course Overview\nBuild production-ready web applications from frontend to backend. Learn modern React patterns, RESTful APIs, databases, and cloud deployment.\n\n### Prerequisites\n- HTML, CSS basics\n- Basic JavaScript knowledge\n\n### What You Will Learn\n- React 18+ with hooks, context, and routing\n- Node.js & Express REST API design\n- MongoDB with Mongoose ODM\n- Authentication with JWT\n- Responsive design and CSS-in-JS\n- Deployment with Vercel, Railway, and Docker\n\n### Syllabus\n1. HTML & CSS Mastery\n2. JavaScript ES6+ Fundamentals\n3. React Basics & Component Patterns\n4. React Hooks & State Management\n5. React Router & Navigation\n6. Node.js & Express APIs\n7. MongoDB & Mongoose\n8. Authentication & Authorization\n9. Testing & Debugging\n10. Deployment & CI/CD',
                lessons: [
                    { title: 'HTML & CSS Mastery', duration: 30, order: 1, videoUrl: WEB_VIDEO },
                    { title: 'JavaScript ES6+ Fundamentals', duration: 40, order: 2, videoUrl: WEB_VIDEO },
                    { title: 'React Basics & Components', duration: 35, order: 3, videoUrl: WEB_VIDEO },
                    { title: 'React Hooks & State Management', duration: 30, order: 4, videoUrl: WEB_VIDEO },
                    { title: 'React Router & Navigation', duration: 25, order: 5, videoUrl: WEB_VIDEO },
                    { title: 'Node.js & Express APIs', duration: 40, order: 6, videoUrl: WEB_VIDEO },
                    { title: 'MongoDB & Mongoose ODM', duration: 35, order: 7, videoUrl: WEB_VIDEO },
                    { title: 'Authentication with JWT', duration: 30, order: 8, videoUrl: WEB_VIDEO },
                    { title: 'Testing & Debugging', duration: 25, order: 9, videoUrl: WEB_VIDEO },
                    { title: 'Deployment & CI/CD Pipelines', duration: 35, order: 10, videoUrl: WEB_VIDEO }
                ]
            },
            {
                title: 'Data Structures & Algorithms',
                description: 'Master essential data structures and algorithms for coding interviews. Solve 100+ problems across arrays, trees, graphs, and dynamic programming.',
                category: 'Data Science',
                instructor: 'Clement Mihailescu',
                difficulty: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
                totalLessons: 10,
                documentation: '## Data Structures & Algorithms\n\n### Course Overview\nPrepare for FAANG-level technical interviews with a rigorous study of data structures and algorithms. Learn to analyze time and space complexity.\n\n### Prerequisites\n- Proficiency in at least one programming language (Python/Java/C++)\n- Basic computer science knowledge\n\n### What You Will Learn\n- Big O notation and complexity analysis\n- Arrays, strings, linked lists, stacks, queues\n- Trees, BSTs, heaps, and tries\n- Graphs: BFS, DFS, Dijkstra, topological sort\n- Dynamic programming patterns\n- Greedy algorithms and backtracking\n\n### Syllabus\n1. Big O Notation & Complexity\n2. Arrays & Strings\n3. Linked Lists\n4. Stacks & Queues\n5. Trees & Binary Search Trees\n6. Heaps & Priority Queues\n7. Graphs: BFS & DFS\n8. Graphs: Shortest Path Algorithms\n9. Dynamic Programming Patterns\n10. Mock Interview Practice',
                lessons: [
                    { title: 'Big O Notation & Complexity', duration: 25, order: 1, videoUrl: DSA_VIDEO },
                    { title: 'Arrays & Strings Deep Dive', duration: 35, order: 2, videoUrl: DSA_VIDEO },
                    { title: 'Linked Lists & Pointers', duration: 30, order: 3, videoUrl: DSA_VIDEO },
                    { title: 'Stacks & Queues', duration: 25, order: 4, videoUrl: DSA_VIDEO },
                    { title: 'Trees & Binary Search Trees', duration: 40, order: 5, videoUrl: DSA_VIDEO },
                    { title: 'Heaps & Priority Queues', duration: 30, order: 6, videoUrl: DSA_VIDEO },
                    { title: 'Graphs: BFS & DFS', duration: 35, order: 7, videoUrl: DSA_VIDEO },
                    { title: 'Shortest Path Algorithms', duration: 35, order: 8, videoUrl: DSA_VIDEO },
                    { title: 'Dynamic Programming Patterns', duration: 45, order: 9, videoUrl: DSA_VIDEO },
                    { title: 'Mock Interview Practice', duration: 60, order: 10, videoUrl: DSA_VIDEO }
                ]
            },
            {
                title: 'Natural Language Processing',
                description: 'Learn to process, analyze, and generate human language with Python. Covers text classification, sentiment analysis, named entity recognition, and chatbot development.',
                category: 'AI',
                instructor: 'Dr. Emily Chen',
                difficulty: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&q=80',
                totalLessons: 8,
                documentation: '## Natural Language Processing\n\n### Course Overview\nExplore the full NLP pipeline from raw text to production-ready language models. Work with real-world datasets including customer reviews, news articles, and social media.\n\n### Prerequisites\n- Python programming\n- Basic statistics\n- Familiarity with ML concepts\n\n### What You Will Learn\n- Text preprocessing: tokenization, stemming, lemmatization\n- Bag of Words, TF-IDF, and word embeddings (Word2Vec, GloVe)\n- Text classification with traditional ML and deep learning\n- Sentiment analysis at scale\n- Named Entity Recognition (NER)\n- Sequence-to-sequence models and attention\n- Building conversational chatbots\n\n### Syllabus\n1. Text Preprocessing Pipeline\n2. Feature Extraction: BoW & TF-IDF\n3. Word Embeddings: Word2Vec & GloVe\n4. Text Classification\n5. Sentiment Analysis\n6. Named Entity Recognition\n7. Seq2Seq & Attention Mechanisms\n8. Building a Chatbot',
                lessons: [
                    { title: 'Text Preprocessing Pipeline', duration: 25, order: 1, videoUrl: AI_VIDEO },
                    { title: 'Feature Extraction: BoW & TF-IDF', duration: 30, order: 2, videoUrl: AI_VIDEO },
                    { title: 'Word Embeddings Deep Dive', duration: 35, order: 3, videoUrl: AI_VIDEO },
                    { title: 'Text Classification with ML', duration: 30, order: 4, videoUrl: AI_VIDEO },
                    { title: 'Sentiment Analysis at Scale', duration: 30, order: 5, videoUrl: AI_VIDEO },
                    { title: 'Named Entity Recognition', duration: 25, order: 6, videoUrl: AI_VIDEO },
                    { title: 'Seq2Seq & Attention Mechanisms', duration: 40, order: 7, videoUrl: AI_VIDEO },
                    { title: 'Building a Conversational Chatbot', duration: 45, order: 8, videoUrl: AI_VIDEO }
                ]
            },
            {
                title: 'Computer Vision with OpenCV',
                description: 'Process images and videos using OpenCV and deep learning. Build real-time object detection, facial recognition, and image segmentation systems.',
                category: 'AI',
                instructor: 'Dr. Fei-Fei Li',
                difficulty: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&q=80',
                totalLessons: 8,
                documentation: '## Computer Vision with OpenCV\n\n### Course Overview\nLearn to build vision-powered applications. From basic image processing to state-of-the-art object detection with YOLO and image segmentation with U-Net.\n\n### Prerequisites\n- Python programming\n- Basic linear algebra\n- Familiarity with NumPy\n\n### What You Will Learn\n- Image processing fundamentals (filtering, edge detection, transformations)\n- Feature detection with SIFT, SURF, ORB\n- Object detection with Haar cascades and YOLO\n- Image segmentation with U-Net\n- Facial recognition pipelines\n- Real-time video processing\n\n### Syllabus\n1. Image Processing Fundamentals\n2. Color Spaces & Filtering\n3. Edge Detection & Contours\n4. Feature Detection & Matching\n5. Object Detection with YOLO\n6. Image Segmentation\n7. Facial Recognition Pipeline\n8. Real-time Video Processing',
                lessons: [
                    { title: 'Image Processing Fundamentals', duration: 25, order: 1, videoUrl: ML_VIDEO },
                    { title: 'Color Spaces & Advanced Filtering', duration: 30, order: 2, videoUrl: ML_VIDEO },
                    { title: 'Edge Detection & Contours', duration: 25, order: 3, videoUrl: ML_VIDEO },
                    { title: 'Feature Detection & Matching', duration: 35, order: 4, videoUrl: ML_VIDEO },
                    { title: 'Object Detection with YOLO', duration: 40, order: 5, videoUrl: ML_VIDEO },
                    { title: 'Image Segmentation with U-Net', duration: 35, order: 6, videoUrl: ML_VIDEO },
                    { title: 'Facial Recognition Pipeline', duration: 30, order: 7, videoUrl: ML_VIDEO },
                    { title: 'Real-time Video Processing', duration: 40, order: 8, videoUrl: ML_VIDEO }
                ]
            },
            {
                title: 'Cloud Computing & DevOps',
                description: 'Learn AWS, Docker, Kubernetes, and CI/CD pipelines. Deploy scalable applications to the cloud with infrastructure as code and monitoring.',
                category: 'Web Development',
                instructor: 'Kelsey Hightower',
                difficulty: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
                totalLessons: 9,
                documentation: '## Cloud Computing & DevOps\n\n### Course Overview\nMaster cloud infrastructure and DevOps practices. Learn to containerize, orchestrate, and deploy applications at scale.\n\n### Prerequisites\n- Basic Linux command line\n- Understanding of web applications\n- Basic networking concepts\n\n### What You Will Learn\n- AWS core services (EC2, S3, RDS, Lambda)\n- Docker containerization\n- Kubernetes orchestration\n- CI/CD with GitHub Actions and Jenkins\n- Infrastructure as Code with Terraform\n- Monitoring with Prometheus & Grafana\n\n### Syllabus\n1. Cloud Computing Concepts\n2. AWS Core Services\n3. Docker Fundamentals\n4. Docker Compose & Multi-container Apps\n5. Kubernetes Basics\n6. Kubernetes in Production\n7. CI/CD Pipelines\n8. Infrastructure as Code (Terraform)\n9. Monitoring & Observability',
                lessons: [
                    { title: 'Cloud Computing Concepts', duration: 20, order: 1, videoUrl: WEB_VIDEO },
                    { title: 'AWS Core Services Deep Dive', duration: 40, order: 2, videoUrl: WEB_VIDEO },
                    { title: 'Docker Fundamentals', duration: 30, order: 3, videoUrl: WEB_VIDEO },
                    { title: 'Docker Compose & Multi-container', duration: 30, order: 4, videoUrl: WEB_VIDEO },
                    { title: 'Kubernetes Basics', duration: 35, order: 5, videoUrl: WEB_VIDEO },
                    { title: 'Kubernetes in Production', duration: 40, order: 6, videoUrl: WEB_VIDEO },
                    { title: 'CI/CD with GitHub Actions', duration: 30, order: 7, videoUrl: WEB_VIDEO },
                    { title: 'Infrastructure as Code - Terraform', duration: 35, order: 8, videoUrl: WEB_VIDEO },
                    { title: 'Monitoring with Prometheus & Grafana', duration: 30, order: 9, videoUrl: WEB_VIDEO }
                ]
            },
            {
                title: 'Reinforcement Learning',
                description: 'Train AI agents to make decisions in complex environments. From Q-learning to deep RL with applications in robotics and game playing.',
                category: 'Machine Learning',
                instructor: 'Dr. David Silver',
                difficulty: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
                totalLessons: 7,
                documentation: '## Reinforcement Learning\n\n### Course Overview\nLearn how to build intelligent agents that learn through trial and error. From classic RL algorithms to modern deep RL approaches.\n\n### Prerequisites\n- Python programming\n- Probability & statistics\n- Basic neural network understanding\n\n### What You Will Learn\n- Markov Decision Processes (MDPs)\n- Q-Learning and SARSA\n- Policy gradient methods\n- Deep Q-Networks (DQN)\n- Actor-Critic methods (A2C, PPO)\n- Multi-agent reinforcement learning\n- Applications in games and robotics\n\n### Syllabus\n1. Introduction to RL & MDPs\n2. Dynamic Programming\n3. Q-Learning & SARSA\n4. Deep Q-Networks (DQN)\n5. Policy Gradient Methods\n6. Actor-Critic: A2C & PPO\n7. Multi-Agent RL & Applications',
                lessons: [
                    { title: 'Introduction to RL & MDPs', duration: 30, order: 1, videoUrl: DL_VIDEO },
                    { title: 'Dynamic Programming for RL', duration: 35, order: 2, videoUrl: DL_VIDEO },
                    { title: 'Q-Learning & SARSA', duration: 40, order: 3, videoUrl: DL_VIDEO },
                    { title: 'Deep Q-Networks (DQN)', duration: 45, order: 4, videoUrl: DL_VIDEO },
                    { title: 'Policy Gradient Methods', duration: 40, order: 5, videoUrl: DL_VIDEO },
                    { title: 'Actor-Critic: A2C & PPO', duration: 45, order: 6, videoUrl: DL_VIDEO },
                    { title: 'Multi-Agent RL & Real-world Apps', duration: 50, order: 7, videoUrl: DL_VIDEO }
                ]
            },
            {
                title: 'Python for Data Analysis',
                description: 'Master Python data analysis with Pandas, NumPy, and Matplotlib. Clean, transform, analyze, and visualize real-world datasets effectively.',
                category: 'Data Science',
                instructor: 'Wes McKinney',
                difficulty: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80',
                totalLessons: 8,
                documentation: '## Python for Data Analysis\n\n### Course Overview\nBecome proficient in Python data analysis. Work with real datasets, perform exploratory data analysis, and create stunning visualizations.\n\n### Prerequisites\n- Basic Python knowledge\n- No prior data science experience needed\n\n### What You Will Learn\n- NumPy for numerical computing\n- Pandas for data manipulation\n- Data cleaning and preprocessing\n- Exploratory Data Analysis (EDA)\n- Statistical analysis with SciPy\n- Data visualization with Matplotlib & Seaborn\n- Working with real-world datasets (CSV, JSON, SQL)\n\n### Syllabus\n1. Python & Jupyter Setup\n2. NumPy Fundamentals\n3. Pandas DataFrames & Series\n4. Data Cleaning Techniques\n5. Exploratory Data Analysis\n6. Statistical Analysis\n7. Data Visualization Mastery\n8. Capstone: Real-world Data Project',
                lessons: [
                    { title: 'Python & Jupyter Environment Setup', duration: 15, order: 1, videoUrl: DSA_VIDEO },
                    { title: 'NumPy Fundamentals', duration: 30, order: 2, videoUrl: DSA_VIDEO },
                    { title: 'Pandas DataFrames & Series', duration: 35, order: 3, videoUrl: DSA_VIDEO },
                    { title: 'Data Cleaning Techniques', duration: 30, order: 4, videoUrl: DSA_VIDEO },
                    { title: 'Exploratory Data Analysis', duration: 35, order: 5, videoUrl: DSA_VIDEO },
                    { title: 'Statistical Analysis with SciPy', duration: 30, order: 6, videoUrl: DSA_VIDEO },
                    { title: 'Data Visualization Mastery', duration: 35, order: 7, videoUrl: DSA_VIDEO },
                    { title: 'Capstone: Real-world Data Project', duration: 50, order: 8, videoUrl: DSA_VIDEO }
                ]
            },
            {
                title: 'Cybersecurity Fundamentals',
                description: 'Understand modern cybersecurity threats and defense strategies. Learn ethical hacking, network security, cryptography, and incident response.',
                category: 'Web Development',
                instructor: 'Troy Hunt',
                difficulty: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
                totalLessons: 8,
                documentation: '## Cybersecurity Fundamentals\n\n### Course Overview\nLearn to protect systems, networks, and data from cyber threats. Understand both offensive and defensive security techniques.\n\n### Prerequisites\n- Basic networking knowledge\n- Familiarity with command line\n\n### What You Will Learn\n- Network security & firewalls\n- Cryptography fundamentals (symmetric, asymmetric, hashing)\n- Web application security (OWASP Top 10)\n- Ethical hacking and penetration testing\n- Security monitoring and incident response\n- Cloud security best practices\n\n### Syllabus\n1. Introduction to Cybersecurity\n2. Network Security & Firewalls\n3. Cryptography Fundamentals\n4. Web Application Security\n5. Ethical Hacking & Pen Testing\n6. Security Monitoring (SIEM)\n7. Incident Response\n8. Cloud Security Best Practices',
                lessons: [
                    { title: 'Introduction to Cybersecurity', duration: 20, order: 1, videoUrl: WEB_VIDEO },
                    { title: 'Network Security & Firewalls', duration: 30, order: 2, videoUrl: WEB_VIDEO },
                    { title: 'Cryptography Fundamentals', duration: 35, order: 3, videoUrl: WEB_VIDEO },
                    { title: 'Web Application Security (OWASP)', duration: 30, order: 4, videoUrl: WEB_VIDEO },
                    { title: 'Ethical Hacking & Pen Testing', duration: 40, order: 5, videoUrl: WEB_VIDEO },
                    { title: 'Security Monitoring with SIEM', duration: 30, order: 6, videoUrl: WEB_VIDEO },
                    { title: 'Incident Response Playbook', duration: 25, order: 7, videoUrl: WEB_VIDEO },
                    { title: 'Cloud Security Best Practices', duration: 30, order: 8, videoUrl: WEB_VIDEO }
                ]
            },
            {
                title: 'MLOps & Model Deployment',
                description: 'Bridge the gap between ML experiments and production. Learn MLflow, DVC, model serving, A/B testing, and monitoring ML systems at scale.',
                category: 'Machine Learning',
                instructor: 'Chip Huyen',
                difficulty: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80',
                totalLessons: 7,
                documentation: '## MLOps & Model Deployment\n\n### Course Overview\nLearn the engineering practices to take ML models from notebooks to production. Master the MLOps lifecycle.\n\n### Prerequisites\n- Machine learning fundamentals\n- Python proficiency\n- Basic cloud/DevOps knowledge\n\n### What You Will Learn\n- ML experiment tracking with MLflow\n- Data versioning with DVC\n- Model packaging and containerization\n- Model serving with FastAPI and BentoML\n- A/B testing ML models\n- Monitoring model drift and performance\n- CI/CD for ML pipelines\n\n### Syllabus\n1. Introduction to MLOps\n2. Experiment Tracking with MLflow\n3. Data Versioning with DVC\n4. Model Packaging & Containerization\n5. Model Serving at Scale\n6. A/B Testing & Canary Deployments\n7. Monitoring & Observability',
                lessons: [
                    { title: 'Introduction to MLOps', duration: 20, order: 1, videoUrl: DL_VIDEO },
                    { title: 'Experiment Tracking with MLflow', duration: 35, order: 2, videoUrl: DL_VIDEO },
                    { title: 'Data Versioning with DVC', duration: 30, order: 3, videoUrl: DL_VIDEO },
                    { title: 'Model Packaging & Docker', duration: 35, order: 4, videoUrl: DL_VIDEO },
                    { title: 'Model Serving at Scale', duration: 40, order: 5, videoUrl: DL_VIDEO },
                    { title: 'A/B Testing ML Models', duration: 30, order: 6, videoUrl: DL_VIDEO },
                    { title: 'Monitoring Model Drift', duration: 35, order: 7, videoUrl: DL_VIDEO }
                ]
            }
        ];

        const generateQuiz = (courseTitle) => {
            const quiz = [];
            for (let i = 1; i <= 20; i++) {
                quiz.push({
                    question: `(Question ${i}/20) Which of the following is a key concept in ${courseTitle}?`,
                    options: [
                        'First seemingly correct option',
                        'A completely unrelated term',
                        'The actual right answer depending on context',
                        'None of the above'
                    ],
                    // For the sake of the mock, the correct answer is always option 0 (index)
                    // but we ensure variety visually if needed. Let's make index 0 the right one always 
                    // to make testing easier, and randomize it in the UI, or just set index 2 to test. 
                    // Let's just use 0 as the correct answer index for now to make passing the quiz easy for the user
                    correctAnswerIndex: 0
                });
            }
            return quiz;
        };

        const coursesWithQuizzes = courses.map(c => ({
            ...c,
            quiz: generateQuiz(c.title)
        }));

        const insertedCourses = await Course.insertMany(coursesWithQuizzes);

        // Enroll user in the first course as a mock behavior
        let enrollment = await Enrollment.findOne({ userId: savedUser._id, courseId: insertedCourses[0]._id });
        if (!enrollment) {
            enrollment = new Enrollment({
                userId: savedUser._id,
                courseId: insertedCourses[0]._id,
                progress: 33,
                completedLessons: [insertedCourses[0].lessons[0]._id]
            });
            await enrollment.save();
        }

        if (!savedUser.enrolledCourses.includes(insertedCourses[0]._id)) {
            savedUser.enrolledCourses.push(insertedCourses[0]._id);
            await savedUser.save();
        }

        console.log(`Database Seeded Successfully with ${insertedCourses.length} courses`);
        console.log('Mock UserId:', savedUser._id.toString());
        process.exit();
    } catch (err) {
        console.error('Error Seeding Database', err);
        process.exit(1);
    }
};

seedData();
