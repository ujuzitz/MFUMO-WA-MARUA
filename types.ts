
export enum Language {
  EN = 'en',
  SW = 'sw'
}

export enum InstitutionType {
  GOVERNMENT = 'government',
  NGO = 'ngo',
  PRIVATE = 'private'
}

export enum Tone {
  FRIENDLY = 'friendly',
  PROFESSIONAL = 'professional',
  BOLD = 'bold'
}

export interface FormData {
  fullName: string;
  applicantAddress: string;
  email: string;
  phone: string;
  companyName: string;
  employerAddress: string;
  department: string;
  jobTitle: string;
  institutionType: InstitutionType;
  generationLanguage: Language;
  tone: Tone;
  jobDescription: string;
  skills?: string;
}

export interface Translation {
  title: string;
  heroTitle: string;
  heroSub: string;
  createBtn: string;
  subtitle: string;
  personalInfo: string;
  employerInfo: string;
  jobDetails: string;
  documents: string;
  styleSettings: string;
  fullName: string;
  email: string;
  phone: string;
  applicantAddress: string;
  employerAddress: string;
  jobTitle: string;
  companyName: string;
  department: string;
  institutionType: string;
  generationLanguage: string;
  toneLabel: string;
  toneFriendly: string;
  toneFriendlyDesc: string;
  toneProfessional: string;
  toneProfessionalDesc: string;
  toneBold: string;
  toneBoldDesc: string;
  jobDescriptionLabel: string;
  uploadCv: string;
  cvHelper: string;
  generateBtn: string;
  generating: string;
  previewTitle: string;
  downloadPdf: string;
  copyText: string;
  govt: string;
  ngo: string;
  private: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderJob: string;
  placeholderCompany: string;
  placeholderDept: string;
  placeholderAddress: string;
  placeholderPhone: string;
  placeholderJobDesc: string;
  footerTagline: string;
  optional: string;
  required: string;
  langEn: string;
  langSw: string;
}
