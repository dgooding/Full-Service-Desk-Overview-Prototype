export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'domains',
    name: 'Business Domains',
    skills: [
      { id: 'ETS', name: 'ETS', description: 'Expertise in Emergency Technical Services workflows.' },
      { id: 'Agent', name: 'Agent Portal', description: 'Proficiency in the Agent-facing portal and tools.' },
      { id: 'Claims', name: 'Claims Systems', description: 'Handling and processing of insurance or service claims.' },
      { id: 'Property', name: 'Property Mgmt', description: 'Specialized support for property-related modules.' },
      { id: 'Fleet', name: 'Fleet Ops', description: 'Logistics and diagnostic support for fleet vehicle systems.' },
    ]
  },
  {
    id: 'core',
    name: 'Core Technical',
    skills: [
      { id: 'Hardware Diagnostic', name: 'Hardware Diagnostic', description: 'Ability to identify and resolve physical hardware failures.' },
      { id: 'Software Provisioning', name: 'Software Provisioning', description: 'Deployment and configuration of enterprise software suites.' },
      { id: 'Network Troubleshooting', name: 'Network Troubleshooting', description: 'Resolving connectivity, DNS, and local network issues.' },
    ]
  },
  {
    id: 'specialized',
    name: 'Identity & Access',
    skills: [
      { id: 'Cloud (Azure/AWS)', name: 'Cloud (Azure/AWS)', description: 'Administration of cloud resources and user permissions.' },
      { id: 'Identity (AD/Okta)', name: 'Identity (AD/Okta)', description: 'Management of user identities and access control.' },
      { id: 'VPN & Connectivity', name: 'VPN & Connectivity', description: 'Supporting remote access and secure tunnel protocols.' },
    ]
  }
];

export const ALL_SKILL_IDS = SKILL_CATEGORIES.flatMap(cat => cat.skills.map(s => s.id));

export const PROFICIENCY_LEVELS = [
  { level: 0, label: 'None', description: 'No experience or exposure to this skill.', color: 'bg-slate-100', text: 'text-slate-400' },
  { level: 1, label: 'Novice', description: 'Basic understanding, requires constant guidance.', color: 'bg-brand-100', text: 'text-brand-600' },
  { level: 2, label: 'Advanced beginner', description: 'Practical knowledge, can perform simple tasks independently.', color: 'bg-brand-200', text: 'text-brand-700' },
  { level: 3, label: 'Competent', description: 'Solid working knowledge, handles standard issues effectively.', color: 'bg-brand-300', text: 'text-brand-800' },
  { level: 4, label: 'Proficient', description: 'Expert efficiency, can guide others and solve complex problems.', color: 'bg-brand-400', text: 'text-brand-900' },
  { level: 5, label: 'Expert', description: 'Strategic authority, creates workflows and drives technical standards.', color: 'bg-brand-500', text: 'text-white' },
];
