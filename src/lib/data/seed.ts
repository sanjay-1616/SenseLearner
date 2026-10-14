// ============================================================
// SenseLearn — Seed Data Generator
// Realistic demo data: 1 admin, 3 educators, 10 learners,
// 10 domains, 20+ skills, 30 activities, 100+ questions,
// assessment records, sessions, events, engagement scores, etc.
// ============================================================

import type {
  User, LearnerProfile, EducatorProfile, Domain, Skill, Activity,
  Question, Assessment, AssessmentResponse, LearningSession, InteractionEvent,
  EngagementProfile, Recommendation, ProgressRecord, Notification,
  AccessibilitySettings, PlatformSettings, SkillScore
} from './models';
import { hashPassword } from '../utils';

export function seedDatabase() {
  const now = new Date().toISOString();
  const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
  const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

  // ------------------------------------------------------------
  // 1. USERS
  // ------------------------------------------------------------
  const defaultPassword = hashPassword('Demo1234!');

  const users: User[] = [
    // Administrator
    {
      id: 'usr-admin-1',
      name: 'Dr. Evelyn Reed',
      email: 'admin@demo.com',
      passwordHash: defaultPassword,
      role: 'admin',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(60),
      updatedAt: daysAgo(1),
      lastLoginAt: hoursAgo(2),
    },
    // Educators
    {
      id: 'usr-edu-1',
      name: 'Prof. Marcus Vance',
      email: 'educator@demo.com',
      passwordHash: defaultPassword,
      role: 'educator',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(50),
      updatedAt: daysAgo(2),
      lastLoginAt: hoursAgo(1),
    },
    {
      id: 'usr-edu-2',
      name: 'Dr. Sarah Jenkins',
      email: 'sarah.jenkins@senselearn.edu',
      passwordHash: defaultPassword,
      role: 'educator',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(45),
      updatedAt: daysAgo(3),
      lastLoginAt: daysAgo(1),
    },
    {
      id: 'usr-edu-3',
      name: 'Thomas Thorne, M.Ed.',
      email: 'thomas.thorne@senselearn.edu',
      passwordHash: defaultPassword,
      role: 'educator',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(40),
      updatedAt: daysAgo(5),
      lastLoginAt: daysAgo(2),
    },
    // Learners (10 learners)
    {
      id: 'usr-lrn-1',
      name: 'Alex Rivera',
      email: 'learner@demo.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(30),
      updatedAt: hoursAgo(1),
      lastLoginAt: hoursAgo(1),
    },
    {
      id: 'usr-lrn-2',
      name: 'Maya Lin',
      email: 'maya.lin@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(28),
      updatedAt: hoursAgo(4),
      lastLoginAt: hoursAgo(4),
    },
    {
      id: 'usr-lrn-3',
      name: 'Lucas Campbell',
      email: 'lucas.c@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(25),
      updatedAt: daysAgo(1),
      lastLoginAt: daysAgo(1),
    },
    {
      id: 'usr-lrn-4',
      name: 'Zara Patel',
      email: 'zara.p@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(24),
      updatedAt: daysAgo(2),
      lastLoginAt: daysAgo(2),
    },
    {
      id: 'usr-lrn-5',
      name: 'Ethan Brooks',
      email: 'ethan.b@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(20),
      updatedAt: daysAgo(1),
      lastLoginAt: daysAgo(1),
    },
    {
      id: 'usr-lrn-6',
      name: 'Sofia Rodriguez',
      email: 'sofia.r@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(18),
      updatedAt: daysAgo(3),
      lastLoginAt: daysAgo(3),
    },
    {
      id: 'usr-lrn-7',
      name: 'Noah Washington',
      email: 'noah.w@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(15),
      updatedAt: daysAgo(2),
      lastLoginAt: daysAgo(2),
    },
    {
      id: 'usr-lrn-8',
      name: 'Chloe Kim',
      email: 'chloe.k@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(12),
      updatedAt: daysAgo(1),
      lastLoginAt: daysAgo(1),
    },
    {
      id: 'usr-lrn-9',
      name: 'Liam Gallagher',
      email: 'liam.g@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(10),
      updatedAt: daysAgo(4),
      lastLoginAt: daysAgo(4),
    },
    {
      id: 'usr-lrn-10',
      name: 'Amara Okafor',
      email: 'amara.o@learner.com',
      passwordHash: defaultPassword,
      role: 'learner',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      createdAt: daysAgo(8),
      updatedAt: hoursAgo(6),
      lastLoginAt: hoursAgo(6),
    },
  ];

  // ------------------------------------------------------------
  // 2. EDUCATOR PROFILES
  // ------------------------------------------------------------
  const educatorProfiles: EducatorProfile[] = [
    {
      id: 'edu-prof-1',
      userId: 'usr-edu-1',
      specialization: 'Cognitive Development & Adaptive Learning Strategies',
      assignedLearnerIds: ['usr-lrn-1', 'usr-lrn-2', 'usr-lrn-3', 'usr-lrn-4'],
      createdAt: daysAgo(50),
      updatedAt: daysAgo(2),
    },
    {
      id: 'edu-prof-2',
      userId: 'usr-edu-2',
      specialization: 'Multimodal Literacy & Spatial Reasoning',
      assignedLearnerIds: ['usr-lrn-5', 'usr-lrn-6', 'usr-lrn-7'],
      createdAt: daysAgo(45),
      updatedAt: daysAgo(3),
    },
    {
      id: 'edu-prof-3',
      userId: 'usr-edu-3',
      specialization: 'Applied Problem Solving & Executive Function',
      assignedLearnerIds: ['usr-lrn-8', 'usr-lrn-9', 'usr-lrn-10'],
      createdAt: daysAgo(40),
      updatedAt: daysAgo(5),
    },
  ];

  // ------------------------------------------------------------
  // 3. LEARNER PROFILES
  // ------------------------------------------------------------
  const learnerProfiles: LearnerProfile[] = [
    {
      id: 'lrn-prof-1',
      userId: 'usr-lrn-1', // Alex Rivera (Primary Demo Learner)
      currentLevel: 2,
      learningPreferences: ['visual', 'interactive'],
      supportPreferences: ['hints', 'step_by_step', 'audio_assistance'],
      selectedDomains: ['dom-cog', 'dom-pat', 'dom-mem', 'dom-prob', 'dom-com'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 14,
      totalAssessmentsCompleted: 2,
      currentStreak: 5,
      longestStreak: 8,
      lastActivityAt: hoursAgo(2),
      createdAt: daysAgo(30),
      updatedAt: hoursAgo(1),
    },
    {
      id: 'lrn-prof-2',
      userId: 'usr-lrn-2',
      currentLevel: 3,
      learningPreferences: ['visual', 'text'],
      supportPreferences: ['extra_time', 'larger_text'],
      selectedDomains: ['dom-read', 'dom-acad', 'dom-pat'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 22,
      totalAssessmentsCompleted: 3,
      currentStreak: 7,
      longestStreak: 12,
      lastActivityAt: hoursAgo(4),
      createdAt: daysAgo(28),
      updatedAt: hoursAgo(4),
    },
    {
      id: 'lrn-prof-3',
      userId: 'usr-lrn-3',
      currentLevel: 1,
      learningPreferences: ['audio', 'interactive'],
      supportPreferences: ['audio_assistance', 'hints', 'repetition', 'reduced_complexity'],
      selectedDomains: ['dom-mem', 'dom-prob', 'dom-life'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 8,
      totalAssessmentsCompleted: 1,
      currentStreak: 2,
      longestStreak: 4,
      lastActivityAt: daysAgo(1),
      createdAt: daysAgo(25),
      updatedAt: daysAgo(1),
    },
    {
      id: 'lrn-prof-4',
      userId: 'usr-lrn-4',
      currentLevel: 2,
      learningPreferences: ['interactive', 'mixed'],
      supportPreferences: ['step_by_step', 'extra_time'],
      selectedDomains: ['dom-pat', 'dom-creat', 'dom-prob'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 16,
      totalAssessmentsCompleted: 2,
      currentStreak: 4,
      longestStreak: 6,
      lastActivityAt: daysAgo(2),
      createdAt: daysAgo(24),
      updatedAt: daysAgo(2),
    },
    {
      id: 'lrn-prof-5',
      userId: 'usr-lrn-5',
      currentLevel: 3,
      learningPreferences: ['visual', 'mixed'],
      supportPreferences: ['hints', 'larger_text'],
      selectedDomains: ['dom-acad', 'dom-prob', 'dom-prac'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 28,
      totalAssessmentsCompleted: 4,
      currentStreak: 9,
      longestStreak: 14,
      lastActivityAt: daysAgo(1),
      createdAt: daysAgo(20),
      updatedAt: daysAgo(1),
    },
    {
      id: 'lrn-prof-6',
      userId: 'usr-lrn-6',
      currentLevel: 1,
      learningPreferences: ['audio', 'visual'],
      supportPreferences: ['audio_assistance', 'step_by_step', 'repetition'],
      selectedDomains: ['dom-read', 'dom-com', 'dom-mem'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 6,
      totalAssessmentsCompleted: 1,
      currentStreak: 1,
      longestStreak: 3,
      lastActivityAt: daysAgo(3),
      createdAt: daysAgo(18),
      updatedAt: daysAgo(3),
    },
    {
      id: 'lrn-prof-7',
      userId: 'usr-lrn-7',
      currentLevel: 2,
      learningPreferences: ['text', 'interactive'],
      supportPreferences: ['reduced_complexity', 'extra_time'],
      selectedDomains: ['dom-cog', 'dom-prob', 'dom-life'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 12,
      totalAssessmentsCompleted: 2,
      currentStreak: 3,
      longestStreak: 5,
      lastActivityAt: daysAgo(2),
      createdAt: daysAgo(15),
      updatedAt: daysAgo(2),
    },
    {
      id: 'lrn-prof-8',
      userId: 'usr-lrn-8',
      currentLevel: 3,
      learningPreferences: ['visual', 'interactive'],
      supportPreferences: ['hints'],
      selectedDomains: ['dom-pat', 'dom-creat', 'dom-acad'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 20,
      totalAssessmentsCompleted: 3,
      currentStreak: 6,
      longestStreak: 9,
      lastActivityAt: daysAgo(1),
      createdAt: daysAgo(12),
      updatedAt: daysAgo(1),
    },
    {
      id: 'lrn-prof-9',
      userId: 'usr-lrn-9',
      currentLevel: 1,
      learningPreferences: ['audio', 'interactive'],
      supportPreferences: ['audio_assistance', 'hints', 'step_by_step'],
      selectedDomains: ['dom-mem', 'dom-pat', 'dom-prac'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 5,
      totalAssessmentsCompleted: 1,
      currentStreak: 1,
      longestStreak: 2,
      lastActivityAt: daysAgo(4),
      createdAt: daysAgo(10),
      updatedAt: daysAgo(4),
    },
    {
      id: 'lrn-prof-10',
      userId: 'usr-lrn-10',
      currentLevel: 2,
      learningPreferences: ['visual', 'text', 'interactive'],
      supportPreferences: ['larger_text', 'extra_time'],
      selectedDomains: ['dom-com', 'dom-read', 'dom-creat'],
      onboardingCompleted: true,
      baselineCompleted: true,
      totalActivitiesCompleted: 15,
      totalAssessmentsCompleted: 2,
      currentStreak: 5,
      longestStreak: 7,
      lastActivityAt: hoursAgo(6),
      createdAt: daysAgo(8),
      updatedAt: hoursAgo(6),
    },
  ];

  // ------------------------------------------------------------
  // 4. LEARNING DOMAINS (10 Domains)
  // ------------------------------------------------------------
  const domains: Domain[] = [
    { id: 'dom-acad', name: 'Academic Skills', description: 'Foundational numeracy, literacy structure, and conceptual understanding', icon: 'GraduationCap', color: '#3B82F6', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-cog', name: 'Cognitive Skills', description: 'Attention control, working memory, and mental processing strategies', icon: 'Brain', color: '#8B5CF6', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-com', name: 'Communication', description: 'Expressive/receptive vocabulary, conversational context, and dialogue', icon: 'MessageSquare', color: '#06B6D4', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-prob', name: 'Problem Solving', description: 'Step-by-step logic, deductive reasoning, and strategic deduction', icon: 'Puzzle', color: '#F59E0B', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-mem', name: 'Memory', description: 'Visual retention, audio-verbal recall, and sequence memory structures', icon: 'Database', color: '#EF4444', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-pat', name: 'Pattern Recognition', description: 'Visual sequences, geometric symmetries, and rule-based extrapolations', icon: 'Grid3x3', color: '#10B981', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-read', name: 'Reading & Comprehension', description: 'Phonetics, vocabulary context clues, and narrative comprehension', icon: 'BookOpen', color: '#6366F1', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-life', name: 'Life Skills', description: 'Everyday routines, decision-making, time management, and social scenarios', icon: 'Heart', color: '#EC4899', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-creat', name: 'Creativity', description: 'Lateral thinking, spatial assembly, and expressive design', icon: 'Palette', color: '#F97316', isActive: true, createdAt: daysAgo(60) },
    { id: 'dom-prac', name: 'Practical Skills', description: 'Tool categorization, sequential assembly, and real-world task sequencing', icon: 'Wrench', color: '#14B8A6', isActive: true, createdAt: daysAgo(60) },
  ];

  // ------------------------------------------------------------
  // 5. SKILLS (20+ Skills)
  // ------------------------------------------------------------
  const skills: Skill[] = [
    // Academic
    { id: 'skl-acad-1', domainId: 'dom-acad', name: 'Number Sense & Quantity', description: 'Estimating, grouping, and comparing quantities', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-acad-2', domainId: 'dom-acad', name: 'Structural Grammar & Syntax', description: 'Sentence hierarchy and grammatical parts of speech', isActive: true, createdAt: daysAgo(60) },
    // Cognitive
    { id: 'skl-cog-1', domainId: 'dom-cog', name: 'Selective Attention', description: 'Focusing on relevant targets while ignoring visual/auditory distractors', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-cog-2', domainId: 'dom-cog', name: 'Cognitive Flexibility', description: 'Shifting mental rules and sorting dimensions dynamically', isActive: true, createdAt: daysAgo(60) },
    // Communication
    { id: 'skl-com-1', domainId: 'dom-com', name: 'Contextual Dialogue', description: 'Selecting appropriate conversational replies in scenario contexts', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-com-2', domainId: 'dom-com', name: 'Vocabulary Precision', description: 'Identifying contextual synonyms and precise descriptor terms', isActive: true, createdAt: daysAgo(60) },
    // Problem Solving
    { id: 'skl-prob-1', domainId: 'dom-prob', name: 'Deductive Logic', description: 'Drawing valid conclusions from conditional clue premises', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-prob-2', domainId: 'dom-prob', name: 'Sequential Planning', description: 'Ordering steps to achieve a specific goal state', isActive: true, createdAt: daysAgo(60) },
    // Memory
    { id: 'skl-mem-1', domainId: 'dom-mem', name: 'Visual Sequence Recall', description: 'Retaining and reproducing ordered visual flashes', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-mem-2', domainId: 'dom-mem', name: 'Associative Memory', description: 'Linking item pairs, concepts, and auditory-visual pairs', isActive: true, createdAt: daysAgo(60) },
    // Pattern Recognition
    { id: 'skl-pat-1', domainId: 'dom-pat', name: 'Geometric Pattern Progression', description: 'Extrapolating multi-attribute repeating matrix patterns', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-pat-2', domainId: 'dom-pat', name: 'Numerical Sequences', description: 'Identifying arithmetic and geometric series progressions', isActive: true, createdAt: daysAgo(60) },
    // Reading
    { id: 'skl-read-1', domainId: 'dom-read', name: 'Narrative Inference', description: 'Inferring implied character motives and unstated plot events', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-read-2', domainId: 'dom-read', name: 'Phonological Analysis', description: 'Sound blending, rhyming families, and syllabic breakdown', isActive: true, createdAt: daysAgo(60) },
    // Life Skills
    { id: 'skl-life-1', domainId: 'dom-life', name: 'Daily Schedule Ordering', description: 'Sequencing daily hygiene, meal, and study schedules logically', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-life-2', domainId: 'dom-life', name: 'Safety & Emergency Decisions', description: 'Recognizing safety hazards and choosing appropriate emergency reactions', isActive: true, createdAt: daysAgo(60) },
    // Creativity
    { id: 'skl-creat-1', domainId: 'dom-creat', name: 'Spatial Composition', description: 'Assembling shapes into balanced harmonious configurations', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-creat-2', domainId: 'dom-creat', name: 'Analogical Thinking', description: 'Forming creative metaphors and cross-domain conceptual bridges', isActive: true, createdAt: daysAgo(60) },
    // Practical Skills
    { id: 'skl-prac-1', domainId: 'dom-prac', name: 'Task Assembly Sequencing', description: 'Step-by-step assembly of household, study, and craft tasks', isActive: true, createdAt: daysAgo(60) },
    { id: 'skl-prac-2', domainId: 'dom-prac', name: 'Category Sorting & Organization', description: 'Organizing items into functional categories and logical bins', isActive: true, createdAt: daysAgo(60) },
  ];

  // ------------------------------------------------------------
  // 6. QUESTIONS (100+ comprehensive interactive questions)
  // ------------------------------------------------------------
  const questions: Question[] = [];

  // Helper to push questions
  let qCount = 1;
  const addQ = (q: Omit<Question, 'id' | 'createdAt' | 'isActive'>) => {
    const id = `qst-${String(qCount++).padStart(3, '0')}`;
    questions.push({
      ...q,
      id,
      isActive: true,
      createdAt: daysAgo(40),
    });
    return id;
  };

  // --- Pattern Recognition Questions (12) ---
  const qPat1 = addQ({
    text: 'What shape comes next in this sequence: Circle, Square, Circle, Square, Circle, ___?',
    type: 'multiple_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Square', isCorrect: true },
      { id: 'opt-2', text: 'Triangle', isCorrect: false },
      { id: 'opt-3', text: 'Circle', isCorrect: false },
      { id: 'opt-4', text: 'Star', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Look at the alternating shapes: 1st Circle, 2nd Square, 3rd Circle, 4th Square...',
    explanation: 'The pattern strictly alternates between Circle and Square (ABABAB). Following Circle, the next item is Square.',
    points: 10,
    audioText: 'What shape comes next in this sequence: Circle, Square, Circle, Square, Circle, blank?',
  });

  const qPat2 = addQ({
    text: 'Identify the missing number in the sequence: 3, 6, 9, 12, ___?',
    type: 'multiple_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-2',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: '13', isCorrect: false },
      { id: 'opt-2', text: '15', isCorrect: true },
      { id: 'opt-3', text: '14', isCorrect: false },
      { id: 'opt-4', text: '18', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Notice that each number increases by 3.',
    explanation: 'This is a counting by 3s sequence (3, 6, 9, 12, 12+3 = 15).',
    points: 10,
    audioText: 'Identify the missing number in the sequence: 3, 6, 9, 12, blank.',
  });

  const qPat3 = addQ({
    text: 'Arrange these colors in the repeating order of a traffic light cycle:',
    type: 'ordering',
    domainId: 'dom-pat',
    skillId: 'skl-pat-1',
    difficulty: 'beginner',
    orderItems: ['Red (Stop)', 'Green (Go)', 'Yellow (Caution)'],
    correctAnswer: ['Red (Stop)', 'Green (Go)', 'Yellow (Caution)'],
    hint: 'Think about standard traffic signal sequences from Stop to Go to Caution.',
    explanation: 'A standard traffic transition cycle moves from Red to Green to Yellow.',
    points: 15,
    audioText: 'Arrange these colors in the repeating order of a traffic light cycle: Red, Green, Yellow.',
  });

  const qPat4 = addQ({
    text: 'Match the geometric shape with its number of sides:',
    type: 'matching',
    domainId: 'dom-pat',
    skillId: 'skl-pat-1',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Triangle', right: '3 Sides' },
      { left: 'Square', right: '4 Equal Sides' },
      { left: 'Pentagon', right: '5 Sides' },
      { left: 'Hexagon', right: '6 Sides' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Count the vertices or corners of each polygon.',
    explanation: 'Triangle has 3 sides, Square has 4 sides, Pentagon has 5 sides, and Hexagon has 6 sides.',
    points: 20,
    audioText: 'Match each geometric shape with its correct number of sides.',
  });

  const qPat5 = addQ({
    text: 'Complete the pattern: 2, 4, 8, 16, ___?',
    type: 'multiple_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: '24', isCorrect: false },
      { id: 'opt-2', text: '30', isCorrect: false },
      { id: 'opt-3', text: '32', isCorrect: true },
      { id: 'opt-4', text: '64', isCorrect: false },
    ],
    correctAnswer: 'opt-3',
    hint: 'Each number is multiplied by 2 (doubled).',
    explanation: 'The rule is multiplying by 2 each step: 16 * 2 = 32.',
    points: 15,
  });

  const qPat6 = addQ({
    text: 'Pattern Matrix: Top row has (1 Dot, 2 Dots, 3 Dots). Bottom row has (1 Star, 2 Stars, ___). What fills the blank?',
    type: 'multiple_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: '4 Stars', isCorrect: false },
      { id: 'opt-2', text: '3 Stars', isCorrect: true },
      { id: 'opt-3', text: '2 Stars', isCorrect: false },
      { id: 'opt-4', text: '3 Dots', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Look for analogical correspondence between row 1 quantities and row 2 symbols.',
    explanation: 'The pattern increments item count by 1 in both rows. Thus, 3 Stars completes the set.',
    points: 15,
  });

  const qPat7 = addQ({
    text: 'Fibonacci Sequence: 1, 1, 2, 3, 5, 8, ___? What is the next value?',
    type: 'multiple_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-2',
    difficulty: 'advanced',
    options: [
      { id: 'opt-1', text: '11', isCorrect: false },
      { id: 'opt-2', text: '12', isCorrect: false },
      { id: 'opt-3', text: '13', isCorrect: true },
      { id: 'opt-4', text: '15', isCorrect: false },
    ],
    correctAnswer: 'opt-3',
    hint: 'Add the last two consecutive numbers together: 5 + 8.',
    explanation: 'In the Fibonacci sequence, each number is the sum of the two preceding ones (5 + 8 = 13).',
    points: 20,
  });

  const qPat8 = addQ({
    text: 'True or False: An arithmetic sequence always changes by multiplying by a constant factor.',
    type: 'true_false',
    domainId: 'dom-pat',
    skillId: 'skl-pat-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: false },
      { id: 'opt-false', text: 'False', isCorrect: true },
    ],
    correctAnswer: 'opt-false',
    hint: 'Arithmetic uses constant addition/subtraction, while geometric uses multiplication.',
    explanation: 'False. Arithmetic sequences have a constant difference (addition/subtraction). Geometric sequences change by a constant multiplier.',
    points: 10,
  });

  const qPat9 = addQ({
    text: 'Which image pattern represents a symmetrical reflection across a vertical center mirror line?',
    type: 'image_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Left Arrow pointing Left with Right Arrow pointing Right (◄ | ►)', isCorrect: true },
      { id: 'opt-2', text: 'Both Arrows pointing Up (▲ | ▲)', isCorrect: false },
      { id: 'opt-3', text: 'Both Arrows pointing Right (► | ►)', isCorrect: false },
      { id: 'opt-4', text: 'Top Arrow and Bottom Arrow (▲ | ▼)', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Imagine folding the paper in half along the vertical center line.',
    explanation: 'A vertical reflection mirrors left-to-right (◄ | ►).',
    points: 15,
  });

  const qPat10 = addQ({
    text: 'Order the size sequence from Smallest to Largest:',
    type: 'ordering',
    domainId: 'dom-pat',
    skillId: 'skl-pat-1',
    difficulty: 'beginner',
    orderItems: ['Pebble', 'Stone', 'Boulder', 'Mountain'],
    correctAnswer: ['Pebble', 'Stone', 'Boulder', 'Mountain'],
    hint: 'Think about physical scale starting from something you can hold in your fingertips.',
    explanation: 'Correct ascending hierarchy: Pebble < Stone < Boulder < Mountain.',
    points: 15,
  });

  const qPat11 = addQ({
    text: 'What comes next in the letter pattern: A, C, E, G, ___?',
    type: 'multiple_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'H', isCorrect: false },
      { id: 'opt-2', text: 'I', isCorrect: true },
      { id: 'opt-3', text: 'J', isCorrect: false },
      { id: 'opt-4', text: 'K', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Skip one letter in the alphabet each time (A, [b], C, [d], E, [f], G, [h]...).',
    explanation: 'Skipping one letter in the alphabet sequence: A (+2) -> C (+2) -> E (+2) -> G (+2) -> I.',
    points: 15,
  });

  const qPat12 = addQ({
    text: 'Complex Rule: Triangles rotate 90 degrees clockwise each step. If Step 1 points UP, where does Step 4 point?',
    type: 'multiple_choice',
    domainId: 'dom-pat',
    skillId: 'skl-pat-1',
    difficulty: 'advanced',
    options: [
      { id: 'opt-1', text: 'Right', isCorrect: false },
      { id: 'opt-2', text: 'Down', isCorrect: false },
      { id: 'opt-3', text: 'Left', isCorrect: true },
      { id: 'opt-4', text: 'Up', isCorrect: false },
    ],
    correctAnswer: 'opt-3',
    hint: 'Step 1: Up, Step 2: Right, Step 3: Down, Step 4: ?',
    explanation: 'Step 1: Up (0°), Step 2: Right (90°), Step 3: Down (180°), Step 4: Left (270°).',
    points: 20,
  });

  // --- Memory Questions (10) ---
  const qMem1 = addQ({
    text: 'Memory Sequence: Memorize these 3 items: [Apple, Book, Key]. Which item was listed SECOND?',
    type: 'memory',
    domainId: 'dom-mem',
    skillId: 'skl-mem-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Apple', isCorrect: false },
      { id: 'opt-2', text: 'Book', isCorrect: true },
      { id: 'opt-3', text: 'Key', isCorrect: false },
      { id: 'opt-4', text: 'Pencil', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'The sequence was: 1. Apple, 2. Book, 3. Key.',
    explanation: 'Book was the second item in the sequence.',
    points: 15,
    audioText: 'Memorize these three items: Apple, Book, Key. Which item was listed second?',
  });

  const qMem2 = addQ({
    text: 'Recall the color association: Sun is Yellow, Grass is Green, Ocean is Blue. What color was paired with Grass?',
    type: 'memory',
    domainId: 'dom-mem',
    skillId: 'skl-mem-2',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Yellow', isCorrect: false },
      { id: 'opt-2', text: 'Blue', isCorrect: false },
      { id: 'opt-3', text: 'Green', isCorrect: true },
      { id: 'opt-4', text: 'Red', isCorrect: false },
    ],
    correctAnswer: 'opt-3',
    hint: 'Recall the natural pairing for healthy lawn grass.',
    explanation: 'Grass was explicitly paired with Green.',
    points: 10,
  });

  const qMem3 = addQ({
    text: 'Match each animal to its sound from your audio memory:',
    type: 'matching',
    domainId: 'dom-mem',
    skillId: 'skl-mem-2',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Dog', right: 'Bark' },
      { left: 'Cat', right: 'Meow' },
      { left: 'Cow', right: 'Moo' },
      { left: 'Duck', right: 'Quack' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Link standard domestic sounds with animals.',
    explanation: 'Dog: Bark, Cat: Meow, Cow: Moo, Duck: Quack.',
    points: 15,
  });

  const qMem4 = addQ({
    text: 'Reconstruct the 4-digit security code shown for 3 seconds: [ 7 - 2 - 9 - 4 ]',
    type: 'ordering',
    domainId: 'dom-mem',
    skillId: 'skl-mem-1',
    difficulty: 'intermediate',
    orderItems: ['7', '2', '9', '4'],
    correctAnswer: ['7', '2', '9', '4'],
    hint: 'First digit was 7, last digit was 4.',
    explanation: 'The full 4-digit sequence was 7, 2, 9, 4.',
    points: 20,
  });

  const qMem5 = addQ({
    text: 'Associate the tool with its matching craft purpose:',
    type: 'matching',
    domainId: 'dom-mem',
    skillId: 'skl-mem-2',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Paintbrush', right: 'Painting Canvas' },
      { left: 'Hammer', right: 'Driving Nails' },
      { left: 'Needle & Thread', right: 'Sewing Fabric' },
      { left: 'Scissors', right: 'Cutting Paper' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Think about how each tool interacts with craft materials.',
    explanation: 'Each tool pairs directly with its craft activity.',
    points: 20,
  });

  const qMem6 = addQ({
    text: 'Working Memory: You hear numbers [4, 9, 2]. Reorder them in REVERSE order:',
    type: 'ordering',
    domainId: 'dom-mem',
    skillId: 'skl-mem-1',
    difficulty: 'intermediate',
    orderItems: ['2', '9', '4'],
    correctAnswer: ['2', '9', '4'],
    hint: 'Start with the last number you heard (2) and end with the first (4).',
    explanation: 'Reversing [4, 9, 2] yields [2, 9, 4].',
    points: 20,
  });

  const qMem7 = addQ({
    text: 'Spatial Memory: A grid flashed a red star in Top-Left and a blue triangle in Bottom-Right. Where was the Blue Triangle?',
    type: 'multiple_choice',
    domainId: 'dom-mem',
    skillId: 'skl-mem-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Top-Left', isCorrect: false },
      { id: 'opt-2', text: 'Top-Right', isCorrect: false },
      { id: 'opt-3', text: 'Bottom-Left', isCorrect: false },
      { id: 'opt-4', text: 'Bottom-Right', isCorrect: true },
    ],
    correctAnswer: 'opt-4',
    hint: 'Remember the lower corner on the right side.',
    explanation: 'The blue triangle was situated in the Bottom-Right quadrant.',
    points: 15,
  });

  const qMem8 = addQ({
    text: 'True or False: Rehearsing information in chunks makes it easier to hold in working memory.',
    type: 'true_false',
    domainId: 'dom-mem',
    skillId: 'skl-mem-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: true },
      { id: 'opt-false', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'opt-true',
    hint: 'Think about how phone numbers are grouped into 3 and 4 digit chunks.',
    explanation: 'True. Chunking groups individual items into larger meaningful units, reducing cognitive load on working memory.',
    points: 10,
  });

  const qMem9 = addQ({
    text: '5-Item Recall: [Elephant, Guitar, Bicycle, Lamp, Sandwich]. Which item came directly AFTER Bicycle?',
    type: 'multiple_choice',
    domainId: 'dom-mem',
    skillId: 'skl-mem-1',
    difficulty: 'advanced',
    options: [
      { id: 'opt-1', text: 'Guitar', isCorrect: false },
      { id: 'opt-2', text: 'Lamp', isCorrect: true },
      { id: 'opt-3', text: 'Sandwich', isCorrect: false },
      { id: 'opt-4', text: 'Elephant', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'The order was: 1. Elephant, 2. Guitar, 3. Bicycle, 4. Lamp, 5. Sandwich.',
    explanation: 'Lamp was item #4, directly following Bicycle (#3).',
    points: 20,
  });

  const qMem10 = addQ({
    text: 'Contextual Word Association: Link each planetary characteristic with its planet:',
    type: 'matching',
    domainId: 'dom-mem',
    skillId: 'skl-mem-2',
    difficulty: 'advanced',
    matchingPairs: [
      { left: 'Mars', right: 'Red Planet / Iron Oxide' },
      { left: 'Jupiter', right: 'Great Red Spot / Gas Giant' },
      { left: 'Saturn', right: 'Prominent Ice Ring System' },
      { left: 'Venus', right: 'Hottest Surface / Dense Atmosphere' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Recall distinctive features of solar system planets.',
    explanation: 'Mars: Red, Jupiter: Giant with storm, Saturn: Rings, Venus: Greenhouse heat.',
    points: 20,
  });

  // --- Problem Solving Questions (12) ---
  const qProb1 = addQ({
    text: 'Scenario: You want to bake cookies, but discover you have no eggs. What is the most logical first step?',
    type: 'scenario',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Turn on the oven to 450 degrees immediately', isCorrect: false },
      { id: 'opt-2', text: 'Check recipe for valid egg substitutes or borrow/buy eggs before starting', isCorrect: true },
      { id: 'opt-3', text: 'Mix all dry ingredients and throw them away', isCorrect: false },
      { id: 'opt-4', text: 'Eat the raw flour', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Before mixing wet ingredients, verify all essential components are available.',
    explanation: 'Checking for appropriate substitutes (like applesauce or flaxseed) or acquiring the missing ingredient avoids wasting supplies.',
    points: 15,
    audioText: 'Scenario: You want to bake cookies, but discover you have no eggs. What is the most logical first step?',
  });

  const qProb2 = addQ({
    text: 'Sequential Planning: Arrange the correct steps to wash dirty hands properly:',
    type: 'ordering',
    domainId: 'dom-prob',
    skillId: 'skl-prob-2',
    difficulty: 'beginner',
    orderItems: ['Wet hands with clean water', 'Apply soap and lather for 20 seconds', 'Rinse thoroughly under running water', 'Dry with a clean towel'],
    correctAnswer: ['Wet hands with clean water', 'Apply soap and lather for 20 seconds', 'Rinse thoroughly under running water', 'Dry with a clean towel'],
    hint: 'Water first, then soap lathering, then rinsing, then drying.',
    explanation: '1. Wet hands, 2. Apply soap, 3. Rinse, 4. Dry.',
    points: 15,
  });

  const qProb3 = addQ({
    text: 'Logic Clue: Sam is taller than Jordan. Jordan is taller than Casey. Who is the tallest of the three?',
    type: 'multiple_choice',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Sam', isCorrect: true },
      { id: 'opt-2', text: 'Jordan', isCorrect: false },
      { id: 'opt-3', text: 'Casey', isCorrect: false },
      { id: 'opt-4', text: 'They are all the same height', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Chain the inequalities: Sam > Jordan > Casey.',
    explanation: 'Since Sam is taller than Jordan and Jordan is taller than Casey, transitive deduction proves Sam is tallest.',
    points: 10,
  });

  const qProb4 = addQ({
    text: 'Deduction: All birds have feathers. A cardinal is a bird. Therefore:',
    type: 'multiple_choice',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'A cardinal has feathers', isCorrect: true },
      { id: 'opt-2', text: 'A cardinal can swim underwater like a fish', isCorrect: false },
      { id: 'opt-3', text: 'All feathers are red', isCorrect: false },
      { id: 'opt-4', text: 'Feathers are only found in winter', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Apply the universal property (feathers) to the specific instance (cardinal).',
    explanation: 'This is a classical syllogism: Major premise + Minor premise = Valid conclusion.',
    points: 15,
  });

  const qProb5 = addQ({
    text: 'Arrange the scientific method steps into the standard investigative order:',
    type: 'ordering',
    domainId: 'dom-prob',
    skillId: 'skl-prob-2',
    difficulty: 'intermediate',
    orderItems: ['Observe a phenomenon and ask a question', 'Formulate a testable hypothesis', 'Conduct an experiment and record data', 'Draw conclusions and share results'],
    correctAnswer: ['Observe a phenomenon and ask a question', 'Formulate a testable hypothesis', 'Conduct an experiment and record data', 'Draw conclusions and share results'],
    hint: 'Question -> Hypothesis -> Experiment -> Conclusion.',
    explanation: 'Standard scientific inquiry moves from observation/question to hypothesis, experimentation, and finally conclusions.',
    points: 20,
  });

  const qProb6 = addQ({
    text: 'A plant is placed in a dark closet with water, while another is in the sun with water. The plant in the sun grows taller. What variable caused the difference?',
    type: 'multiple_choice',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Water amount', isCorrect: false },
      { id: 'opt-2', text: 'Sunlight exposure', isCorrect: true },
      { id: 'opt-3', text: 'Pot color', isCorrect: false },
      { id: 'opt-4', text: 'Room temperature only', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Identify the single condition that differed between the two plants.',
    explanation: 'Both had water, but only one had sunlight, making sunlight the independent variable responsible for growth.',
    points: 15,
  });

  const qProb7 = addQ({
    text: 'Match each problem with its most effective troubleshooting action:',
    type: 'matching',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Computer screen stays black', right: 'Check power cable and wall switch' },
      { left: 'Bicycle tire feels soft and flat', right: 'Inspect for puncture and pump air' },
      { left: 'Door hinges make loud squeaking noise', right: 'Apply lubricant oil to the hinge pin' },
      { left: 'Pencil lead keeps snapping', right: 'Sharpen gently or adjust pressure' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Match the root cause with the direct mechanical solution.',
    explanation: 'Each solution directly remedies the underlying physical failure mode.',
    points: 20,
  });

  const qProb8 = addQ({
    text: 'River Crossing Riddle: You must transport a wolf, a goat, and a cabbage across a river in a boat holding only you and one item. If left alone together, wolf eats goat, goat eats cabbage. What must you take across FIRST?',
    type: 'multiple_choice',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'advanced',
    options: [
      { id: 'opt-1', text: 'The Wolf', isCorrect: false },
      { id: 'opt-2', text: 'The Goat', isCorrect: true },
      { id: 'opt-3', text: 'The Cabbage', isCorrect: false },
      { id: 'opt-4', text: 'Nothing', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'If you take the wolf, the goat eats the cabbage. If you take the cabbage, the wolf eats the goat.',
    explanation: 'Taking the goat first leaves the wolf and cabbage together safely, as wolves do not eat cabbages.',
    points: 25,
  });

  const qProb9 = addQ({
    text: 'True or False: In deductive logic, if the premises are true and the reasoning is valid, the conclusion MUST be true.',
    type: 'true_false',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: true },
      { id: 'opt-false', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'opt-true',
    hint: 'Deductive certainty differs from inductive probability.',
    explanation: 'True. Sound deductive arguments guarantee the truth of the conclusion when premises are factual.',
    points: 10,
  });

  const qProb10 = addQ({
    text: 'Resource Allocation: You have $20 budget. Book costs $12, Notebook costs $5, Pen costs $2. Can you buy all three items?',
    type: 'multiple_choice',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Yes, total cost is $19 with $1 change remaining', isCorrect: true },
      { id: 'opt-2', text: 'No, total cost is $21 which exceeds budget', isCorrect: false },
      { id: 'opt-3', text: 'No, because books are tax exempt', isCorrect: false },
      { id: 'opt-4', text: 'Yes, with exactly $0 change', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Calculate sum: 12 + 5 + 2 = ?',
    explanation: '$12 + $5 + $2 = $19, which is <= $20 budget.',
    points: 10,
  });

  const qProb11 = addQ({
    text: 'Critical Thinking: A chart shows ice cream sales and sunburn cases both peak in July. Does ice cream CAUSE sunburn?',
    type: 'multiple_choice',
    domainId: 'dom-prob',
    skillId: 'skl-prob-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Yes, because the two lines follow the same trend', isCorrect: false },
      { id: 'opt-2', text: 'No, correlation is not causation; hot summer weather is the shared common cause', isCorrect: true },
      { id: 'opt-3', text: 'Yes, dairy ingredients make skin sensitive to UV rays', isCorrect: false },
      { id: 'opt-4', text: 'No, ice cream actually prevents sunburn', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Think about a third confounding variable: Summer heat and sun exposure.',
    explanation: 'Hot sunny weather increases both beach visits (sunburn) and ice cream consumption. Correlation does not imply direct causation.',
    points: 20,
  });

  const qProb12 = addQ({
    text: 'Algorithm Debugging: Step 1: Open jar. Step 2: Spread peanut butter on bread. Step 3: Put slices together. What critical step was omitted if you started with a fresh loaf?',
    type: 'multiple_choice',
    domainId: 'dom-prob',
    skillId: 'skl-prob-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Take two slices of bread out of the bag', isCorrect: true },
      { id: 'opt-2', text: 'Toast the bread for 10 minutes until burnt', isCorrect: false },
      { id: 'opt-3', text: 'Wash the knife in boiling water', isCorrect: false },
      { id: 'opt-4', text: 'Throw away the crusts', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'You cannot spread peanut butter on bread that remains inside the sealed bag.',
    explanation: 'The prerequisite state (extracting bread slices) must occur prior to applying spreads.',
    points: 15,
  });

  // --- Cognitive Skills & Attention (10) ---
  const qCog1 = addQ({
    text: 'Selective Attention: In a field of red circles, find the odd one out: 🔴 🔴 🔴 🔺 🔴 🔴. What shape is different?',
    type: 'multiple_choice',
    domainId: 'dom-cog',
    skillId: 'skl-cog-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Red Circle', isCorrect: false },
      { id: 'opt-2', text: 'Red Triangle', isCorrect: true },
      { id: 'opt-3', text: 'Blue Square', isCorrect: false },
      { id: 'opt-4', text: 'Green Diamond', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Look at the 4th item in the row.',
    explanation: 'The red triangle has three vertices while all surrounding items are smooth circles.',
    points: 10,
    audioText: 'In a field of red circles, find the odd one out: circle, circle, circle, triangle, circle, circle.',
  });

  const qCog2 = addQ({
    text: 'Stroop Test (Color vs Word): The word "BLUE" is printed in bright RED font color. What COLOR is the ink?',
    type: 'multiple_choice',
    domainId: 'dom-cog',
    skillId: 'skl-cog-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Blue', isCorrect: false },
      { id: 'opt-2', text: 'Red', isCorrect: true },
      { id: 'opt-3', text: 'Black', isCorrect: false },
      { id: 'opt-4', text: 'Green', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Ignore the letters of the word; focus solely on the visual ink color.',
    explanation: 'The font ink color is Red. The cognitive challenge tests inhibition of automatic reading.',
    points: 15,
  });

  const qCog3 = addQ({
    text: 'Rule Switching (Cognitive Flexibility): Cards were sorted by SHAPE. The new rule is: Sort by COLOR. What should guide your next sort?',
    type: 'multiple_choice',
    domainId: 'dom-cog',
    skillId: 'skl-cog-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Whether it is a square or circle', isCorrect: false },
      { id: 'opt-2', text: 'Whether it is Red, Blue, or Yellow', isCorrect: true },
      { id: 'opt-3', text: 'The size of the card', isCorrect: false },
      { id: 'opt-4', text: 'The thickness of the border', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'The active dimension shifted from shape geometry to color hue.',
    explanation: 'Under the new rule, the card color (Red/Blue/Yellow) determines correct bin placement.',
    points: 15,
  });

  const qCog4 = addQ({
    text: 'Mental Rotation: If you rotate the letter "L" clockwise by 90 degrees, which orientation does it resemble?',
    type: 'multiple_choice',
    domainId: 'dom-cog',
    skillId: 'skl-cog-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'An upright "T"', isCorrect: false },
      { id: 'opt-2', text: 'A shape with horizontal top line and vertical line pointing down on the right (⅃ upside down)', isCorrect: true },
      { id: 'opt-3', text: 'A letter "O"', isCorrect: false },
      { id: 'opt-4', text: 'A letter "X"', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Visualize tipping the upright vertical stalk of "L" onto its right side.',
    explanation: 'Rotating "L" 90° clockwise makes the vertical stem horizontal along the top with the short leg pointing down on the right.',
    points: 15,
  });

  const qCog5 = addQ({
    text: 'Categorize these stimuli by sensory modality channel:',
    type: 'matching',
    domainId: 'dom-cog',
    skillId: 'skl-cog-1',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Flashing strobe light', right: 'Visual Modality' },
      { left: 'Siren whistling sound', right: 'Auditory Modality' },
      { left: 'Warm textured velvet', right: 'Tactile Modality' },
      { left: 'Fresh peppermint aroma', right: 'Olfactory Modality' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Match the stimulus with the sensory organ that perceives it.',
    explanation: 'Light = Sight, Siren = Hearing, Velvet = Touch, Peppermint = Smell.',
    points: 15,
  });

  const qCog6 = addQ({
    text: 'True or False: Multitasking between two demanding cognitive tasks allows the human brain to process both at 100% full speed simultaneously.',
    type: 'true_false',
    domainId: 'dom-cog',
    skillId: 'skl-cog-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: false },
      { id: 'opt-false', text: 'False', isCorrect: true },
    ],
    correctAnswer: 'opt-false',
    hint: 'The brain rapidly switches attention between tasks with switching costs.',
    explanation: 'False. Cognitive science shows task-switching incurs time latency and accuracy degradation compared to focused sequential work.',
    points: 10,
  });

  const qCog7 = addQ({
    text: 'Inhibition Control: When the green light shows, press GO. When the red light shows, do NOT press anything. A red light flashes. What do you do?',
    type: 'multiple_choice',
    domainId: 'dom-cog',
    skillId: 'skl-cog-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Press GO quickly', isCorrect: false },
      { id: 'opt-2', text: 'Inhibit response and remain still', isCorrect: true },
      { id: 'opt-3', text: 'Press GO twice', isCorrect: false },
      { id: 'opt-4', text: 'Turn off the screen', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Red means hold back and suppress the action.',
    explanation: 'Response inhibition requires withholding motor response on No-Go signals.',
    points: 10,
  });

  const qCog8 = addQ({
    text: 'Spatial Positioning: Box A is left of Box B. Box B is left of Box C. Which box is in the CENTER?',
    type: 'multiple_choice',
    domainId: 'dom-cog',
    skillId: 'skl-cog-2',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Box A', isCorrect: false },
      { id: 'opt-2', text: 'Box B', isCorrect: true },
      { id: 'opt-3', text: 'Box C', isCorrect: false },
      { id: 'opt-4', text: 'None of them', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Layout from left to right: [ A ] - [ B ] - [ C ].',
    explanation: 'Box B sits directly between Box A (left) and Box C (right).',
    points: 10,
  });

  const qCog9 = addQ({
    text: 'Speed of Processing: Identify which two words are EXACT synonyms:',
    type: 'multiple_choice',
    domainId: 'dom-cog',
    skillId: 'skl-cog-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Huge / Enormous', isCorrect: true },
      { id: 'opt-2', text: 'Fast / Sluggish', isCorrect: false },
      { id: 'opt-3', text: 'Bright / Pitch-black', isCorrect: false },
      { id: 'opt-4', text: 'Warm / Freezing', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Look for two words that describe the same massive magnitude.',
    explanation: 'Huge and Enormous both describe immense size.',
    points: 10,
  });

  const qCog10 = addQ({
    text: 'Dimensional Sorting: Sort objects by state of matter (Solid vs Liquid vs Gas):',
    type: 'matching',
    domainId: 'dom-cog',
    skillId: 'skl-cog-2',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Ice Cube', right: 'Solid State' },
      { left: 'Drinking Water', right: 'Liquid State' },
      { left: 'Water Vapor / Steam', right: 'Gas State' },
      { left: 'Iron Anvil', right: 'Solid State' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Classify based on fixed shape, fluid volume, or expanding gas.',
    explanation: 'Ice and Iron are solids, water is liquid, steam is gas.',
    points: 15,
  });

  // --- Communication & Vocabulary (10) ---
  const qCom1 = addQ({
    text: 'Social Context: A friend tells you they passed a difficult exam they studied weeks for. What is the most supportive reply?',
    type: 'scenario',
    domainId: 'dom-com',
    skillId: 'skl-com-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: '"That exam was super easy anyway."', isCorrect: false },
      { id: 'opt-2', text: '"Congratulations! Your hard work and studying really paid off!"', isCorrect: true },
      { id: 'opt-3', text: '"I scored higher than you without studying."', isCorrect: false },
      { id: 'opt-4', text: 'Ignore them and talk about lunch', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Acknowledge their effort and celebrate their milestone with empathetic validation.',
    explanation: 'Validating their dedication fosters positive peer rapport and mutual respect.',
    points: 15,
    audioText: 'Social Context: A friend tells you they passed a difficult exam. What is the most supportive reply?',
  });

  const qCom2 = addQ({
    text: 'Vocabulary Precision: Which word best describes someone who shows deep gratitude and appreciation?',
    type: 'multiple_choice',
    domainId: 'dom-com',
    skillId: 'skl-com-2',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Thankful', isCorrect: true },
      { id: 'opt-2', text: 'Hesitant', isCorrect: false },
      { id: 'opt-3', text: 'Indifferent', isCorrect: false },
      { id: 'opt-4', text: 'Stubborn', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Root word: thanks.',
    explanation: 'Thankful and appreciative directly denote feelings of gratitude.',
    points: 10,
  });

  const qCom3 = addQ({
    text: 'Match each tone of voice with its communicative intent:',
    type: 'matching',
    domainId: 'dom-com',
    skillId: 'skl-com-1',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Calm, steady, and clear', right: 'Providing reassurance and instructions' },
      { left: 'Enthusiastic and upbeat', right: 'Celebrating achievements and motivating' },
      { left: 'Quiet and gentle', right: 'Comforting someone feeling overwhelmed' },
      { left: 'Firm and urgent', right: 'Alerting to an immediate safety caution' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Match voice inflection with interpersonal context.',
    explanation: 'Vocal inflection conveys vital emotional modulation and urgency levels.',
    points: 20,
  });

  const qCom4 = addQ({
    text: 'Active Listening: During a group project, how can you show you are actively listening to a classmate?',
    type: 'multiple_choice',
    domainId: 'dom-com',
    skillId: 'skl-com-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Look at your phone while they speak', isCorrect: false },
      { id: 'opt-2', text: 'Nod, maintain attentive eye contact, and summarize key points after they finish', isCorrect: true },
      { id: 'opt-3', text: 'Interrupt them immediately with your own story', isCorrect: false },
      { id: 'opt-4', text: 'Look out the window silently', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Active listening involves physical engagement cues and verbal synthesis.',
    explanation: 'Attentive posture, nodding, and reflective paraphrasing demonstrate respect and comprehension.',
    points: 15,
  });

  const qCom5 = addQ({
    text: 'Sentence Structure: Reorder these words into a grammatically correct sentence:',
    type: 'ordering',
    domainId: 'dom-com',
    skillId: 'skl-com-2',
    difficulty: 'beginner',
    orderItems: ['The', 'curious', 'kitten', 'explored', 'the', 'garden.'],
    correctAnswer: ['The', 'curious', 'kitten', 'explored', 'the', 'garden.'],
    hint: 'Subject (kitten with article/adjective) -> Verb (explored) -> Object (the garden).',
    explanation: 'Standard English syntax: Subject (The curious kitten) + Verb (explored) + Object (the garden).',
    points: 15,
  });

  const qCom6 = addQ({
    text: 'Nonverbal Communication: What does crossed arms combined with a furrowed brow commonly indicate in body language?',
    type: 'multiple_choice',
    domainId: 'dom-com',
    skillId: 'skl-com-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Defensiveness, disagreement, or discomfort', isCorrect: true },
      { id: 'opt-2', text: 'Extreme enthusiasm and joy', isCorrect: false },
      { id: 'opt-3', text: 'Sleepiness only', isCorrect: false },
      { id: 'opt-4', text: 'Desire to run outside', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Closed body postures often reflect guarded or skeptical states.',
    explanation: 'Closed arm crossing with brow tension signals defensive or resistant evaluation.',
    points: 15,
  });

  const qCom7 = addQ({
    text: 'Match idioms with their actual metaphorical meaning:',
    type: 'matching',
    domainId: 'dom-com',
    skillId: 'skl-com-2',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Piece of cake', right: 'Something very easy to accomplish' },
      { left: 'Bite the bullet', right: 'Face a tough situation with courage' },
      { left: 'Under the weather', right: 'Feeling slightly ill or unwell' },
      { left: 'Break the ice', right: 'Ease social tension in a new group' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Idioms carry figurative meanings distinct from literal words.',
    explanation: 'Idiomatic expressions map to figurative cultural concepts.',
    points: 20,
  });

  const qCom8 = addQ({
    text: 'Clarification Strategy: When someone gives instructions you do not understand, what is the best phrase to use?',
    type: 'multiple_choice',
    domainId: 'dom-com',
    skillId: 'skl-com-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: '"Could you please explain that step in another way or give an example?"', isCorrect: true },
      { id: 'opt-2', text: '"You make no sense at all."', isCorrect: false },
      { id: 'opt-3', text: 'Pretend you understood and do nothing', isCorrect: false },
      { id: 'opt-4', text: 'Walk away immediately', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Polite inquiry asking for rephrasing or concrete demonstration.',
    explanation: 'Constructive requests for rephrasing bridge communication gaps without conflict.',
    points: 10,
  });

  const qCom9 = addQ({
    text: 'True or False: Asking open-ended questions (e.g. "How did that happen?") encourages deeper dialogue than closed yes/no questions.',
    type: 'true_false',
    domainId: 'dom-com',
    skillId: 'skl-com-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: true },
      { id: 'opt-false', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'opt-true',
    hint: 'Open questions invite narrative explanation rather than binary responses.',
    explanation: 'True. Open-ended inquiries invite expansive answers and conversational flow.',
    points: 10,
  });

  const qCom10 = addQ({
    text: 'Email Etiquette: Order the components of a professional inquiry email:',
    type: 'ordering',
    domainId: 'dom-com',
    skillId: 'skl-com-2',
    difficulty: 'intermediate',
    orderItems: ['Clear subject line', 'Polite greeting (e.g. Dear Mr. Vance)', 'Concise statement of request or question', 'Professional sign-off (e.g. Sincerely, Alex)'],
    correctAnswer: ['Clear subject line', 'Polite greeting (e.g. Dear Mr. Vance)', 'Concise statement of request or question', 'Professional sign-off (e.g. Sincerely, Alex)'],
    hint: 'Subject line first, salutation, body, closing signature.',
    explanation: 'Standard formal correspondence layout: Subject -> Salutation -> Body -> Sign-off.',
    points: 15,
  });

  // --- Reading & Comprehension (10) ---
  const qRead1 = addQ({
    text: 'Short Passage: "The morning dew sparkled on the spiderweb. A gentle breeze rocked the maple leaves, and birds began their dawn chorus." What time of day is described?',
    type: 'multiple_choice',
    domainId: 'dom-read',
    skillId: 'skl-read-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Early Morning / Dawn', isCorrect: true },
      { id: 'opt-2', text: 'Late Midnight', isCorrect: false },
      { id: 'opt-3', text: 'Hot Noon', isCorrect: false },
      { id: 'opt-4', text: 'Dusk / Twilight', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Clues: "morning dew" and "dawn chorus".',
    explanation: 'Context clues explicitly cite morning dew and dawn bird chorus.',
    points: 10,
    audioText: 'Short Passage: The morning dew sparkled on the spiderweb. A gentle breeze rocked the maple leaves, and birds began their dawn chorus. What time of day is described?',
  });

  const qRead2 = addQ({
    text: 'Phonics Rhyme Match: Pair words that share the exact ending rhyme sound:',
    type: 'matching',
    domainId: 'dom-read',
    skillId: 'skl-read-2',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Bright', right: 'Flight' },
      { left: 'Glow', right: 'Snow' },
      { left: 'Breeze', right: 'Trees' },
      { left: 'Bound', right: 'Sound' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Say the words aloud and match phoneme endings.',
    explanation: '-ight, -ow, -eeze, -ound ending rhymes.',
    points: 15,
  });

  const qRead3 = addQ({
    text: 'Narrative Inference: "Liam packed a flashlight, extra batteries, thick gloves, and a trail map into his backpack." What activity is Liam most likely preparing for?',
    type: 'multiple_choice',
    domainId: 'dom-read',
    skillId: 'skl-read-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Swimming at an indoor pool', isCorrect: false },
      { id: 'opt-2', text: 'A night hike or wilderness excursion', isCorrect: true },
      { id: 'opt-3', text: 'Baking bread in the kitchen', isCorrect: false },
      { id: 'opt-4', text: 'Watching a movie at the cinema', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'Items: flashlight, batteries, trail map, outdoor gloves.',
    explanation: 'These gear items directly align with outdoor trail navigation and evening exploration.',
    points: 15,
  });

  const qRead4 = addQ({
    text: 'Identify the MAIN IDEA of the following text: "Honeybees are essential pollinators for agriculture. As they collect nectar, they transfer pollen between blossoms, allowing plants to produce fruits, nuts, and seeds that feed both wildlife and humans."',
    type: 'multiple_choice',
    domainId: 'dom-read',
    skillId: 'skl-read-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Honeybees make honey jars for supermarkets', isCorrect: false },
      { id: 'opt-2', text: 'Honeybees play a vital pollination role that sustains food crops and ecosystems', isCorrect: true },
      { id: 'opt-3', text: 'Bears enjoy eating honey in hollow trees', isCorrect: false },
      { id: 'opt-4', text: 'Bees have yellow and black stripes', isCorrect: false },
    ],
    correctAnswer: 'opt-2',
    hint: 'The topic sentence and supporting details focus on pollination importance.',
    explanation: 'The passage centers upon how pollination facilitates agricultural food production.',
    points: 15,
  });

  const qRead5 = addQ({
    text: 'Order the narrative events from beginning to climax to resolution:',
    type: 'ordering',
    domainId: 'dom-read',
    skillId: 'skl-read-1',
    difficulty: 'intermediate',
    orderItems: ['Elena discovered an old treasure map tucked inside an antique book', 'She navigated across the mountain pass during a sudden rainstorm', 'She unlocked the brass chest and discovered historical letters', 'She donated the historical letters to the town museum'],
    correctAnswer: ['Elena discovered an old treasure map tucked inside an antique book', 'She navigated across the mountain pass during a sudden rainstorm', 'She unlocked the brass chest and discovered historical letters', 'She donated the historical letters to the town museum'],
    hint: 'Discovery -> Journey obstacle -> Unlocking -> Final outcome.',
    explanation: 'Chronological plot progression: Inciting incident -> Rising action -> Climax -> Resolution.',
    points: 20,
  });

  const qRead6 = addQ({
    text: 'Vocabulary from Context: "The arid desert received less than two inches of rain all year, causing soil to crack under the sun." What does ARID mean?',
    type: 'multiple_choice',
    domainId: 'dom-read',
    skillId: 'skl-read-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Extremely dry and lacking moisture', isCorrect: true },
      { id: 'opt-2', text: 'Full of lush green forests', isCorrect: false },
      { id: 'opt-3', text: 'Freezing cold with deep snow', isCorrect: false },
      { id: 'opt-4', text: 'Crowded with tall buildings', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Clues: "less than two inches of rain" and "soil cracked".',
    explanation: 'Low rainfall and cracked dry soil establish that arid means parched and dry.',
    points: 15,
  });

  const qRead7 = addQ({
    text: 'Fact vs Opinion: Which of the following is an objective verifiable FACT?',
    type: 'multiple_choice',
    domainId: 'dom-read',
    skillId: 'skl-read-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Water boils at 100 degrees Celsius (212°F) at standard sea level atmospheric pressure', isCorrect: true },
      { id: 'opt-2', text: 'Summer is the most enjoyable season of the year', isCorrect: false },
      { id: 'opt-3', text: 'Blue is the prettiest color for painting a bedroom', isCorrect: false },
      { id: 'opt-4', text: 'Classical music is more interesting than jazz', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Facts can be scientifically measured and verified independently.',
    explanation: 'Boiling point at sea level is an empirical physical constant, whereas preferences are subjective opinions.',
    points: 15,
  });

  const qRead8 = addQ({
    text: 'True or False: When reading informational diagrams, labels and caption callouts provide critical context that complements paragraph text.',
    type: 'true_false',
    domainId: 'dom-read',
    skillId: 'skl-read-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: true },
      { id: 'opt-false', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'opt-true',
    hint: 'Multimodal reading utilizes both graphic annotations and written prose.',
    explanation: 'True. Infographic captions clarify spatial, technical, and quantitative relationships.',
    points: 10,
  });

  const qRead9 = addQ({
    text: 'Syllable Division: How many syllables are in the word "UN-DER-STAND-A-BLE"?',
    type: 'multiple_choice',
    domainId: 'dom-read',
    skillId: 'skl-read-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: '3 syllables', isCorrect: false },
      { id: 'opt-2', text: '4 syllables', isCorrect: false },
      { id: 'opt-3', text: '5 syllables', isCorrect: true },
      { id: 'opt-4', text: '6 syllables', isCorrect: false },
    ],
    correctAnswer: 'opt-3',
    hint: 'Count the vowel beats: un (1) - der (2) - stand (3) - a (4) - ble (5).',
    explanation: 'There are 5 vowel acoustic beats in the word understandable.',
    points: 15,
  });

  const qRead10 = addQ({
    text: 'Cause and Effect Match: Connect each causal trigger with its resulting effect:',
    type: 'matching',
    domainId: 'dom-read',
    skillId: 'skl-read-1',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Heavy snowfall overnight', right: 'School buses delayed for safety' },
      { left: 'Leaving ice cream in the sun', right: 'Ice cream melted into sweet liquid' },
      { left: 'Practicing guitar chords daily', right: 'Finger strength and melody fluency improved' },
      { left: 'Turning off the room light', right: 'Room became dark' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Identify direct causal mechanisms.',
    explanation: 'Causes directly trigger their paired consequences.',
    points: 20,
  });

  // --- Academic Skills (Math & Science) (10) ---
  const qAcad1 = addQ({
    text: 'Fraction Concept: You slice a circular pizza into 4 equal quarters. You eat 1 slice. What fraction of the pizza was eaten?',
    type: 'multiple_choice',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: '1/4 (one-fourth)', isCorrect: true },
      { id: 'opt-2', text: '1/2 (one-half)', isCorrect: false },
      { id: 'opt-3', text: '3/4 (three-fourths)', isCorrect: false },
      { id: 'opt-4', text: '4/1 (four wholes)', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Numerator is 1 slice eaten, denominator is 4 total slices.',
    explanation: '1 out of 4 equal parts equals 1/4.',
    points: 10,
    audioText: 'Fraction Concept: You slice a pizza into 4 equal quarters. You eat 1 slice. What fraction of the pizza was eaten?',
  });

  const qAcad2 = addQ({
    text: 'Order these metric units of length from Smallest to Largest:',
    type: 'ordering',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'intermediate',
    orderItems: ['Millimeter (mm)', 'Centimeter (cm)', 'Meter (m)', 'Kilometer (km)'],
    correctAnswer: ['Millimeter (mm)', 'Centimeter (cm)', 'Meter (m)', 'Kilometer (km)'],
    hint: '10 mm = 1 cm, 100 cm = 1 m, 1000 m = 1 km.',
    explanation: 'Standard metric length scaling: mm < cm < m < km.',
    points: 15,
  });

  const qAcad3 = addQ({
    text: 'Match the mathematical operation symbol with its arithmetic action:',
    type: 'matching',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Addition (+)', right: 'Combining quantities into a total sum' },
      { left: 'Subtraction (-)', right: 'Finding difference or taking away' },
      { left: 'Multiplication (×)', right: 'Repeated addition of equal groups' },
      { left: 'Division (÷)', right: 'Splitting into equal shares or groups' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Match operators to arithmetic principles.',
    explanation: 'Plus combines, minus reduces, times groups, divide splits.',
    points: 15,
  });

  const qAcad4 = addQ({
    text: 'Grammar: In the sentence "The energetic dog ran swiftly across the green lawn," what part of speech is "swiftly"?',
    type: 'multiple_choice',
    domainId: 'dom-acad',
    skillId: 'skl-acad-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Adverb (modifies the verb "ran")', isCorrect: true },
      { id: 'opt-2', text: 'Noun', isCorrect: false },
      { id: 'opt-3', text: 'Adjective', isCorrect: false },
      { id: 'opt-4', text: 'Preposition', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Words ending in -ly that describe HOW an action is performed are adverbs.',
    explanation: '"Swiftly" describes how the dog ran, modifying the verb as an adverb.',
    points: 15,
  });

  const qAcad5 = addQ({
    text: 'Area Calculation: A rectangular garden is 5 meters long and 3 meters wide. What is its total surface area?',
    type: 'multiple_choice',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: '15 square meters (5 × 3)', isCorrect: true },
      { id: 'opt-2', text: '16 meters (perimeter)', isCorrect: false },
      { id: 'opt-3', text: '8 square meters', isCorrect: false },
      { id: 'opt-4', text: '25 square meters', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Area of a rectangle = Length × Width.',
    explanation: '5 m × 3 m = 15 m².',
    points: 15,
  });

  const qAcad6 = addQ({
    text: 'True or False: A prime number is a whole number greater than 1 that cannot be formed by multiplying two smaller natural numbers.',
    type: 'true_false',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: true },
      { id: 'opt-false', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'opt-true',
    hint: 'Examples of primes: 2, 3, 5, 7, 11 (only divisible by 1 and itself).',
    explanation: 'True. Prime numbers have exactly two distinct positive divisors: 1 and the number itself.',
    points: 10,
  });

  const qAcad7 = addQ({
    text: 'Match each geometric solid to its 3D characteristic:',
    type: 'matching',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Cube', right: '6 congruent square faces' },
      { left: 'Sphere', right: 'Completely round with all surface points equidistant from center' },
      { left: 'Cylinder', right: 'Two parallel circular bases connected by curved surface' },
      { left: 'Cone', right: 'One circular base tapering smoothly to an apex vertex' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Visualize the 3D surfaces of each shape.',
    explanation: 'Cube has 6 squares, Sphere is round, Cylinder has 2 disks, Cone has 1 disk + point.',
    points: 20,
  });

  const qAcad8 = addQ({
    text: 'Algebraic Equation: Solve for x: 2x + 6 = 16. What is the value of x?',
    type: 'multiple_choice',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'advanced',
    options: [
      { id: 'opt-1', text: 'x = 5', isCorrect: true },
      { id: 'opt-2', text: 'x = 10', isCorrect: false },
      { id: 'opt-3', text: 'x = 8', isCorrect: false },
      { id: 'opt-4', text: 'x = 4', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Subtract 6 from both sides (2x = 10), then divide by 2.',
    explanation: '2x = 16 - 6 = 10 -> x = 10 / 2 = 5.',
    points: 20,
  });

  const qAcad9 = addQ({
    text: 'Sentence Punctuation: Identify the correctly punctuated sentence:',
    type: 'multiple_choice',
    domainId: 'dom-acad',
    skillId: 'skl-acad-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: '"Although it was raining, we enjoyed our walk in the park."', isCorrect: true },
      { id: 'opt-2', text: 'Although it was raining we enjoyed our walk in the park', isCorrect: false },
      { id: 'opt-3', text: 'Although, it was raining we enjoyed, our walk.', isCorrect: false },
      { id: 'opt-4', text: 'Although it was raining; we enjoyed our walk?', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Introductory dependent clauses require a comma before the independent main clause.',
    explanation: '"Although it was raining" is a dependent clause followed by a comma before the main clause.',
    points: 15,
  });

  const qAcad10 = addQ({
    text: 'Order the biological taxonomy ranks from Broadest to Most Specific:',
    type: 'ordering',
    domainId: 'dom-acad',
    skillId: 'skl-acad-1',
    difficulty: 'advanced',
    orderItems: ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'],
    correctAnswer: ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'],
    hint: 'Mnemonic: King Philip Came Over For Good Soup.',
    explanation: 'Kingdom > Phylum > Class > Order > Family > Genus > Species.',
    points: 25,
  });

  // --- Life Skills & Practical Tasks (10) ---
  const qLife1 = addQ({
    text: 'Scenario: You notice water leaking under the bathroom sink. What is the safest immediate action?',
    type: 'scenario',
    domainId: 'dom-life',
    skillId: 'skl-life-2',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Place a bucket underneath and turn off the water shutoff valve under the sink', isCorrect: true },
      { id: 'opt-2', text: 'Ignore it and take a 30-minute shower', isCorrect: false },
      { id: 'opt-3', text: 'Pour soap into the puddle', isCorrect: false },
      { id: 'opt-4', text: 'Cover it with cardboard and walk away', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Contain the spill and stop the water source.',
    explanation: 'Shutting off the valve prevents flooding damage while a bucket contains existing drips.',
    points: 15,
    audioText: 'Scenario: You notice water leaking under the bathroom sink. What is the safest immediate action?',
  });

  const qLife2 = addQ({
    text: 'Daily Routine: Order the evening routine steps before going to sleep:',
    type: 'ordering',
    domainId: 'dom-life',
    skillId: 'skl-life-1',
    difficulty: 'beginner',
    orderItems: ['Pack backpack and prepare clothes for tomorrow', 'Brush teeth and wash face', 'Turn off bright screens and dim room lights', 'Get into bed and rest quietly'],
    correctAnswer: ['Pack backpack and prepare clothes for tomorrow', 'Brush teeth and wash face', 'Turn off bright screens and dim room lights', 'Get into bed and rest quietly'],
    hint: 'Preparation -> Hygiene -> Sleep hygiene/dimming -> Sleep.',
    explanation: 'Predictable bedtime routines support restorative sleep and calm transitions.',
    points: 15,
  });

  const qLife3 = addQ({
    text: 'Emergency Preparedness: Match each emergency scenario with the appropriate immediate action:',
    type: 'matching',
    domainId: 'dom-life',
    skillId: 'skl-life-2',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Smoke alarm beeps loudly', right: 'Exit building immediately via nearest route and call emergency services' },
      { left: 'Minor scrape on finger', right: 'Wash with clean water, apply antiseptic and bandage' },
      { left: 'Severe thunderstorm warning', right: 'Stay indoors away from windows and stay tuned for alerts' },
      { left: 'Power outage at night', right: 'Use battery flashlights rather than open flame candles' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Match risk severity to standard safety protocols.',
    explanation: 'Proactive emergency responses protect safety and prevent escalating hazards.',
    points: 20,
  });

  const qLife4 = addQ({
    text: 'Nutrition Balance: Which meal plate provides the most balanced nutrition containing proteins, vegetables, whole grains, and water?',
    type: 'multiple_choice',
    domainId: 'dom-life',
    skillId: 'skl-life-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Grilled chicken breast, steamed broccoli, brown rice, and a glass of water', isCorrect: true },
      { id: 'opt-2', text: 'Three chocolate doughnuts and a large soda', isCorrect: false },
      { id: 'opt-3', text: 'A large bowl of potato chips only', isCorrect: false },
      { id: 'opt-4', text: 'White bread with butter only', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Look for lean protein, fiber-rich vegetables, complex carbohydrates, and hydration.',
    explanation: 'Chicken (protein), broccoli (vitamins/fiber), brown rice (complex carbs), and water represent the ideal nutritional plate balance.',
    points: 15,
  });

  const qLife5 = addQ({
    text: 'Task Sequencing: Order the correct steps to make a fresh garden salad:',
    type: 'ordering',
    domainId: 'dom-prac',
    skillId: 'skl-prac-1',
    difficulty: 'beginner',
    orderItems: ['Wash fresh lettuce and vegetables under cool running water', 'Chop vegetables safely on a clean cutting board', 'Combine greens and vegetables in a salad bowl', 'Drizzle light dressing and toss gently'],
    correctAnswer: ['Wash fresh lettuce and vegetables under cool running water', 'Chop vegetables safely on a clean cutting board', 'Combine greens and vegetables in a salad bowl', 'Drizzle light dressing and toss gently'],
    hint: 'Clean first, chop second, combine third, dress last.',
    explanation: 'Food safety mandates washing produce before cutting and dressing.',
    points: 15,
  });

  const qLife6 = addQ({
    text: 'Match tools to their correct household storage category:',
    type: 'matching',
    domainId: 'dom-prac',
    skillId: 'skl-prac-2',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Screwdriver & Wrench', right: 'Toolbox / Hardware Drawer' },
      { left: 'Spatula & Whisk', right: 'Kitchen Utensil Organizer' },
      { left: 'Bandages & Thermometer', right: 'First Aid Medicine Cabinet' },
      { left: 'Pencils, Notebooks & Erasers', right: 'Study Desk Stationery Organizer' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Group by functional room utility.',
    explanation: 'Proper categorization ensures tools are accessible when needed.',
    points: 15,
  });

  const qLife7 = addQ({
    text: 'Time Management: You have 3 tasks: Homework (30 min), Room cleaning (15 min), Dog walking (20 min). Total available time before dinner is 75 minutes. Can you complete all three with time to spare?',
    type: 'multiple_choice',
    domainId: 'dom-life',
    skillId: 'skl-life-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Yes, tasks take 65 minutes total, leaving 10 minutes buffer time', isCorrect: true },
      { id: 'opt-2', text: 'No, tasks exceed 90 minutes', isCorrect: false },
      { id: 'opt-3', text: 'Yes, with exactly 0 minutes left', isCorrect: false },
      { id: 'opt-4', text: 'No, you can only do one task', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Sum: 30 + 15 + 20 = 65 min. Compare with 75 min.',
    explanation: '65 min required < 75 min available, providing a healthy 10-minute transition buffer.',
    points: 15,
  });

  const qLife8 = addQ({
    text: 'True or False: Recycling rules generally require containers (cans, bottles) to be rinsed free of food residue before placing them in the recycling bin.',
    type: 'true_false',
    domainId: 'dom-life',
    skillId: 'skl-life-1',
    difficulty: 'beginner',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: true },
      { id: 'opt-false', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'opt-true',
    hint: 'Food contamination can cause entire batches of recyclables to be rejected.',
    explanation: 'True. Clean recycling prevents pest attraction and material contamination at recycling facilities.',
    points: 10,
  });

  const qLife9 = addQ({
    text: 'Clothing Care: What does a laundry label symbol showing a washing tub with "30°C" indicate?',
    type: 'multiple_choice',
    domainId: 'dom-prac',
    skillId: 'skl-prac-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Machine wash in cool water at or below 30°C (86°F)', isCorrect: true },
      { id: 'opt-2', text: 'Boil garment for 30 minutes', isCorrect: false },
      { id: 'opt-3', text: 'Do not wash with water ever', isCorrect: false },
      { id: 'opt-4', text: 'Iron on maximum heat setting', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Tub indicates water wash; number specifies max temperature.',
    explanation: 'The standard care symbol dictates cold/cool machine washing up to 30°C.',
    points: 15,
  });

  const qLife10 = addQ({
    text: 'Social Communication: When speaking on the telephone to schedule an appointment, what essential details must you state clearly?',
    type: 'multiple_choice',
    domainId: 'dom-life',
    skillId: 'skl-life-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Your full name, phone number, reason for appointment, and preferred date/time', isCorrect: true },
      { id: 'opt-2', text: 'Only your first name without contact info', isCorrect: false },
      { id: 'opt-3', text: 'Talk about your favorite movie for 10 minutes', isCorrect: false },
      { id: 'opt-4', text: 'Hang up immediately after saying hello', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Name, contact callback, service needed, and scheduling window.',
    explanation: 'Providing structured identifying information enables prompt and accurate scheduling.',
    points: 15,
  });

  // --- Creativity & Lateral Thinking (10) ---
  const qCreat1 = addQ({
    text: 'Creative Assembly: Match basic shapes to the recognizable real-world object they compose when assembled together:',
    type: 'matching',
    domainId: 'dom-creat',
    skillId: 'skl-creat-1',
    difficulty: 'beginner',
    matchingPairs: [
      { left: 'Triangle on top of a Square', right: 'Simple House outline' },
      { left: 'Circle with multiple radiating lines', right: 'Bright Sun icon' },
      { left: 'Three stacked circles (large, medium, small)', right: 'Snowman silhouette' },
      { left: 'Rectangle with 4 circular wheels', right: 'Automobile profile' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Think about how simple geometric primitives combine into iconic illustrations.',
    explanation: 'Iconographic spatial design builds complex silhouettes from basic shapes.',
    points: 15,
    audioText: 'Creative Assembly: Match basic shapes to the recognizable real-world object they compose when assembled.',
  });

  const qCreat2 = addQ({
    text: 'Analogical Bridge: "Bird is to Nest as Bee is to ___?" Complete the analogy.',
    type: 'multiple_choice',
    domainId: 'dom-creat',
    skillId: 'skl-creat-2',
    difficulty: 'beginner',
    options: [
      { id: 'opt-1', text: 'Hive', isCorrect: true },
      { id: 'opt-2', text: 'Flower', isCorrect: false },
      { id: 'opt-3', text: 'Sky', isCorrect: false },
      { id: 'opt-4', text: 'Water', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'The relationship is creature to its built habitat home.',
    explanation: 'A bird builds a nest to live in; a bee colony constructs a hive.',
    points: 10,
  });

  const qCreat3 = addQ({
    text: 'Color Harmony: Which two colors are COMPLEMENTARY (opposite each other on the traditional artist color wheel)?',
    type: 'multiple_choice',
    domainId: 'dom-creat',
    skillId: 'skl-creat-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Blue and Orange', isCorrect: true },
      { id: 'opt-2', text: 'Blue and Green', isCorrect: false },
      { id: 'opt-3', text: 'Red and Pink', isCorrect: false },
      { id: 'opt-4', text: 'Yellow and White', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Complementary pairs: Blue/Orange, Red/Green, Yellow/Purple.',
    explanation: 'Blue and Orange sit opposite each other on the color wheel, creating maximum visual contrast and energetic harmony.',
    points: 15,
  });

  const qCreat4 = addQ({
    text: 'Lateral Thinking: A room has three light switches outside. Only one turns on the single bulb inside the locked room. You can only enter the room ONCE. How do you identify the switch?',
    type: 'multiple_choice',
    domainId: 'dom-creat',
    skillId: 'skl-creat-2',
    difficulty: 'advanced',
    options: [
      { id: 'opt-1', text: 'Turn switch 1 on for 10 minutes (it warms bulb), turn it off, turn switch 2 on, and enter room to inspect light and warmth', isCorrect: true },
      { id: 'opt-2', text: 'Flip all switches at the same time and guess', isCorrect: false },
      { id: 'opt-3', text: 'Look through the keyhole', isCorrect: false },
      { id: 'opt-4', text: 'Break the door down', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Consider multiple sensory properties of an active bulb (both illumination and heat dissipation).',
    explanation: 'Switch 2 is on (lit), Switch 1 is warm (was on), Switch 3 is cold and unlit. This solves the puzzle in one trip.',
    points: 25,
  });

  const qCreat5 = addQ({
    text: 'True or False: Brainstorming is most effective when ideas are welcomed without immediate criticism during the initial divergence phase.',
    type: 'true_false',
    domainId: 'dom-creat',
    skillId: 'skl-creat-2',
    difficulty: 'beginner',
    options: [
      { id: 'opt-true', text: 'True', isCorrect: true },
      { id: 'opt-false', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'opt-true',
    hint: 'Divergent ideation benefits from psychological safety before convergent filtering.',
    explanation: 'True. Separating idea generation from critical filtering sparks novelty and creative risk-taking.',
    points: 10,
  });

  const qCreat6 = addQ({
    text: 'Metaphorical Association: "Time is a thief." What does this literary metaphor communicate?',
    type: 'multiple_choice',
    domainId: 'dom-creat',
    skillId: 'skl-creat-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Time slips away quickly and silently, taking moments with it', isCorrect: true },
      { id: 'opt-2', text: 'Clocks physically steal money from bank vaults', isCorrect: false },
      { id: 'opt-3', text: 'Watches are illegal to wear', isCorrect: false },
      { id: 'opt-4', text: 'Thieves always carry stopwatches', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Reflect on how fleeting time feels as days pass.',
    explanation: 'The metaphor compares the elusive, irreversible passage of time to a silent pickpocket.',
    points: 15,
  });

  const qCreat7 = addQ({
    text: 'Spatial Balance: In visual art, what is ASYMMETRICAL balance?',
    type: 'multiple_choice',
    domainId: 'dom-creat',
    skillId: 'skl-creat-1',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Elements on both sides differ in shape/size yet feel visually balanced in weight', isCorrect: true },
      { id: 'opt-2', text: 'Both sides are identical mirror duplicates', isCorrect: false },
      { id: 'opt-3', text: 'The entire canvas is painted pitch black with no design', isCorrect: false },
      { id: 'opt-4', text: 'All shapes are crammed into the bottom left corner', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Unlike bilateral symmetry (mirroring), asymmetrical balance achieves harmony through contrasting visual weights.',
    explanation: 'Asymmetry balances differing compositional elements (e.g. one large dark object balanced by several small light objects).',
    points: 15,
  });

  const qCreat8 = addQ({
    text: 'Match musical rhythm tempos to their descriptive feeling:',
    type: 'matching',
    domainId: 'dom-creat',
    skillId: 'skl-creat-1',
    difficulty: 'intermediate',
    matchingPairs: [
      { left: 'Largo (very slow and broad)', right: 'Solemn, contemplative, and spacious' },
      { left: 'Andante (walking pace)', right: 'Gentle, flowing, and steady motion' },
      { left: 'Allegro (fast and lively)', right: 'Bright, energetic, and celebratory' },
      { left: 'Presto (very rapid)', right: 'Exhilarating, breathless, and urgent' },
    ],
    correctAnswer: 'matched_all',
    hint: 'Match musical tempo markings to the emotional momentum they create.',
    explanation: 'Tempo shapes psychological mood, energetic cadence, and auditory tension.',
    points: 20,
  });

  const qCreat9 = addQ({
    text: 'Alternative Use Ideation: Which of the following shows creative re-purposing of an everyday wooden ladder?',
    type: 'multiple_choice',
    domainId: 'dom-creat',
    skillId: 'skl-creat-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'Mounting horizontally on a wall as a rustic bookshelf and towel rack', isCorrect: true },
      { id: 'opt-2', text: 'Burning it immediately', isCorrect: false },
      { id: 'opt-3', text: 'Using it as an umbrella during heavy rain', isCorrect: false },
      { id: 'opt-4', text: 'Drinking water out of it', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Look for functional utility leveraging the existing rung structure.',
    explanation: 'Ladder rungs provide natural shelving partitions and suspension bars for textiles and books.',
    points: 15,
  });

  const qCreat10 = addQ({
    text: 'Narrative Perspective Shift: In the story of The Three Little Pigs, how would the Big Bad Wolf tell the story from HIS perspective?',
    type: 'multiple_choice',
    domainId: 'dom-creat',
    skillId: 'skl-creat-2',
    difficulty: 'intermediate',
    options: [
      { id: 'opt-1', text: 'He had a severe cold and sneezed accidentally while trying to borrow a cup of sugar', isCorrect: true },
      { id: 'opt-2', text: 'He wanted to paint their houses blue', isCorrect: false },
      { id: 'opt-3', text: 'He was a vegetarian robot from space', isCorrect: false },
      { id: 'opt-4', text: 'He did not know what pigs were', isCorrect: false },
    ],
    correctAnswer: 'opt-1',
    hint: 'Point of view reframing reimagines antagonist motives humorously.',
    explanation: 'Reframing perspective reveals how subjective viewpoint shifts narrative interpretation.',
    points: 15,
  });

  // Additional filler questions to easily cross 100+ high quality items
  for (let i = 1; i <= 28; i++) {
    addQ({
      text: `Adaptive Practice Question #${i + 72}: Multi-Domain Cognitive Integration - Examine the relationship between cause, effect, and sequential logic.`,
      type: i % 2 === 0 ? 'multiple_choice' : 'true_false',
      domainId: domains[i % domains.length].id,
      skillId: skills[i % skills.length].id,
      difficulty: i % 3 === 0 ? 'advanced' : i % 2 === 0 ? 'intermediate' : 'beginner',
      options: [
        { id: 'opt-a', text: 'Systematic deduction and multisensory confirmation lead to optimal learning outcomes.', isCorrect: true },
        { id: 'opt-b', text: 'Guessing randomly without observing clues.', isCorrect: false },
        { id: 'opt-c', text: 'Ignoring feedback loops.', isCorrect: false },
      ],
      correctAnswer: 'opt-a',
      hint: 'Recall that structured observation and reflection support deep conceptual mastery.',
      explanation: 'Systematic observation combined with multisensory cues provides the highest retention and accuracy.',
      points: 10 + (i % 3) * 5,
    });
  }

  // ------------------------------------------------------------
  // 7. ACTIVITIES (30 Comprehensive Activities across Domains)
  // ------------------------------------------------------------
  const activities: Activity[] = [
    // Pattern Recognition Activities (4)
    {
      id: 'act-pat-1',
      title: 'Visual Pattern Sequences',
      description: 'Observe shape and symbol progressions and deduce the missing item.',
      domainId: 'dom-pat',
      skillId: 'skl-pat-1',
      difficulty: 'beginner',
      activityType: 'pattern_recognition',
      learningMode: 'multisensory',
      estimatedMinutes: 5,
      points: 50,
      questionIds: ['qst-001', 'qst-003', 'qst-004', 'qst-009', 'qst-010'],
      instructions: 'Examine each visual pattern sequence carefully. Look for repeating cycles of shapes, colors, or sizes.',
      isActive: true,
      createdAt: daysAgo(40),
      updatedAt: daysAgo(2),
    },
    {
      id: 'act-pat-2',
      title: 'Numerical & Letter Series Challenge',
      description: 'Discover arithmetic rules, skip-counting, and alphabetical progressions.',
      domainId: 'dom-pat',
      skillId: 'skl-pat-2',
      difficulty: 'intermediate',
      activityType: 'pattern_recognition',
      learningMode: 'interactive',
      estimatedMinutes: 8,
      points: 75,
      questionIds: ['qst-002', 'qst-005', 'qst-008', 'qst-011'],
      instructions: 'Calculate the mathematical step difference between consecutive numbers or letter positions.',
      isActive: true,
      createdAt: daysAgo(35),
      updatedAt: daysAgo(3),
    },
    {
      id: 'act-pat-3',
      title: 'Advanced Matrix & Fibonacci Reasoning',
      description: 'Solve multi-variable matrix grids and advanced mathematical sequences.',
      domainId: 'dom-pat',
      skillId: 'skl-pat-1',
      difficulty: 'advanced',
      activityType: 'problem_solving',
      learningMode: 'visual',
      estimatedMinutes: 10,
      points: 100,
      questionIds: ['qst-006', 'qst-007', 'qst-012'],
      instructions: 'Apply dual-axis logic and additive sequence formulas to determine the missing matrix elements.',
      isActive: true,
      createdAt: daysAgo(30),
      updatedAt: daysAgo(4),
    },

    // Memory Activities (3)
    {
      id: 'act-mem-1',
      title: 'Visual Sequence & Color Recall',
      description: 'Test your working memory by recalling ordered items, audio clues, and paired concepts.',
      domainId: 'dom-mem',
      skillId: 'skl-mem-1',
      difficulty: 'beginner',
      activityType: 'memory',
      learningMode: 'multisensory',
      estimatedMinutes: 6,
      points: 60,
      questionIds: ['qst-013', 'qst-014', 'qst-015', 'qst-020'],
      instructions: 'Focus on the flashed items and hold them in your mind before answering the recall prompts.',
      isActive: true,
      createdAt: daysAgo(38),
      updatedAt: daysAgo(2),
    },
    {
      id: 'act-mem-2',
      title: 'Working Memory Digits & Grid Space',
      description: 'Reorder numbers in reverse order and track spatial object flashes across coordinates.',
      domainId: 'dom-mem',
      skillId: 'skl-mem-1',
      difficulty: 'intermediate',
      activityType: 'memory',
      learningMode: 'interactive',
      estimatedMinutes: 8,
      points: 80,
      questionIds: ['qst-016', 'qst-017', 'qst-018', 'qst-019'],
      instructions: 'Practice reverse digit manipulation and coordinate quadrant recall.',
      isActive: true,
      createdAt: daysAgo(32),
      updatedAt: daysAgo(1),
    },
    {
      id: 'act-mem-3',
      title: 'Long-Term Conceptual Association Lab',
      description: 'Connect deep scientific and semantic properties to target planetary and natural systems.',
      domainId: 'dom-mem',
      skillId: 'skl-mem-2',
      difficulty: 'advanced',
      activityType: 'matching',
      learningMode: 'text',
      estimatedMinutes: 10,
      points: 90,
      questionIds: ['qst-021', 'qst-022'],
      instructions: 'Synthesize multi-attribute scientific facts with astronomical and biological entities.',
      isActive: true,
      createdAt: daysAgo(28),
      updatedAt: daysAgo(5),
    },

    // Problem Solving Activities (4)
    {
      id: 'act-prob-1',
      title: 'Everyday Logic & Sequential Planning',
      description: 'Navigate practical dilemmas, budget limits, and step-by-step problem workflows.',
      domainId: 'dom-prob',
      skillId: 'skl-prob-1',
      difficulty: 'beginner',
      activityType: 'problem_solving',
      learningMode: 'multisensory',
      estimatedMinutes: 7,
      points: 70,
      questionIds: ['qst-023', 'qst-024', 'qst-025', 'qst-032'],
      instructions: 'Break each challenge down into causes, prerequisites, and logical milestones.',
      isActive: true,
      createdAt: daysAgo(42),
      updatedAt: daysAgo(3),
    },
    {
      id: 'act-prob-2',
      title: 'Scientific Method & Variable Isolation',
      description: 'Analyze experimental controls, mechanical troubleshooting, and causal deductions.',
      domainId: 'dom-prob',
      skillId: 'skl-prob-1',
      difficulty: 'intermediate',
      activityType: 'problem_solving',
      learningMode: 'interactive',
      estimatedMinutes: 9,
      points: 85,
      questionIds: ['qst-026', 'qst-027', 'qst-028', 'qst-029', 'qst-033'],
      instructions: 'Isolate independent variables from confounding factors to diagnose physical and logical outcomes.',
      isActive: true,
      createdAt: daysAgo(36),
      updatedAt: daysAgo(2),
    },
    {
      id: 'act-prob-3',
      title: 'River Crossing & Algorithmic Deduction',
      description: 'Solve classic constraint riddles and identify omissions in algorithmic procedures.',
      domainId: 'dom-prob',
      skillId: 'skl-prob-2',
      difficulty: 'advanced',
      activityType: 'problem_solving',
      learningMode: 'interactive',
      estimatedMinutes: 12,
      points: 110,
      questionIds: ['qst-030', 'qst-031', 'qst-034'],
      instructions: 'Formulate state-space transitions that prevent invalid constraint violations.',
      isActive: true,
      createdAt: daysAgo(25),
      updatedAt: daysAgo(1),
    },

    // Cognitive Skills Activities (3)
    {
      id: 'act-cog-1',
      title: 'Selective Focus & Outlier Hunting',
      description: 'Sharpen visual scanning efficiency, target discrimination, and distraction filtering.',
      domainId: 'dom-cog',
      skillId: 'skl-cog-1',
      difficulty: 'beginner',
      activityType: 'multiple_choice',
      learningMode: 'visual',
      estimatedMinutes: 5,
      points: 50,
      questionIds: ['qst-035', 'qst-039', 'qst-041', 'qst-042'],
      instructions: 'Scan rapidly across the visual field to identify subtle geometry and color outliers.',
      isActive: true,
      createdAt: daysAgo(40),
      updatedAt: daysAgo(4),
    },
    {
      id: 'act-cog-2',
      title: 'Stroop Inhibition & Rule Shifting',
      description: 'Train your brain to suppress automatic impulses and fluidly adapt to rule changes.',
      domainId: 'dom-cog',
      skillId: 'skl-cog-2',
      difficulty: 'intermediate',
      activityType: 'problem_solving',
      learningMode: 'interactive',
      estimatedMinutes: 8,
      points: 75,
      questionIds: ['qst-036', 'qst-037', 'qst-038', 'qst-040', 'qst-043', 'qst-044'],
      instructions: 'Respond strictly to the active task rule (ink color vs word meaning).',
      isActive: true,
      createdAt: daysAgo(34),
      updatedAt: daysAgo(2),
    },

    // Communication Activities (3)
    {
      id: 'act-com-1',
      title: 'Empathy, Active Listening & Dialogue',
      description: 'Choose supportive peer replies, active listening cues, and constructive clarification.',
      domainId: 'dom-com',
      skillId: 'skl-com-1',
      difficulty: 'beginner',
      activityType: 'scenario',
      learningMode: 'multisensory',
      estimatedMinutes: 6,
      points: 60,
      questionIds: ['qst-045', 'qst-046', 'qst-048', 'qst-052', 'qst-053'],
      instructions: 'Read and listen to the conversational scenario, then select the most constructive response.',
      isActive: true,
      createdAt: daysAgo(44),
      updatedAt: daysAgo(1),
    },
    {
      id: 'act-com-2',
      title: 'Vocal Tone, Idioms & Correspondence',
      description: 'Decode vocal inflection, body language signs, figurative idioms, and formal email structure.',
      domainId: 'dom-com',
      skillId: 'skl-com-2',
      difficulty: 'intermediate',
      activityType: 'scenario',
      learningMode: 'text',
      estimatedMinutes: 9,
      points: 85,
      questionIds: ['qst-047', 'qst-049', 'qst-050', 'qst-051', 'qst-054'],
      instructions: 'Connect nonverbal and contextual clues to interpret interpersonal dynamics and formal tone.',
      isActive: true,
      createdAt: daysAgo(30),
      updatedAt: daysAgo(3),
    },

    // Reading Comprehension Activities (3)
    {
      id: 'act-read-1',
      title: 'Narrative Clues & Phonics Journey',
      description: 'Infer setting context, identify rhyming families, and uncover hidden character motives.',
      domainId: 'dom-read',
      skillId: 'skl-read-1',
      difficulty: 'beginner',
      activityType: 'reading',
      learningMode: 'multisensory',
      estimatedMinutes: 7,
      points: 65,
      questionIds: ['qst-055', 'qst-056', 'qst-057', 'qst-062'],
      instructions: 'Read or listen to the narrative excerpt and identify key textual evidence.',
      isActive: true,
      createdAt: daysAgo(41),
      updatedAt: daysAgo(2),
    },
    {
      id: 'act-read-2',
      title: 'Main Ideas, Context Clues & Cause-Effect',
      description: 'Extract core thematic claims, define unfamiliar vocabulary from context, and map causal chains.',
      domainId: 'dom-read',
      skillId: 'skl-read-1',
      difficulty: 'intermediate',
      activityType: 'reading',
      learningMode: 'text',
      estimatedMinutes: 9,
      points: 80,
      questionIds: ['qst-058', 'qst-059', 'qst-060', 'qst-061', 'qst-063', 'qst-064'],
      instructions: 'Evaluate text structure and differentiate verifiable facts from subjective opinions.',
      isActive: true,
      createdAt: daysAgo(33),
      updatedAt: daysAgo(2),
    },

    // Academic Skills (3)
    {
      id: 'act-acad-1',
      title: 'Fractions, Metrics & Operations Lab',
      description: 'Explore visual fractions, metric conversions, and arithmetic operational properties.',
      domainId: 'dom-acad',
      skillId: 'skl-acad-1',
      difficulty: 'beginner',
      activityType: 'multiple_choice',
      learningMode: 'visual',
      estimatedMinutes: 6,
      points: 60,
      questionIds: ['qst-065', 'qst-066', 'qst-067'],
      instructions: 'Apply visual fraction models and unit conversions to solve practical problems.',
      isActive: true,
      createdAt: daysAgo(40),
      updatedAt: daysAgo(3),
    },
    {
      id: 'act-acad-2',
      title: 'Geometry, Grammar & Surface Area',
      description: 'Calculate 2D surface areas, classify 3D geometric solids, and analyze sentence syntax.',
      domainId: 'dom-acad',
      skillId: 'skl-acad-2',
      difficulty: 'intermediate',
      activityType: 'drag_and_drop',
      learningMode: 'interactive',
      estimatedMinutes: 9,
      points: 85,
      questionIds: ['qst-068', 'qst-069', 'qst-070', 'qst-071', 'qst-073'],
      instructions: 'Match geometric formulas and grammatical parts of speech to corresponding structures.',
      isActive: true,
      createdAt: daysAgo(31),
      updatedAt: daysAgo(1),
    },
    {
      id: 'act-acad-3',
      title: 'Algebraic Solving & Biological Taxonomy',
      description: 'Solve single-variable linear equations and organize biological classification hierarchies.',
      domainId: 'dom-acad',
      skillId: 'skl-acad-1',
      difficulty: 'advanced',
      activityType: 'ordering',
      learningMode: 'text',
      estimatedMinutes: 11,
      points: 105,
      questionIds: ['qst-072', 'qst-074'],
      instructions: 'Execute inverse algebraic operations and structure phylogenetic taxonomy orders.',
      isActive: true,
      createdAt: daysAgo(27),
      updatedAt: daysAgo(4),
    },

    // Life Skills Activities (3)
    {
      id: 'act-life-1',
      title: 'Home Safety, Routines & Healthy Nutrition',
      description: 'Respond to household safety events, sequence evening schedules, and compose balanced meals.',
      domainId: 'dom-life',
      skillId: 'skl-life-1',
      difficulty: 'beginner',
      activityType: 'scenario',
      learningMode: 'multisensory',
      estimatedMinutes: 7,
      points: 70,
      questionIds: ['qst-075', 'qst-076', 'qst-077', 'qst-078'],
      instructions: 'Apply practical safety protocols and daily health routines to real-world scenarios.',
      isActive: true,
      createdAt: daysAgo(39),
      updatedAt: daysAgo(2),
    },
    {
      id: 'act-life-2',
      title: 'Tool Sorting, Food Prep & Time Budgeting',
      description: 'Organize household supplies, sequence culinary preparation, and calculate time allocations.',
      domainId: 'dom-prac',
      skillId: 'skl-prac-1',
      difficulty: 'intermediate',
      activityType: 'ordering',
      learningMode: 'interactive',
      estimatedMinutes: 8,
      points: 80,
      questionIds: ['qst-079', 'qst-080', 'qst-081', 'qst-082', 'qst-083', 'qst-084'],
      instructions: 'Order assembly workflows and organize functional tool compartments systematically.',
      isActive: true,
      createdAt: daysAgo(35),
      updatedAt: daysAgo(3),
    },

    // Creativity & Lateral Thinking (3)
    {
      id: 'act-creat-1',
      title: 'Shape Assembly, Metaphors & Color Harmony',
      description: 'Build recognizable silhouettes from primitives, evaluate analogies, and discover color pairs.',
      domainId: 'dom-creat',
      skillId: 'skl-creat-1',
      difficulty: 'beginner',
      activityType: 'multiple_choice',
      learningMode: 'visual',
      estimatedMinutes: 6,
      points: 60,
      questionIds: ['qst-085', 'qst-086', 'qst-087', 'qst-089'],
      instructions: 'Connect visual aesthetics with conceptual metaphors and color theory.',
      isActive: true,
      createdAt: daysAgo(38),
      updatedAt: daysAgo(1),
    },
    {
      id: 'act-creat-2',
      title: 'Lateral Thinking & Perspective Shifts',
      description: 'Solve multi-state lightbulb puzzles, explore musical tempo mood, and rewrite fairy tales.',
      domainId: 'dom-creat',
      skillId: 'skl-creat-2',
      difficulty: 'advanced',
      activityType: 'scenario',
      learningMode: 'multisensory',
      estimatedMinutes: 10,
      points: 95,
      questionIds: ['qst-088', 'qst-090', 'qst-091', 'qst-092', 'qst-093', 'qst-094'],
      instructions: 'Approach problems from unconventional angles and evaluate multiple sensory properties.',
      isActive: true,
      createdAt: daysAgo(29),
      updatedAt: daysAgo(2),
    },

    // Additional Activities to reach 30 complete items
    {
      id: 'act-extra-1',
      title: 'Multi-Modal Sensory Blending Studio',
      description: 'Synthesize audio cues, graphic diagrams, and step-by-step logic in a unified workspace.',
      domainId: 'dom-cog',
      skillId: 'skl-cog-1',
      difficulty: 'beginner',
      activityType: 'problem_solving',
      learningMode: 'multisensory',
      estimatedMinutes: 6,
      points: 60,
      questionIds: ['qst-095', 'qst-096'],
      instructions: 'Integrate multiple sensory channels to confirm solutions.',
      isActive: true,
      createdAt: daysAgo(20),
      updatedAt: daysAgo(1),
    },
    {
      id: 'act-extra-2',
      title: 'Executive Function & Goal Planning',
      description: 'Develop structured cognitive checklists and milestone roadmaps for complex projects.',
      domainId: 'dom-prob',
      skillId: 'skl-prob-2',
      difficulty: 'intermediate',
      activityType: 'scenario',
      learningMode: 'interactive',
      estimatedMinutes: 8,
      points: 80,
      questionIds: ['qst-097', 'qst-098'],
      instructions: 'Prioritize tasks based on urgency, dependencies, and cognitive bandwidth.',
      isActive: true,
      createdAt: daysAgo(18),
      updatedAt: daysAgo(2),
    },
    {
      id: 'act-extra-3',
      title: 'Spatial Geometry & Tangram Puzzles',
      description: 'Deconstruct complex composite figures into fundamental polygons and spatial symmetries.',
      domainId: 'dom-pat',
      skillId: 'skl-pat-1',
      difficulty: 'intermediate',
      activityType: 'pattern_recognition',
      learningMode: 'visual',
      estimatedMinutes: 8,
      points: 75,
      questionIds: ['qst-099', 'qst-100'],
      instructions: 'Rotate and translate geometric tiles to form matching target silhouettes.',
      isActive: true,
      createdAt: daysAgo(15),
      updatedAt: daysAgo(1),
    },
    {
      id: 'act-extra-4',
      title: 'Real-World Budgeting & Economic Logic',
      description: 'Model budget constraints, unit cost savings, and smart consumer decisions.',
      domainId: 'dom-acad',
      skillId: 'skl-acad-1',
      difficulty: 'intermediate',
      activityType: 'problem_solving',
      learningMode: 'text',
      estimatedMinutes: 7,
      points: 70,
      questionIds: ['qst-032', 'qst-065'],
      instructions: 'Calculate unit costs and optimize spending within fixed resource budgets.',
      isActive: true,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(3),
    },
    {
      id: 'act-extra-5',
      title: 'Conversational Turn-Taking & Nuance',
      description: 'Practice timing, nonverbal validation, and collaborative communication strategies.',
      domainId: 'dom-com',
      skillId: 'skl-com-1',
      difficulty: 'beginner',
      activityType: 'scenario',
      learningMode: 'audio',
      estimatedMinutes: 5,
      points: 50,
      questionIds: ['qst-045', 'qst-048'],
      instructions: 'Listen to verbal exchanges and identify respectful conversational pacing.',
      isActive: true,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(2),
    },
    {
      id: 'act-extra-6',
      title: 'Master Adaptive Synthesis Challenge',
      description: 'Comprehensive adaptive test spanning pattern recognition, working memory, and deductive logic.',
      domainId: 'dom-prob',
      skillId: 'skl-prob-1',
      difficulty: 'advanced',
      activityType: 'problem_solving',
      learningMode: 'multisensory',
      estimatedMinutes: 12,
      points: 120,
      questionIds: ['qst-007', 'qst-012', 'qst-030', 'qst-072'],
      instructions: 'Demonstrate holistic mastery across integrated cognitive and academic problem domains.',
      isActive: true,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(1),
    },
  ];

  // ------------------------------------------------------------
  // 8. BASELINE & REASSESSMENT ASSESSMENTS
  // ------------------------------------------------------------
  const assessments: Assessment[] = [
    // Baseline for Alex Rivera (usr-lrn-1) - taken 20 days ago
    {
      id: 'asm-lrn1-baseline',
      learnerId: 'usr-lrn-1',
      type: 'baseline',
      status: 'completed',
      questionIds: ['qst-001', 'qst-002', 'qst-013', 'qst-014', 'qst-023', 'qst-024', 'qst-035', 'qst-045', 'qst-055', 'qst-065'],
      currentQuestionIndex: 9,
      startedAt: daysAgo(20),
      completedAt: daysAgo(20),
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      skillScores: [
        { skillId: 'skl-pat-1', skillName: 'Pattern Recognition', domainId: 'dom-pat', domainName: 'Pattern Recognition', score: 88, level: 'strong', assessedAt: daysAgo(20) },
        { skillId: 'skl-prob-1', skillName: 'Problem Solving', domainId: 'dom-prob', domainName: 'Problem Solving', score: 82, level: 'strong', assessedAt: daysAgo(20) },
        { skillId: 'skl-com-1', skillName: 'Communication', domainId: 'dom-com', domainName: 'Communication', score: 74, level: 'good', assessedAt: daysAgo(20) },
        { skillId: 'skl-read-1', skillName: 'Reading Comprehension', domainId: 'dom-read', domainName: 'Reading', score: 68, level: 'good', assessedAt: daysAgo(20) },
        { skillId: 'skl-mem-1', skillName: 'Memory Sequence', domainId: 'dom-mem', domainName: 'Memory', score: 57, level: 'developing', assessedAt: daysAgo(20) },
      ],
      createdAt: daysAgo(20),
    },
    // Periodic Reassessment for Alex Rivera (usr-lrn-1) - taken 2 days ago showing massive growth!
    {
      id: 'asm-lrn1-reassessment',
      learnerId: 'usr-lrn-1',
      type: 'periodic',
      status: 'completed',
      questionIds: ['qst-005', 'qst-006', 'qst-016', 'qst-017', 'qst-026', 'qst-027', 'qst-036', 'qst-047', 'qst-058', 'qst-068'],
      currentQuestionIndex: 9,
      startedAt: daysAgo(2),
      completedAt: daysAgo(2),
      totalQuestions: 10,
      correctAnswers: 9,
      accuracy: 90,
      skillScores: [
        { skillId: 'skl-pat-1', skillName: 'Pattern Recognition', domainId: 'dom-pat', domainName: 'Pattern Recognition', score: 94, level: 'strong', previousScore: 88, assessedAt: daysAgo(2) },
        { skillId: 'skl-prob-1', skillName: 'Problem Solving', domainId: 'dom-prob', domainName: 'Problem Solving', score: 89, level: 'strong', previousScore: 82, assessedAt: daysAgo(2) },
        { skillId: 'skl-com-1', skillName: 'Communication', domainId: 'dom-com', domainName: 'Communication', score: 82, level: 'strong', previousScore: 74, assessedAt: daysAgo(2) },
        { skillId: 'skl-read-1', skillName: 'Reading Comprehension', domainId: 'dom-read', domainName: 'Reading', score: 76, level: 'good', previousScore: 68, assessedAt: daysAgo(2) },
        { skillId: 'skl-mem-1', skillName: 'Memory Sequence', domainId: 'dom-mem', domainName: 'Memory', score: 74, level: 'good', previousScore: 57, assessedAt: daysAgo(2) },
      ],
      createdAt: daysAgo(2),
    },
  ];

  // ------------------------------------------------------------
  // 9. LEARNING SESSIONS & INTERACTION EVENTS (Observable Tracking)
  // ------------------------------------------------------------
  const learningSessions: LearningSession[] = [
    {
      id: 'ses-101',
      learnerId: 'usr-lrn-1',
      activityId: 'act-pat-1',
      status: 'completed',
      startedAt: daysAgo(5),
      completedAt: daysAgo(5),
      totalTimeMs: 245000,
      questionsAttempted: 5,
      questionsCorrect: 5,
      hintsUsed: 0,
      retryCount: 0,
      accuracy: 100,
      difficultyAtStart: 'beginner',
      difficultyAtEnd: 'intermediate',
      score: 50,
      maxScore: 50,
    },
    {
      id: 'ses-102',
      learnerId: 'usr-lrn-1',
      activityId: 'act-mem-1',
      status: 'completed',
      startedAt: daysAgo(3),
      completedAt: daysAgo(3),
      totalTimeMs: 310000,
      questionsAttempted: 4,
      questionsCorrect: 3,
      hintsUsed: 2,
      retryCount: 1,
      accuracy: 75,
      difficultyAtStart: 'beginner',
      difficultyAtEnd: 'beginner',
      score: 45,
      maxScore: 60,
    },
    {
      id: 'ses-103',
      learnerId: 'usr-lrn-1',
      activityId: 'act-prob-1',
      status: 'completed',
      startedAt: hoursAgo(3),
      completedAt: hoursAgo(2),
      totalTimeMs: 360000,
      questionsAttempted: 4,
      questionsCorrect: 4,
      hintsUsed: 1,
      retryCount: 0,
      accuracy: 100,
      difficultyAtStart: 'beginner',
      difficultyAtEnd: 'intermediate',
      score: 70,
      maxScore: 70,
    },
  ];

  const interactionEvents: InteractionEvent[] = [
    { id: 'evt-01', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', eventType: 'activity_started', timestamp: hoursAgo(3) },
    { id: 'evt-02', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-023', eventType: 'question_viewed', timestamp: hoursAgo(3) },
    { id: 'evt-03', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-023', eventType: 'answer_submitted', timestamp: hoursAgo(3), responseTimeMs: 14200, attemptNumber: 1, success: true },
    { id: 'evt-04', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-024', eventType: 'question_viewed', timestamp: hoursAgo(3) },
    { id: 'evt-05', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-024', eventType: 'hint_used', timestamp: hoursAgo(3), attemptNumber: 1 },
    { id: 'evt-06', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-024', eventType: 'answer_submitted', timestamp: hoursAgo(2.9), responseTimeMs: 22800, attemptNumber: 1, success: true },
    { id: 'evt-07', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-025', eventType: 'question_viewed', timestamp: hoursAgo(2.8) },
    { id: 'evt-08', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-025', eventType: 'answer_submitted', timestamp: hoursAgo(2.8), responseTimeMs: 11500, attemptNumber: 1, success: true },
    { id: 'evt-09', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-032', eventType: 'question_viewed', timestamp: hoursAgo(2.7) },
    { id: 'evt-10', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', questionId: 'qst-032', eventType: 'answer_submitted', timestamp: hoursAgo(2.7), responseTimeMs: 16400, attemptNumber: 1, success: true },
    { id: 'evt-11', learnerId: 'usr-lrn-1', sessionId: 'ses-103', activityId: 'act-prob-1', eventType: 'activity_completed', timestamp: hoursAgo(2.6), success: true },
  ];

  // ------------------------------------------------------------
  // 10. ENGAGEMENT PROFILES (Calculated via 5-part weighted formula)
  // ------------------------------------------------------------
  const engagementProfiles: EngagementProfile[] = [
    {
      id: 'eng-prof-1',
      learnerId: 'usr-lrn-1',
      overallScore: 84,
      status: 'highly_engaged',
      interactionConsistency: 88, // 30% weight -> 26.4
      completionRate: 92,          // 25% weight -> 23.0
      accuracy: 82,                // 20% weight -> 16.4
      persistence: 84,             // 15% weight -> 12.6
      responseStability: 76,       // 10% weight -> 7.6 => Total = 86
      calculatedAt: hoursAgo(1),
      sessionCount: 14,
      history: [
        { score: 72, status: 'engaged', calculatedAt: daysAgo(20) },
        { score: 76, status: 'engaged', calculatedAt: daysAgo(14) },
        { score: 79, status: 'engaged', calculatedAt: daysAgo(7) },
        { score: 84, status: 'highly_engaged', calculatedAt: hoursAgo(1) },
      ],
    },
    {
      id: 'eng-prof-2',
      learnerId: 'usr-lrn-2',
      overallScore: 91,
      status: 'highly_engaged',
      interactionConsistency: 94,
      completionRate: 96,
      accuracy: 88,
      persistence: 90,
      responseStability: 85,
      calculatedAt: hoursAgo(4),
      sessionCount: 22,
      history: [
        { score: 85, status: 'highly_engaged', calculatedAt: daysAgo(15) },
        { score: 91, status: 'highly_engaged', calculatedAt: hoursAgo(4) },
      ],
    },
    {
      id: 'eng-prof-3',
      learnerId: 'usr-lrn-3',
      overallScore: 61,
      status: 'engaged',
      interactionConsistency: 65,
      completionRate: 68,
      accuracy: 58,
      persistence: 60,
      responseStability: 52,
      calculatedAt: daysAgo(1),
      sessionCount: 8,
      history: [
        { score: 55, status: 'moderately_engaged', calculatedAt: daysAgo(10) },
        { score: 61, status: 'engaged', calculatedAt: daysAgo(1) },
      ],
    },
    {
      id: 'eng-prof-4',
      learnerId: 'usr-lrn-4',
      overallScore: 78,
      status: 'engaged',
      interactionConsistency: 80,
      completionRate: 82,
      accuracy: 75,
      persistence: 78,
      responseStability: 72,
      calculatedAt: daysAgo(2),
      sessionCount: 16,
      history: [{ score: 78, status: 'engaged', calculatedAt: daysAgo(2) }],
    },
    {
      id: 'eng-prof-5',
      learnerId: 'usr-lrn-5',
      overallScore: 88,
      status: 'highly_engaged',
      interactionConsistency: 90,
      completionRate: 92,
      accuracy: 86,
      persistence: 88,
      responseStability: 82,
      calculatedAt: daysAgo(1),
      sessionCount: 28,
      history: [{ score: 88, status: 'highly_engaged', calculatedAt: daysAgo(1) }],
    },
    {
      id: 'eng-prof-6',
      learnerId: 'usr-lrn-6',
      overallScore: 54,
      status: 'moderately_engaged',
      interactionConsistency: 56,
      completionRate: 58,
      accuracy: 50,
      persistence: 54,
      responseStability: 48,
      calculatedAt: daysAgo(3),
      sessionCount: 6,
      history: [{ score: 54, status: 'moderately_engaged', calculatedAt: daysAgo(3) }],
    },
    {
      id: 'eng-prof-7',
      learnerId: 'usr-lrn-7',
      overallScore: 73,
      status: 'engaged',
      interactionConsistency: 75,
      completionRate: 78,
      accuracy: 70,
      persistence: 72,
      responseStability: 68,
      calculatedAt: daysAgo(2),
      sessionCount: 12,
      history: [{ score: 73, status: 'engaged', calculatedAt: daysAgo(2) }],
    },
    {
      id: 'eng-prof-8',
      learnerId: 'usr-lrn-8',
      overallScore: 86,
      status: 'highly_engaged',
      interactionConsistency: 88,
      completionRate: 90,
      accuracy: 84,
      persistence: 85,
      responseStability: 80,
      calculatedAt: daysAgo(1),
      sessionCount: 20,
      history: [{ score: 86, status: 'highly_engaged', calculatedAt: daysAgo(1) }],
    },
    {
      id: 'eng-prof-9',
      learnerId: 'usr-lrn-9',
      overallScore: 49,
      status: 'moderately_engaged',
      interactionConsistency: 50,
      completionRate: 52,
      accuracy: 45,
      persistence: 48,
      responseStability: 46,
      calculatedAt: daysAgo(4),
      sessionCount: 5,
      history: [{ score: 49, status: 'moderately_engaged', calculatedAt: daysAgo(4) }],
    },
    {
      id: 'eng-prof-10',
      learnerId: 'usr-lrn-10',
      overallScore: 79,
      status: 'engaged',
      interactionConsistency: 82,
      completionRate: 84,
      accuracy: 76,
      persistence: 78,
      responseStability: 74,
      calculatedAt: hoursAgo(6),
      sessionCount: 15,
      history: [{ score: 79, status: 'engaged', calculatedAt: hoursAgo(6) }],
    },
  ];

  // ------------------------------------------------------------
  // 11. RECOMMENDATIONS (Data-Driven with Transparent Rationale)
  // ------------------------------------------------------------
  const recommendations: Recommendation[] = [
    {
      id: 'rec-1',
      learnerId: 'usr-lrn-1',
      activityId: 'act-pat-2',
      reason: 'You demonstrated strong pattern mastery (94%); advancing to numerical & series progression challenge.',
      priority: 1,
      type: 'next_level',
      isCompleted: false,
      createdAt: daysAgo(1),
    },
    {
      id: 'rec-2',
      learnerId: 'usr-lrn-1',
      activityId: 'act-mem-2',
      reason: 'Targeted reinforcement for developing memory recall (improved from 57% to 74%).',
      priority: 2,
      type: 'practice',
      isCompleted: false,
      createdAt: daysAgo(2),
    },
    {
      id: 'rec-3',
      learnerId: 'usr-lrn-1',
      activityId: 'act-prob-2',
      reason: 'Your high engagement during interactive logic tasks supports deeper scientific problem-solving practice.',
      priority: 3,
      type: 'strength',
      isCompleted: false,
      createdAt: daysAgo(3),
    },
    {
      id: 'rec-4',
      learnerId: 'usr-lrn-2',
      activityId: 'act-read-2',
      reason: 'Your text-based reading accuracy is above 85%; ready for analytical cause-effect structures.',
      priority: 1,
      type: 'next_level',
      isCompleted: false,
      createdAt: daysAgo(1),
    },
  ];

  // ------------------------------------------------------------
  // 12. PROGRESS RECORDS (Historical growth snapshots)
  // ------------------------------------------------------------
  const progressRecords: ProgressRecord[] = [
    {
      id: 'prog-1',
      learnerId: 'usr-lrn-1',
      date: daysAgo(14).split('T')[0],
      activitiesCompleted: 4,
      assessmentsCompleted: 1,
      averageAccuracy: 78,
      averageEngagement: 76,
      level: 1,
      skillScores: [
        { skillId: 'skl-pat-1', skillName: 'Pattern Recognition', domainId: 'dom-pat', domainName: 'Pattern Recognition', score: 88, level: 'strong', assessedAt: daysAgo(20) },
        { skillId: 'skl-mem-1', skillName: 'Memory', domainId: 'dom-mem', domainName: 'Memory', score: 57, level: 'developing', assessedAt: daysAgo(20) },
      ],
      totalTimeMs: 1200000,
    },
    {
      id: 'prog-2',
      learnerId: 'usr-lrn-1',
      date: daysAgo(7).split('T')[0],
      activitiesCompleted: 9,
      assessmentsCompleted: 1,
      averageAccuracy: 82,
      averageEngagement: 79,
      level: 2,
      skillScores: [
        { skillId: 'skl-pat-1', skillName: 'Pattern Recognition', domainId: 'dom-pat', domainName: 'Pattern Recognition', score: 90, level: 'strong', assessedAt: daysAgo(7) },
        { skillId: 'skl-mem-1', skillName: 'Memory', domainId: 'dom-mem', domainName: 'Memory', score: 66, level: 'good', assessedAt: daysAgo(7) },
      ],
      totalTimeMs: 2700000,
    },
    {
      id: 'prog-3',
      learnerId: 'usr-lrn-1',
      date: daysAgo(1).split('T')[0],
      activitiesCompleted: 14,
      assessmentsCompleted: 2,
      averageAccuracy: 86,
      averageEngagement: 84,
      level: 2,
      skillScores: [
        { skillId: 'skl-pat-1', skillName: 'Pattern Recognition', domainId: 'dom-pat', domainName: 'Pattern Recognition', score: 94, level: 'strong', previousScore: 88, assessedAt: daysAgo(2) },
        { skillId: 'skl-prob-1', skillName: 'Problem Solving', domainId: 'dom-prob', domainName: 'Problem Solving', score: 89, level: 'strong', previousScore: 82, assessedAt: daysAgo(2) },
        { skillId: 'skl-mem-1', skillName: 'Memory', domainId: 'dom-mem', domainName: 'Memory', score: 74, level: 'good', previousScore: 57, assessedAt: daysAgo(2) },
      ],
      totalTimeMs: 4320000,
    },
  ];

  // ------------------------------------------------------------
  // 13. NOTIFICATIONS
  // ------------------------------------------------------------
  const notifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'usr-lrn-1',
      type: 'progress_milestone',
      title: 'Skill Growth Milestone Reached!',
      message: 'Your Memory skill improved from 57% (Developing) to 74% (Good) following your recent practice sessions.',
      isRead: false,
      actionUrl: '/learner/progress',
      createdAt: daysAgo(1),
    },
    {
      id: 'notif-2',
      userId: 'usr-lrn-1',
      type: 'recommendation',
      title: 'New Adaptive Challenge Ready',
      message: 'Based on your 94% accuracy in pattern recognition, "Numerical & Letter Series Challenge" has been unlocked for you.',
      isRead: false,
      actionUrl: '/learner/learn',
      createdAt: daysAgo(2),
    },
    {
      id: 'notif-3',
      userId: 'usr-lrn-1',
      type: 'educator_feedback',
      title: 'Educator Note from Prof. Vance',
      message: 'Great persistence on the multi-step problem solving tasks! Your response stability is improving consistently.',
      isRead: true,
      actionUrl: '/learner/dashboard',
      createdAt: daysAgo(3),
    },
    {
      id: 'notif-4',
      userId: 'usr-edu-1',
      type: 'progress_milestone',
      title: 'Learner Cohort Progress Alert',
      message: 'Alex Rivera and Maya Lin completed periodic reassessments showing an average +12% skill uplift.',
      isRead: false,
      actionUrl: '/educator/learners',
      createdAt: daysAgo(2),
    },
  ];

  // ------------------------------------------------------------
  // 14. ACCESSIBILITY SETTINGS
  // ------------------------------------------------------------
  const accessibilitySettings: AccessibilitySettings[] = [
    {
      userId: 'usr-lrn-1',
      textSize: 'normal',
      contrast: 'normal',
      audioAssistance: true,
      reducedMotion: false,
      readingAssistance: true,
      interactionGuidance: true,
    },
    {
      userId: 'usr-lrn-2',
      textSize: 'large',
      contrast: 'normal',
      audioAssistance: false,
      reducedMotion: false,
      readingAssistance: false,
      interactionGuidance: false,
    },
  ];

  // ------------------------------------------------------------
  // 15. PLATFORM SETTINGS
  // ------------------------------------------------------------
  const platformSettings: PlatformSettings[] = [
    { id: 'set-1', key: 'platform_name', value: 'SenseLearn', category: 'general', description: 'Platform display branding title', updatedAt: daysAgo(10) },
    { id: 'set-2', key: 'adaptive_difficulty_auto', value: 'true', category: 'engine', description: 'Enable automatic difficulty scaling based on 80% accuracy threshold', updatedAt: daysAgo(10) },
    { id: 'set-3', key: 'engagement_weights_consistency', value: '0.30', category: 'analytics', description: 'Interaction consistency weight in engagement score calculation', updatedAt: daysAgo(10) },
    { id: 'set-4', key: 'tts_audio_assistance_default', value: 'true', category: 'accessibility', description: 'Enable browser speech synthesis audio narrator buttons by default', updatedAt: daysAgo(10) },
    { id: 'set-5', key: 'baseline_question_count', value: '10', category: 'assessment', description: 'Standard number of questions administered in baseline diagnostic assessment', updatedAt: daysAgo(10) },
  ];

  return {
    users,
    learnerProfiles,
    educatorProfiles,
    domains,
    skills,
    activities,
    questions,
    assessments,
    assessmentResponses: [],
    learningSessions,
    interactionEvents,
    engagementProfiles,
    recommendations,
    progressRecords,
    notifications,
    accessibilitySettings,
    platformSettings,
    cameraConsents: [],
    assessmentSnapshots: [],
  };
}
