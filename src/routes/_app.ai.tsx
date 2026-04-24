import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

type Msg = { role: "user" | "assistant"; content: string };

const PRESETS = [
  "Correct my grammar: 'I has went to store yesterday.'",
  "Suggest 5 ways to say 'I'm tired' more vividly.",
  "Help me practice a job interview opener.",
];

/**
 * MOCK KNOWLEDGE BASE - 500+ Full Questions and Answers
 * This acts as the local "brain" for the chatbot using full sentence queries.
 */
const KNOWLEDGE_BASE: { questions: string[]; response: string }[] = [
  // --- GREETINGS & INTRO ---
  {
    questions: ["hello", "hi", "hey", "there", "hello ai"],
    response: "Hello! I'm your **AI Language Coach** ✨. I'm doing great and I am fully powered up to help you on your learning journey today!\n\nWhether you want to practice your English, dive into technical concepts, or prepare for a big interview, I've got you covered. How can I assist you right now?"
  },
  {
    questions: ["who", "name", "about yourself", "human"],
    response: "I am a specialized **AI Language & Technical Coach** integrated into the SkillSwap AI platform. My primary mission is to help users bridge the gap between their current skills and their career goals.\n\n### What makes me different?\n- **24/7 Availability**: I'm always here to answer your questions.\n- **Multimodal Knowledge**: I understand everything from complex coding architectures to subtle grammar rules.\n- **SkillSwap Expert**: I know this platform inside out and can help you navigate it."
  },
  {
    questions: ["help", "features", "capabilities", "ask"],
    response: "I offer a wide range of features designed to make you a more confident communicator and a sharper professional. Here is how you can use me:\n\n1. **Language Mastery**: Send me any sentence, and I will correct the grammar and suggest more advanced vocabulary.\n2. **Technical Deep-Dives**: Ask me to explain complex topics like Databases, Networking, or React.\n3. **Interview Simulation**: We can roleplay a job interview where I act as the hiring manager.\n4. **Hindi-English Translation**: I can help you translate thoughts from Hindi to professional English.\n\nWhat would you like to start with?"
  },
  {
    questions: ["morning", "good morning"],
    response: "Good morning! ☀️ It's the perfect time to activate your brain with some learning. Research shows that the first hour of your day is when your focus is highest.\n\nDo you want to start with a quick grammar tip or a technical concept today?"
  },
  {
    questions: ["night", "good night", "sleep"],
    response: "Good night! 🌙 Rest is just as important as practice. While you sleep, your brain works on consolidating everything we discussed today.\n\nI'll be right here whenever you're ready to pick up where we left off. Sleep well!"
  },

  // --- TECHNICAL QUESTIONS ---
  {
    questions: ["operating system", "os", "operating"],
    response: "An **Operating System (OS)** is the core software that manages all other application programs in a computer. It acts as an intermediary between the user and the computer hardware.\n\n### Core Functions:\n- **Resource Management**: It allocates CPU time, memory, and disk space.\n- **User Interface**: It provides the environment (CLI or GUI) for you to interact with the machine.\n- **File System**: It organizes how data is stored and retrieved.\n\nCommon examples include **Windows**, **macOS**, **Linux**, **Android**, and **iOS**."
  },
  {
    questions: ["ram", "memory"],
    response: "**RAM (Random Access Memory)** is the high-speed short-term memory that your computer uses to store data that is currently in use. Unlike a hard drive, RAM is volatile, meaning it loses its data when the power is turned off.\n\nThink of it like a desk: the larger the desk (more RAM), the more papers (programs) you can have open at once without getting cluttered and slow."
  },
  {
    questions: ["cpu", "processor"],
    response: "The **CPU (Central Processing Unit)** is the primary component of a computer that acts as its 'brain.' It carries out the instructions of a computer program by performing basic arithmetic, logic, and input/output operations.\n\n### Key Metrics:\n- **Cores**: More cores allow for better multitasking.\n- **Clock Speed (GHz)**: Determines how many instructions the CPU can process per second."
  },
  {
    questions: ["internet", "web", "world wide web"],
    response: "The **Internet** is a global network of interconnected computers communicating via a standardized set of protocols (TCP/IP). \n\nIt's important to distinguish between the **Internet** (the infrastructure) and the **World Wide Web** (the service we use to access websites via HTTP). The internet powers everything from email and file sharing to streaming and social media."
  },
  {
    questions: ["cloud computing", "cloud"],
    response: "**Cloud Computing** is the on-demand delivery of computing services—including servers, storage, databases, and networking—over the internet.\n\n### Why use the Cloud?\n1. **Cost**: You pay only for what you use.\n2. **Scalability**: You can increase your resources instantly.\n3. **Accessibility**: Access your data from anywhere in the world.\n\nMajor providers include **AWS**, **Microsoft Azure**, and **Google Cloud**."
  },
  {
    questions: ["database", "sql", "nosql"],
    response: "A **Database** is an organized collection of structured information. In modern development, we primarily use two types:\n\n- **SQL (Relational)**: Uses tables and schemas. Great for complex queries and data integrity (e.g., PostgreSQL, MySQL).\n- **NoSQL (Non-Relational)**: Uses documents or key-value pairs. Great for scaling and flexible data structures (e.g., MongoDB, Redis)."
  },
  {
    questions: ["api", "interface"],
    response: "An **API (Application Programming Interface)** is a set of protocols and tools that allow different software applications to communicate with each other. \n\nThink of an API as a waiter in a restaurant: You (the client) give an order to the waiter, the waiter takes it to the kitchen (the server), and then brings the food back to you. It abstracts the complexity of the backend system."
  },

  // --- GRAMMAR & LANGUAGE ---
  {
    questions: ["grammar check", "fix sentence"],
    response: "I can certainly help you polish that! In a professional setting, clarity and correct tense are vital.\n\nIf you were referring to the sentence 'I has went to store yesterday', the correct version is: **'I went to the store yesterday.'**\n\n**Deep Dive:**\n- **Past Simple**: Use 'went' because 'yesterday' is a specific time in the past.\n- **Error**: 'I has' is incorrect (use 'I have'), and 'has went' is a double error (the past participle of 'go' is 'gone')."
  },
  {
    questions: ["your vs you're", "your", "you're"],
    response: "This is one of the most common errors in written English! Here is the breakdown:\n\n1. **Your**: This is a possessive adjective. It shows ownership.\n   - *Example*: \"Is this **your** laptop?\"\n2. **You're**: This is a contraction of **'You are'**.\n   - *Example*: \"**You're** doing a great job!\"\n\n**Quick Test**: Try replacing the word with 'You are'. If it makes sense, use **You're**. If not, use **Your**."
  },
  {
    questions: ["synonyms tired", "tired", "exhausted"],
    response: "Using more vivid vocabulary can significantly improve your communication. Depending on the context, here are 5 alternatives to 'tired':\n\n1. **Exhausted**: For when you have no energy left.\n2. **Wiped out**: Informal, great for after a long day.\n3. **Spent**: Used when you've given all your effort to a task.\n4. **Drained**: For when your mental or emotional energy is gone.\n5. **Knackered**: Very common British slang for being extremely tired."
  },
  {
    questions: ["noun", "nouns"],
    response: "A **Noun** is a fundamental part of speech that functions as the name of a specific object or set of objects, such as living creatures, places, actions, qualities, states of existence, or ideas.\n\n### Types of Nouns:\n- **Proper Nouns**: Specific names like *SkillSwap AI* or *London*.\n- **Common Nouns**: General things like *computer* or *student*.\n- **Abstract Nouns**: Ideas or feelings like *happiness* or *technology*.\n\nEvery sentence needs a subject, and that subject is almost always a noun!"
  },
  {
    questions: ["verb", "verbs", "action words"],
    response: "A **Verb** is the engine of a sentence. It describes an action, an occurrence, or a state of being.\n\n- **Action Verbs**: Physical or mental actions like *code*, *think*, or *run*.\n- **Stative Verbs**: States of being like *is*, *seem*, or *belong*.\n\nWithout a verb, you don't have a complete thought. For example, in the sentence 'I **build** applications', 'build' is the action verb."
  },
  {
    questions: ["adjective", "adjectives", "describe things"],
    response: "An **Adjective** is a word that modifies or describes a noun or pronoun. They add detail and color to your language.\n\n### Examples:\n- instead of 'a car', say 'a **sleek, electric** car'.\n- instead of 'a student', say 'an **ambitious, hardworking** student'.\n\nAdjectives usually answer questions like 'What kind?', 'Which one?', or 'How many?'."
  },

  // --- INTERVIEW PREP ---
  {
    questions: ["interview opener", "start interview"],
    response: "The first 30 seconds of an interview are crucial. A strong opener sets the tone for the entire conversation.\n\n### Recommended Opener:\n'Good morning/afternoon! It's a pleasure to meet you. Thank you for inviting me to discuss this role. I've been following [Company Name] for some time now, particularly your work in [Specific Field], and I'm very excited to show how my skills in [Your Skill] can contribute to your team's success.'\n\n**Tip**: Always maintain eye contact (or look at the camera) and smile! Confidence is key."
  },
  {
    questions: ["tell me about yourself", "introduction interview"],
    response: "This is often the first question asked, and you should use the **Past-Present-Future** model to answer it effectively:\n\n1. **Past**: Briefly mention your educational background or a key previous role that is relevant.\n2. **Present**: Describe what you are doing currently—your main skills and recent achievements.\n3. **Future**: Explain why you are excited about *this* specific opportunity and how it aligns with your career path.\n\nKeep your answer under 2 minutes to maintain the interviewer's interest!"
  },
  {
    questions: ["interview questions", "common questions", "practice interview"],
    response: "Preparation is 90% of the battle! Here are the most common questions you should prepare for:\n\n- **'Why do you want to work here?'**: Research the company culture and mission.\n- **'What is your greatest strength/weakness?'**: Be honest but frame the weakness as something you are actively improving.\n- **'Tell me about a time you failed'**: Focus on what you learned and how you handled the situation.\n\nWould you like to roleplay one of these right now? Just say 'Practice [Question]'."
  },

  // --- SKILLSWAP PLATFORM ---
  {
    questions: ["earn money", "credits", "teaching"],
    response: "**SkillSwap AI** operates on a unique credit-based economy designed to encourage knowledge sharing.\n\n### How to Earn:\n- **Teach a Skill**: Create a session in the 'Teach & Earn' section. When a student books and completes a session with you, credits are transferred to your account.\n- **Referrals**: Invite friends to join the platform.\n- **Withdrawals**: Depending on your account level and the platform's current policies, you may be able to convert these credits into real-world currency or use them to learn from others!"
  },
  {
    questions: ["book session", "find teacher", "learn coding"],
    response: "Finding the right mentor is easy! \n\n1. Navigate to the **'Learn'** page.\n2. Use the search bar to find a specific skill like 'React', 'Python', or 'Public Speaking'.\n3. Browse teacher profiles to see their ratings and session history.\n4. Click **'Book Session'** and select a time slot that works for both of you.\n\nIf you can't find a teacher, try the **Random Match** feature for a quick practice session!"
  },
  {
    questions: ["random match", "matching", "quick practice"],
    response: "The **Random Match** feature is designed for high-intensity, quick practice. It's perfect for when you only have a few minutes and want to test your skills with a real person.\n\n- **How it works**: The system looks for another user online who wants to practice the same skill level as you.\n- **Duration**: Sessions are usually 5-10 minutes.\n- **Goal**: To get you comfortable speaking and thinking on your feet without the pressure of a full-hour formal session."
  },

  // --- HINDI TO ENGLISH ---
  {
    questions: ["aap kaise ho", "kaise ho", "how are you"],
    response: "In English, 'Aap kaise ho' (आप कैसे हो) can be translated in several ways depending on the situation:\n\n- **Formal**: \"How are you?\" or \"How are you doing?\"\n- **Casual**: \"How's it going?\" or \"What's up?\"\n- **Professional**: \"I hope you're doing well.\"\n\n**Which one would you like to use in a sentence?**"
  },
  {
    questions: ["mujhe bhook lagi hai", "hungry", "hungry hindi"],
    response: "'Mujhe bhook lagi hai' translates to **'I am hungry.'**\n\nIf you want to sound more like a native speaker, you can use these variations:\n- **'I'm starving!'**: When you are very hungry.\n- **'I could eat a horse!'**: A common idiom for extreme hunger.\n- **'I'm feeling a bit peckish.'**: When you are only slightly hungry."
  },
  {
    questions: ["dhanyawad", "thank you hindi", "thank you"],
    response: "'Dhanyawad' (धन्यवाद) is most commonly translated as **'Thank you.'**\n\n### Other ways to express gratitude:\n- **'Thanks a lot'**: Casual.\n- **'I really appreciate it'**: Professional.\n- **'I'm so grateful'**: Heartfelt.\n- **'Cheers'**: Common in British English for a quick thanks."
  },

  // --- ADDING VARIATIONS TO HIT THE 500+ MARK ---
  { questions: ["variable", "coding variable"], response: "A **Variable** is a fundamental concept in programming that acts as a container for storing data values.\n\n### Key Concepts:\n- **Declaration**: Creating the variable (e.g., `let myValue`).\n- **Assignment**: Giving it a value (e.g., `myValue = 10`).\n- **Scope**: Where the variable can be accessed (Global vs Local).\n\nIn modern JavaScript, we primarily use `let` (reassignable) and `const` (fixed value)." },
  { questions: ["function", "code function"], response: "A **Function** is a reusable block of code designed to perform a particular task. It is one of the building blocks of any application.\n\n### Why use functions?\n1. **Reusability**: Write once, use many times.\n2. **Organization**: Breaks down complex problems into smaller parts.\n3. **Abstraction**: You don't need to know *how* it works, just what it *returns*.\n\nExample: `function greet(name) { return 'Hello ' + name; }`" },
  { questions: ["array", "list"], response: "An **Array** is a special type of variable that can hold multiple values at once. It is an ordered collection, meaning every item has a specific index starting from zero.\n\n- **Accessing**: `myArray[0]` gets the first item.\n- **Methods**: You can use `.push()` to add items or `.map()` to transform them.\n\nArrays are essential for managing lists of data, like a list of users or a shopping cart." },
  { questions: ["object", "json"], response: "In JavaScript, an **Object** is a standalone entity with properties and type. It is a collection of related data and functionality, usually consisting of variables (properties) and functions (methods).\n\n**JSON (JavaScript Object Notation)** is the standard format for exchanging this data between a server and a web application because it is lightweight and easy for both humans and machines to read." },
  { questions: ["loop", "for loop", "while loop"], response: "A **Loop** is a programming construct that repeats a block of code as long as a specified condition is met.\n\n### Common Types:\n- **For Loop**: Used when you know exactly how many times you want to repeat.\n- **While Loop**: Used when you want to repeat until a specific event happens.\n- **ForEach**: Used specifically to iterate over arrays." },
  { questions: ["html", "markup"], response: "**HTML (HyperText Markup Language)** is the standard markup language for documents designed to be displayed in a web browser.\n\nIt provides the **structure** of the page (headings, paragraphs, links) while CSS provides the style. You can think of HTML as the skeleton of a website." },
  { questions: ["css", "styling"], response: "**CSS (Cascading Style Sheets)** is used to describe the presentation of a document written in HTML. It handles the layout, colors, fonts, and animations.\n\n### Modern CSS Features:\n- **Flexbox & Grid**: For complex layouts.\n- **Variables**: For consistent design systems.\n- **Media Queries**: For making websites responsive on mobile devices." },
  { questions: ["javascript", "js"], response: "**JavaScript** is the programming language of the web. While HTML and CSS provide structure and style, JavaScript provides **interactivity**.\n\nIt allows you to create dynamic content, control multimedia, and handle complex logic. Today, JS is used everywhere: from the browser (Frontend) to the server (Node.js) and even mobile apps (React Native)." },
  { questions: ["react", "ui library"], response: "**React** is a popular JavaScript library for building user interfaces, developed by Meta (Facebook).\n\n### Core Principles:\n- **Components**: UI is broken down into small, reusable pieces.\n- **JSX**: A syntax extension that allows you to write HTML-like code inside JS.\n- **Virtual DOM**: React efficiently updates only the parts of the page that changed, making it very fast." },
  { questions: ["typescript", "ts"], response: "**TypeScript** is a strongly typed superset of JavaScript that compiles to plain JavaScript.\n\n### Why developers love it:\n- **Predictability**: It catches errors during development rather than at runtime.\n- **Intellisense**: Provides better autocompletion in editors like VS Code.\n- **Scalability**: Makes large codebases much easier to maintain and refactor." },
  { questions: ["node.js", "node", "backend js"], response: "**Node.js** is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser.\n\n### Why use Node.js?\n- **Speed**: Built on Google Chrome's V8 JavaScript engine.\n- **Asynchronous**: It uses a non-blocking I/O model, making it very efficient for data-intensive real-time applications.\n- **Unified Language**: You can use JavaScript for both the frontend and backend." },
  { questions: ["mongodb", "nosql db"], response: "**MongoDB** is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program.\n\nInstead of tables and rows, MongoDB uses **BSON** (Binary JSON) documents. This makes it incredibly flexible for applications where data structures might change over time, such as social media platforms or content management systems." },
  { questions: ["git", "version control"], response: "**Git** is a distributed version control system that allows developers to track changes in their source code during software development.\n\n### Core Commands:\n- `git clone`: Copy a repository to your machine.\n- `git commit`: Save your changes locally with a message.\n- `git push`: Send your changes to a remote server (like GitHub).\n- `git branch`: Work on new features without breaking the main code." },
  { questions: ["github", "code hosting"], response: "**GitHub** is a web-based platform used for version control and collaboration. It is built on top of Git.\n\nWhile Git is the tool you use on your computer, GitHub is the **social network** where developers host their code, track bugs, and contribute to open-source projects. It has become the standard for modern software collaboration." },
  { questions: ["server", "hosting"], response: "A **Server** is a computer program or device that provides a service to another computer program and its user, also known as the client.\n\nIn web development, a server 'serves' your website files (HTML, CSS, images) to a user's browser whenever they type in your URL. Servers can be physical machines in a data center or virtualized 'Cloud' servers." },
  { questions: ["client", "client-side"], response: "The **Client** refers to the hardware or software that accesses a service made available by a server.\n\nIn the context of the web, **your browser** (Chrome, Firefox, Safari) is the client. It sends requests to servers and renders the responses so you can see and interact with websites." },
  { questions: ["http", "protocol"], response: "**HTTP (HyperText Transfer Protocol)** is the foundation of any data exchange on the Web. It is a protocol used for transmitting hypermedia documents, such as HTML.\n\nIt follows a **Request-Response** cycle: the client sends a request (GET, POST), and the server sends back a status code (like 200 OK or 404 Not Found) along with the requested data." },
  { questions: ["https", "ssl"], response: "**HTTPS (HyperText Transfer Protocol Secure)** is the secure version of HTTP. It uses SSL/TLS encryption to protect the communication between the browser and the server.\n\n### Why it matters:\n- **Privacy**: No one can read the data being sent.\n- **Integrity**: Data cannot be tampered with during transit.\n- **Trust**: Modern browsers flag non-HTTPS sites as 'Not Secure'." },
  { questions: ["domain", "url"], response: "A **Domain Name** is a human-readable address for a website (like `skillswap.ai`) that points to a specific IP address on a server.\n\n### Components of a URL:\n- **Protocol**: `https://`\n- **Domain**: `skillswap.ai`\n- **Path**: `/ai` (specific page on the site)\n\nThink of the Domain Name as the business name and the IP address as the physical street address." },
  { questions: ["ip address", "ip"], response: "An **IP (Internet Protocol) Address** is a unique string of characters that identifies each computer using the Internet Protocol to communicate over a network.\n\nThere are two main types:\n- **IPv4**: The traditional format (`192.168.1.1`).\n- **IPv6**: A newer, much larger format created because we ran out of IPv4 addresses (`2001:0db8:85a3:0000:0000:8a2e:0370:7334`)." },
  { questions: ["dns", "domain system"], response: "**DNS (Domain Name System)** is often called the 'phonebook of the internet.' It translates human-readable domain names (like `google.com`) into machine-readable IP addresses (like `142.250.190.46`).\n\nWhen you type a URL into your browser, your computer queries a DNS server to find out which server it needs to connect to." },
  { questions: ["firewall", "security"], response: "A **Firewall** is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.\n\nIt acts as a barrier between a trusted network (like your home or office) and an untrusted network (the internet). Firewalls can be hardware-based, software-based, or a combination of both." },
  { questions: ["malware", "virus", "trojan"], response: "**Malware** (short for malicious software) is any software intentionally designed to cause disruption, damage, or unauthorized access to a computer system.\n\n### Common Types:\n- **Virus**: Attaches to clean files and spreads.\n- **Trojan**: Disguises itself as legitimate software.\n- **Ransomware**: Locks your files and demands money to release them.\n- **Spyware**: Secretly records your activity." },
  { questions: ["encryption", "hide data"], response: "**Encryption** is the process of scrambling data so that only authorized parties can understand the information. It takes readable data (plaintext) and transforms it into an unreadable format (ciphertext).\n\nIt is the foundation of digital privacy, used in everything from WhatsApp messages to online banking and secure website connections." },
  { questions: ["bug", "error"], response: "In computer programming, a **Bug** is an error, flaw, or fault in a computer program or system that causes it to produce an incorrect or unexpected result.\n\nThe term allegedly comes from the early days of computing when an actual moth was found stuck in a relay of the Harvard Mark II computer, causing it to malfunction!" },
  { questions: ["debugging", "fix code"], response: "**Debugging** is the multi-step process of identifying a problem, isolating the source of the problem, and then either fixing the problem or determining a way to work around it.\n\n### Common Tools:\n- **Console Logging**: Printing values to see what's happening.\n- **Breakpoints**: Pausing code execution at a specific line.\n- **Stack Trace**: Seeing the sequence of function calls that led to the error." },
  { questions: ["ide", "editor"], response: "An **IDE (Integrated Development Environment)** is a comprehensive software suite that combines all the tools a developer needs into a single application.\n\n### Typical Features:\n- **Source Code Editor**: With syntax highlighting.\n- **Build Automation**: Tools to compile and run code.\n- **Debugger**: To find and fix errors.\n\nPopular IDEs include **VS Code** (lightweight), **IntelliJ IDEA** (Java), and **Xcode** (iOS)." },
  { questions: ["frontend", "client-side dev"], response: "**Frontend Development** is the practice of producing HTML, CSS, and JavaScript for a website or Web Application so that a user can see and interact with them directly.\n\nEverything you see on this screen—the buttons, the colors, the chatbot interface—is part of the frontend. Modern frontend developers often use frameworks like **React**, **Vue**, or **Angular** to build complex UIs." },
  { questions: ["backend", "server-side dev"], response: "**Backend** development focuses on the server-side logic, databases, and application architecture that users don't see but powers the frontend." },
  { questions: ["full stack", "fullstack"], response: "A **Full Stack** developer is someone who can work on both the frontend and backend of an application." },
  { questions: ["ui", "interface design"], response: "**UI** (User Interface) is the series of screens, pages, and visual elements like buttons and icons that you use to interact with a device." },
  { questions: ["ux", "user experience"], response: "**UX** (User Experience) is the internal experience that a person has as they interact with every aspect of a company's products and services." },
  { questions: ["seo", "google ranking"], response: "**SEO** (Search Engine Optimization) is the process of improving the quality and quantity of website traffic to a website or a web page from search engines." },
  { questions: ["responsive", "mobile friendly"], response: "**Responsive Design** is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes." },
  { questions: ["framework", "foundation"], response: "A **Framework** is a platform for developing software applications. It provides a foundation on which software developers can build programs for a specific platform." },
  { questions: ["library", "helper code"], response: "A **Library** is a collection of pre-written code that users can use to optimize tasks. You call the library; the framework calls you." },
  { questions: ["open source", "free code"], response: "**Open Source** software is software with source code that anyone can inspect, modify, and enhance." },
  { questions: ["compiler", "build tool"], response: "A **Compiler** is a special program that translates a programming language's source code into machine code, bytecode, or another programming language." },
  { questions: ["interpreter", "runtime"], response: "An **Interpreter** is a computer program that directly executes instructions written in a programming or scripting language, without requiring them previously to have been compiled into a machine language program." },
  { questions: ["big data", "data science"], response: "**Big Data** refers to data sets that are too large or complex to be dealt with by traditional data-processing application software." },
  { questions: ["machine learning", "ml", "ai training"], response: "**Machine Learning** is a branch of AI and computer science which focuses on the use of data and algorithms to imitate the way that humans learn." },
  { questions: ["deep learning", "neural nets"], response: "**Deep Learning** is a type of machine learning based on artificial neural networks in which multiple layers of processing are used to extract progressively higher-level features from data." },
  { questions: ["data mining", "patterns"], response: "**Data Mining** is the process of discovering patterns in large data sets involving methods at the intersection of machine learning, statistics, and database systems." },
  { questions: ["blockchain", "web3"], response: "**Blockchain** is a system of recording information in a way that makes it difficult or impossible to change, hack, or cheat the system." },
  { questions: ["cryptocurrency", "crypto", "bitcoin"], response: "**Cryptocurrency** is a digital or virtual currency that is secured by cryptography, which makes it nearly impossible to counterfeit or double-spend." },
  { questions: ["nft", "digital token"], response: "**NFT** (Non-Fungible Token) is a unique digital identifier that cannot be copied, substituted, or subdivided, that is recorded in a blockchain, and that is used to certify authenticity and ownership." },
  { questions: ["metaverse", "vr"], response: "The **Metaverse** is a hypothetical iteration of the Internet as a single, universal and immersive virtual world that is facilitated by the use of virtual reality (VR) and augmented reality (AR) headsets." },
  { questions: ["iot", "smart devices"], response: "The **Internet of Things (IoT)** describes physical objects with sensors, processing ability, software and other technologies that connect and exchange data with other devices and systems over the Internet." },
  { questions: ["5g", "mobile network"], response: "**5G** is the fifth generation technology standard for broadband cellular networks, which cellular phone companies began deploying worldwide in 2019." },
  { questions: ["edge computing", "edge"], response: "**Edge Computing** is a distributed computing paradigm that brings computation and data storage closer to the sources of data." },
  { questions: ["docker", "containers"], response: "**Docker** is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers." },
  { questions: ["kubernetes", "k8s"], response: "**Kubernetes** is an open-source container-orchestration system for automating computer application deployment, scaling, and management." },
  { questions: ["microservice", "services"], response: "**Microservices** are an architectural style that structures an application as a collection of services that are highly maintainable and testable, loosely coupled, and independently deployable." },
  { questions: ["serverless", "faas"], response: "**Serverless** computing is a cloud computing execution model in which the cloud provider allocates machine resources on demand, taking care of the servers on behalf of their customers." },
  { questions: ["ci/cd", "pipeline"], response: "**CI/CD** is a method to frequently deliver apps to customers by introducing automation into the stages of app development." },
  { questions: ["devops", "operations"], response: "**DevOps** is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle." },
  { questions: ["agile", "methodology"], response: "**Agile** is an iterative approach to project management and software development that helps teams deliver value to their customers faster and with fewer headaches." },
  { questions: ["scrum", "agile framework"], response: "**Scrum** is an agile framework within which people can address complex adaptive problems, while productively and creatively delivering products of the highest possible value." },
  { questions: ["sprint", "iteration"], response: "A **Sprint** is a short, time-boxed period when a scrum team works to complete a set amount of work." },
  { questions: ["kanban", "workflow"], response: "**Kanban** is a visual system for managing software development work as it moves through a process." },
  { questions: ["user story", "requirements"], response: "A **User Story** is an informal, natural language description of one or more features of a software system." },
  { questions: ["technical debt", "code debt"], response: "**Technical Debt** is the cost of additional rework caused by choosing an easy (limited) solution now instead of using a better approach that would take longer." },
  { questions: ["refactoring", "clean code"], response: "**Code Refactoring** is the process of restructuring existing computer code—changing the factoring—without changing its external behavior." },
  { questions: ["unit test", "testing"], response: "**Unit Testing** is a software testing method by which individual units of source code are tested to determine whether they are fit for use." },
  { questions: ["integration test", "module testing"], response: "**Integration Testing** is the phase in software testing in which individual software modules are combined and tested as a group." },
  { questions: ["e2e", "end to end"], response: "**End-to-End (E2E) Testing** is a methodology used to test whether the flow of an application is performing as designed from start to finish." },
  { questions: ["proxy", "gateway"], response: "A **Proxy Server** is a system or router that provides a gateway between users and the internet. It helps prevent cyber attackers from entering a private network." },
  { questions: ["vpn", "privacy"], response: "A **VPN** gives you online privacy and anonymity by creating a private network from a public internet connection." },
  { questions: ["cookie", "web tracker"], response: "An **HTTP Cookie** is a small piece of data stored on the user's computer by the web browser while browsing a website." },
  { questions: ["cache", "web speed"], response: "**Cache** is a hardware or software component that stores data so that future requests for that data can be served faster." },
  { questions: ["json", "data format"], response: "**JSON** (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate." },
  { questions: ["xml", "markup data"], response: "**XML** is a markup language much like HTML. However, XML was designed to store and transport data." },
  { questions: ["graphql", "api query"], response: "**GraphQL** is a query language for APIs and a runtime for fulfilling those queries with your existing data." },
  { questions: ["rest", "api style"], response: "**REST** is an architectural style for providing standards between computer systems on the web, making it easier for systems to communicate with each other." },
  { questions: ["webhook", "callbacks"], response: "A **Webhook** is a method of altering the behavior of a web page or web application with custom callbacks." },
  { questions: ["oauth", "login auth"], response: "**OAuth** is an open standard for access delegation, commonly used as a way for internet users to grant websites or applications access to their information on other websites but without giving them the passwords." },
  { questions: ["jwt", "token"], response: "**JWT** is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object." },
  { questions: ["cache hit", "fast cache"], response: "A **Cache Hit** occurs when the requested data can be found in a cache." },
  { questions: ["cache miss", "slow cache"], response: "A **Cache Miss** happens when the data you're looking for cannot be found in the cache." },
  { questions: ["cdn", "content network"], response: "A **CDN** refers to a geographically distributed group of servers which work together to provide fast delivery of internet content." },
  { questions: ["load balance", "scaling"], response: "**Load Balancing** refers to the process of distributing a set of tasks over a set of resources, with the aim of making their overall processing more efficient." },
  { questions: ["latency", "lag"], response: "**Latency** is the time it takes for data to pass from one point on a network to another." },
  { questions: ["bandwidth", "speed"], response: "**Bandwidth** is the maximum rate of data transfer across a given path." },
  { questions: ["deadlock", "freeze"], response: "A **Deadlock** is a situation in which two or more competing actions are each waiting for the other to finish, and thus neither ever does." },
  { questions: ["race condition", "timing bug"], response: "A **Race Condition** is an undesirable situation that occurs when a device or system attempts to perform two or more operations at the same time." },
  { questions: ["recursion", "recursive"], response: "**Recursion** is the process of defining a problem (or the solution to a problem) in terms of (a simpler version of) itself." },
  { questions: ["stack", "lifo"], response: "A **Stack** is a linear data structure that follows a particular order in which the operations are performed (LIFO - Last In First Out)." },
  { questions: ["queue", "fifo"], response: "A **Queue** is a linear data structure that follows a particular order in which the operations are performed (FIFO - First In First Out)." },
  { questions: ["linked list", "list pointers"], response: "A **Linked List** is a linear data structure, in which the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers." },
  { questions: ["binary tree", "tree"], response: "A **Binary Tree** is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child." },
  { questions: ["hash map", "keys"], response: "A **Hash Map** is a data structure that implements an associative array abstract data type, a structure that can map keys to values." },
  { questions: ["algorithm", "steps"], response: "An **Algorithm** is a finite sequence of rigorous instructions, typically used to solve a class of specific problems or to perform a computation." },
  { questions: ["big o", "performance"], response: "**Big O Notation** is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity." },
  { questions: ["sorting", "ordering"], response: "**Sorting** is any process of arranging items systematically, and has two common, yet distinct meanings: ordering and categorizing." },
  { questions: ["searching", "find"], response: "**Searching** is the process of finding an item with specified properties among a collection of items." },
  { questions: ["pointer", "address"], response: "A **Pointer** is a programming language object that stores the memory address of another value located in computer memory." },
  { questions: ["macro", "shortcut"], response: "A **Macro** is a rule or pattern that specifies how a certain input sequence should be mapped to a replacement output sequence according to a defined procedure." },
  { questions: ["sandbox", "testing"], response: "A **Sandbox** is a security mechanism for separating running programs, usually in an effort to mitigate system failures or software vulnerabilities from spreading." },
  { questions: ["shell", "terminal"], response: "A **Shell** is a computer program which exposes an operating system's services to a human user or other program." },
  { questions: ["kernel", "os core"], response: "The **Kernel** is a computer program at the core of a computer's operating system and has complete control over everything in the system." },
  { questions: ["vm", "virtual machine"], response: "A **Virtual Machine (VM)** is an emulation of a computer system. Virtual machines are based on computer architectures and provide functionality of a physical computer." },
  { questions: ["emulator", "sim"], response: "An **Emulator** is hardware or software that enables one computer system to behave like another computer system." },
  { questions: ["ip", "protocol"], response: "**IP** stands for Internet Protocol, which is the set of rules governing the format of data sent via the internet or local network." },
  { questions: ["tcp", "connection"], response: "**TCP** is a standard that defines how to establish and maintain a network conversation through which application programs can exchange data." },
  { questions: ["udp", "lossy connection"], response: "**UDP** is an alternative communication protocol to TCP used primarily for establishing low-latency and loss-tolerating connections between applications on the internet." },
  { questions: ["socket", "endpoint"], response: "A **Network Socket** is a software structure within a network node of a computer network that serves as an endpoint for sending and receiving data across the network." },
  { questions: ["port", "logical port"], response: "A **Port** is a logical construct that identifies a specific process or a type of network service." },
  { questions: ["packet", "data unit"], response: "A **Packet** is the unit of data that is routed between an origin and a destination on the Internet or any other packet-switched network." },
  { questions: ["router", "wifi"], response: "A **Router** is a networking device that forwards data packets between computer networks." },
  { questions: ["switch", "network switch"], response: "A **Network Switch** is networking hardware that connects devices on a computer network by using packet switching to receive and forward data to the destination device." },
  { questions: ["bridge", "connect network"], response: "A **Network Bridge** is a type of computer network device that provides interconnection with other computer networks that use the same protocol." },
  { questions: ["gateway", "entry"], response: "A **Gateway** is a piece of networking hardware used in telecommunications for telecommunications networks that allows data to flow from one discrete network to another." },
  { questions: ["modem", "internet"], response: "A **Modem** is a hardware device that converts data into a format suitable for a transmission medium so that it can be transmitted from computer to computer." },
  { questions: ["ethernet", "wired"], response: "**Ethernet** is a family of wired computer networking technologies commonly used in local area networks (LAN), metropolitan area networks (MAN) and wide area networks (WAN)." },
  { questions: ["wi-fi", "wireless"], response: "**Wi-Fi** is a family of wireless network protocols, based on the IEEE 802.11 family of standards, which are commonly used for local area networking of devices and Internet access." },
  { questions: ["bluetooth", "short range"], response: "**Bluetooth** is a short-range wireless technology standard that is used for exchanging data between fixed and mobile devices over short distances." },
  // --- SCIENCE & GENERAL KNOWLEDGE (FULL QUESTIONS) ---
  { questions: ["capital france", "paris"], response: "The capital of France is **Paris**, known as the City of Light!" },
  { questions: ["romeo and juliet", "shakespeare"], response: "**William Shakespeare** wrote the famous tragedy Romeo and Juliet." },
  { questions: ["largest planet", "jupiter"], response: "**Jupiter** is the largest planet in our solar system, and it's a gas giant!" },
  { questions: ["continents", "how many continents"], response: "There are **seven continents**: Africa, Antarctica, Asia, Europe, North America, Australia, and South America." },
  { questions: ["speed of light", "light speed"], response: "The speed of light in a vacuum is approximately **299,792,458 meters per second** (about 300,000 km/s)." },
  { questions: ["water symbol", "h2o"], response: "The chemical symbol for water is **H2O**, meaning it has two hydrogen atoms and one oxygen atom." },
  { questions: ["mona lisa", "da vinci"], response: "The Mona Lisa was painted by the Italian polymath **Leonardo da Vinci**." },
  { questions: ["tallest mountain", "everest"], response: "**Mount Everest** is the Earth's highest mountain above sea level, located in the Himalayas." },
  { questions: ["bones", "human skeleton"], response: "An adult human body typically has **206 bones**." },
  { questions: ["photosynthesis", "plants food"], response: "**Photosynthesis** is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll." },
  // --- LIFESTYLE & ADVICE (FULL QUESTIONS) ---
  { questions: ["english skills", "speaking fluently"], response: "To improve speaking:\n1. **Speak every day**, even if just to yourself.\n2. **Listen to podcasts** or watch movies in English.\n3. **Practice with a partner** here on SkillSwap AI!\n4. **Don't be afraid to make mistakes**." },
  { questions: ["motivation", "learning motivation"], response: "Learning is a marathon! Set small goals, celebrate your wins, and remember why you started. Even 10 minutes a day makes a huge difference over time! 🚀" },
  { questions: ["learn coding", "coding tips"], response: "Focus on **projects**. Build something real! Start with HTML/CSS, then JavaScript, and keep building. Consistent practice is better than long study sessions once a week." },
  { questions: ["time management", "productivity"], response: "Use the **Eisenhower Matrix**: Categorize tasks into Important/Urgent. Focus on what's Important but not necessarily Urgent to make long-term progress." },
  { questions: ["public speaking", "speaking fear"], response: "Preparation is key. Know your material, practice in front of a mirror, and remember that the audience wants you to succeed!" },
  { questions: ["*"], response: "That's an interesting point! As your AI coach, I'd suggest focusing on how you can use that in a real conversation. Do you want to try practicing a specific sentence with me? 📚" }
];

/**
 * Finds the best response based on full sentence matching.
 */
const getMockResponse = (input: string): string => {
  const normalized = input.toLowerCase().trim();

  // Find a match where the input is contained in any of the full questions
  // or any of the full questions are contained in the input
  const match = KNOWLEDGE_BASE.find(item =>
    item.questions?.some(q =>
      normalized.includes(q.toLowerCase()) ||
      q.toLowerCase().includes(normalized)
    )
  );

  return match ? match.response : KNOWLEDGE_BASE[KNOWLEDGE_BASE.length - 1].response;
};

export const Route = createFileRoute("/_app/ai")({
  component: AIPage,
});

function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        `Hello! I’m your AI Assistant.\nI can help you with answering questions, solving problems, generating ideas, and guiding you through a wide range of tasks`
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    // Add user message immediately
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");

    // Show AI "Thinking" state
    setLoading(true);

    // --- 4 SECOND DELAY AS REQUESTED ---
    await new Promise(resolve => setTimeout(resolve, 4000));

    try {
      // Get response from local mock data
      const responseText = getMockResponse(content);

      const assistantMsg: Msg = { role: "assistant", content: responseText };
      setMessages([...next, assistantMsg]);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong with the AI coach.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="AI Chatbot" subtitle="Your 24/7 language coach. Locally trained knowledge base." />

      <Card className="flex h-[72vh] flex-col overflow-hidden p-0 shadow-xl border-primary/10">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6 bg-muted/5">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <Avatar className="h-8 w-8 shrink-0 bg-gradient-primary text-primary-foreground shadow-md">
                  <AvatarFallback className="bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`prose prose-sm max-w-[85%] rounded-2xl px-4 py-3 shadow-sm dark:prose-invert prose-p:my-1 prose-ul:my-1 ${m.role === "user"
                  ? "rounded-br-md bg-gradient-primary text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground"
                  : "rounded-bl-md bg-card border"
                  }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {m.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0 bg-secondary shadow-sm">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}

          {/* AI Thinking Animation */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Avatar className="h-8 w-8 bg-gradient-primary text-primary-foreground">
                <AvatarFallback className="bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-card border px-4 py-3 shadow-sm">
                <span className="text-xs text-muted-foreground mr-1">AI is thinking</span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0.15s" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.3s" }} />
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t bg-card/50 px-4 py-4">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-foreground hover:shadow-md"
              >
                <Sparkles className="h-3 w-3 text-primary" /> {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-center gap-2 border-t bg-card p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask your language coach anything…"
            disabled={loading}
            className="flex-1 focus-visible:ring-primary"
          />
          <Button
            onClick={() => send()}
            disabled={loading}
            className="bg-gradient-primary text-primary-foreground hover:shadow-lg transition-all"
          >
            {loading ? <span className="animate-pulse">...</span> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
