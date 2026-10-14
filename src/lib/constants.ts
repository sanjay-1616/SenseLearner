// ============================================================
// SenseLearn — Constants & Configuration
// ============================================================

export const APP_NAME = 'SenseLearn';
export const APP_TAGLINE = 'Learning That Adapts to Every Learner';
export const APP_DESCRIPTION = 'An interactive multisensory learning platform that understands learner needs, adapts learning experiences and transforms learning interactions into meaningful insights.';

export const DEMO_CREDENTIALS = {
  learner: { email: 'learner@demo.com', password: 'Demo1234!' },
  educator: { email: 'educator@demo.com', password: 'Demo1234!' },
  admin: { email: 'admin@demo.com', password: 'Demo1234!' },
};

export const LEARNING_PREFERENCES = [
  { id: 'visual', label: 'Visual', icon: 'Eye', description: 'Learn through images, diagrams, and visual content' },
  { id: 'audio', label: 'Audio', icon: 'Headphones', description: 'Learn through listening and verbal instructions' },
  { id: 'text', label: 'Text', icon: 'BookOpen', description: 'Learn through reading and written materials' },
  { id: 'interactive', label: 'Interactive', icon: 'MousePointerClick', description: 'Learn through hands-on activities and interaction' },
  { id: 'mixed', label: 'Mixed', icon: 'Layers', description: 'A combination of multiple learning styles' },
] as const;

export const SUPPORT_PREFERENCES = [
  { id: 'larger_text', label: 'Larger Text', icon: 'Type', description: 'Display text in a larger size for better readability' },
  { id: 'audio_assistance', label: 'Audio Assistance', icon: 'Volume2', description: 'Hear instructions and content read aloud' },
  { id: 'step_by_step', label: 'Step-by-Step Guidance', icon: 'ListChecks', description: 'Break tasks into smaller, guided steps' },
  { id: 'hints', label: 'Hints', icon: 'Lightbulb', description: 'Receive helpful hints when you need them' },
  { id: 'repetition', label: 'Repetition', icon: 'Repeat', description: 'Practice the same concept multiple times' },
  { id: 'reduced_complexity', label: 'Reduced Visual Complexity', icon: 'Minimize2', description: 'Simpler layouts with fewer distractions' },
  { id: 'extra_time', label: 'Extra Time', icon: 'Clock', description: 'No time pressure on activities and assessments' },
] as const;

export const LEARNING_DOMAINS = [
  { id: 'academic', name: 'Academic Skills', icon: 'GraduationCap', color: '#3B82F6' },
  { id: 'cognitive', name: 'Cognitive Skills', icon: 'Brain', color: '#8B5CF6' },
  { id: 'communication', name: 'Communication', icon: 'MessageSquare', color: '#06B6D4' },
  { id: 'problem_solving', name: 'Problem Solving', icon: 'Puzzle', color: '#F59E0B' },
  { id: 'memory', name: 'Memory', icon: 'Database', color: '#EF4444' },
  { id: 'pattern', name: 'Pattern Recognition', icon: 'Grid3x3', color: '#10B981' },
  { id: 'reading', name: 'Reading', icon: 'BookOpen', color: '#6366F1' },
  { id: 'life_skills', name: 'Life Skills', icon: 'Heart', color: '#EC4899' },
  { id: 'creativity', name: 'Creativity', icon: 'Palette', color: '#F97316' },
  { id: 'practical', name: 'Practical Skills', icon: 'Wrench', color: '#14B8A6' },
] as const;

export const ONBOARDING_STEPS = [
  { id: 1, title: 'About You', description: 'Tell us a little about yourself' },
  { id: 2, title: 'Learning Style', description: 'How do you prefer to learn?' },
  { id: 3, title: 'Learning Areas', description: 'What would you like to learn?' },
  { id: 4, title: 'Support Needs', description: 'How can we best support you?' },
  { id: 5, title: 'Assessment', description: 'Let\'s see where you are' },
] as const;

export const ENGAGEMENT_WEIGHTS = {
  interactionConsistency: 0.30,
  completion: 0.25,
  accuracy: 0.20,
  persistence: 0.15,
  responseStability: 0.10,
} as const;

export const ADAPTIVE_RULES = {
  INCREASE_THRESHOLD: 80,
  MAINTAIN_MIN: 50,
  DECREASE_THRESHOLD: 50,
  HINT_AFTER_MISTAKES: 2,
  HIGH_RESPONSE_TIME_MS: 30000,
  CONSECUTIVE_SUCCESS_FOR_ADVANCE: 3,
  CONSECUTIVE_FAIL_FOR_SUPPORT: 3,
} as const;

export const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'] as const;

export const NAV_ITEMS = {
  learner: [
    { label: 'Dashboard', href: '/learner/dashboard', icon: 'LayoutDashboard' },
    { label: 'Learn', href: '/learner/learn', icon: 'BookOpen' },
    { label: 'Assessments', href: '/learner/assessments', icon: 'ClipboardList' },
    { label: 'My Profile', href: '/learner/profile', icon: 'User' },
    { label: 'Progress', href: '/learner/progress', icon: 'TrendingUp' },
    { label: 'Recommendations', href: '/learner/recommendations', icon: 'Sparkles' },
    { label: 'Accessibility', href: '/learner/accessibility', icon: 'Accessibility' },
    { label: 'Notifications', href: '/learner/notifications', icon: 'Bell' },
  ],
  educator: [
    { label: 'Dashboard', href: '/educator/dashboard', icon: 'LayoutDashboard' },
    { label: 'Learners', href: '/educator/learners', icon: 'Users' },
    { label: 'Engagement', href: '/educator/engagement', icon: 'Activity' },
    { label: 'Analytics', href: '/educator/analytics', icon: 'BarChart3' },
    { label: 'Insights', href: '/educator/insights', icon: 'Lightbulb' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'Activities', href: '/admin/activities', icon: 'Puzzle' },
    { label: 'Question Bank', href: '/admin/questions', icon: 'HelpCircle' },
    { label: 'Domains', href: '/admin/domains', icon: 'Layers' },
    { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
} as const;

export const COLORS = {
  primary: '#1e3a5f',
  primaryLight: '#2d5a8e',
  primaryDark: '#0f1d30',
  teal: '#0d9488',
  purple: '#7c3aed',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
} as const;
