export type UserRole = 'lawyer' | 'organization' | 'admin';

export type VerificationStatus = 'not_verified' | 'pending' | 'verified' | 'rejected';

export interface BarAdmission {
  id: string;
  barCouncil: string;
  jurisdiction: string;
  licenseNumber: string;
  admissionYear: number;
  status: 'active' | 'inactive' | 'emeritus';
  isVerified: boolean;
}

export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  graduationYear: number;
  honors?: string;
}

export interface LawyerProfile {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  headline: string;
  firmOrOrganization: string;
  avatarUrl?: string;
  coverUrl?: string;
  location: {
    city: string;
    country: string;
  };
  primaryPracticeArea: string;
  practiceAreas: string[];
  yearsOfExperience: number;
  barAdmissions: BarAdmission[];
  experience: ExperienceItem[];
  education: EducationItem[];
  languages: string[];
  bio: string;
  website?: string;
  linkedIn?: string;
  contactPreferences: {
    allowDirectMessages: 'everyone' | 'connections_only' | 'none';
    showEmailToConnections: boolean;
    showPhoneToConnections: boolean;
    availableForReferrals: boolean;
  };
  connectionsCount: number;
  followingCount: number;
  followersCount: number;
  verificationStatus: VerificationStatus;
  verificationBadgeGrantedAt?: string;
  isDemoAccount?: boolean;
}

export interface OrganizationProfile {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  firmType: 'Law Firm' | 'Corporate Legal Dept' | 'Bar Association' | 'Legal Tech' | 'Judiciary / Court';
  headquarters: string;
  size: string;
  practiceAreas: string[];
  website: string;
  about: string;
  isVerified: boolean;
  activeJobsCount: number;
  isDemoAccount?: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  isEmailVerified: boolean;
  lawyerProfile?: LawyerProfile;
  organizationProfile?: OrganizationProfile;
  createdAt: string;
  status: 'active' | 'suspended';
  isSuspended?: boolean;
  privacySettings: {
    profileVisibility: 'public' | 'members_only' | 'connections_only';
    whoCanMessage: 'everyone' | 'connections_only';
    whoCanConnect: 'everyone' | 'mutual_connections';
    showNetwork: boolean;
  };
}

export type LegalPostCategory = 
  | 'Legal Analysis' 
  | 'Case Precedent' 
  | 'Practice Query' 
  | 'Court Update' 
  | 'Professional Article' 
  | 'Ethics & Practice';

export interface PostReaction {
  userId: string;
  type: 'helpful' | 'insightful' | 'agree' | 'precedent';
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorFirm: string;
  authorVerification: VerificationStatus;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface LegalPost {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorFirm: string;
  authorRole: UserRole;
  authorVerification: VerificationStatus;
  category: LegalPostCategory;
  caseCitation?: string;
  content: string;
  tags: string[];
  documentName?: string;
  documentType?: 'PDF' | 'Brief' | 'Statute';
  reactions: Record<string, 'helpful' | 'insightful' | 'agree' | 'precedent'>;
  comments: PostComment[];
  sharesCount: number;
  communityId?: string;
  communityName?: string;
  createdAt: string;
  isPinned?: boolean;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  note?: string;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
  attachmentName?: string;
}

export interface Conversation {
  id: string;
  participantIds: [string, string];
  lastMessage: DirectMessage;
  unreadCount: Record<string, number>;
  updatedAt: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  guidelines: string;
  moderatorId: string;
  membersCount: number;
  postsCount: number;
  isPrivate: boolean;
  memberIds: string[];
  bannerAccent: string;
}

export interface LegalJob {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  practiceArea: string;
  employmentType: 'Full-time Associate' | 'Partner Track' | 'Of Counsel' | 'General Counsel' | 'Legal Director' | 'Contract / Temp';
  experienceRequired: string;
  location: string;
  isRemoteFriendly: boolean;
  salaryRange?: string;
  description: string;
  keyResponsibilities: string[];
  requirements: string[];
  barRequirements: string;
  applicationDeadline: string;
  applicantsCount: number;
  status: 'active' | 'closed';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  organizationName: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantBarNumber: string;
  primaryPractice: string;
  yearsExperience: number;
  coverNote: string;
  resumeFileName: string;
  status: 'submitted' | 'reviewing' | 'interview_requested' | 'rejected' | 'accepted';
  submittedAt: string;
}

export interface LegalEvent {
  id: string;
  title: string;
  organizer: string;
  format: 'Webinar' | 'In-Person Conference' | 'Hybrid CLE' | 'Panel Discussion';
  cleCredits?: number;
  practiceArea: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  locationOrUrl: string;
  description: string;
  speakers: string[];
  attendeesCount: number;
  attendeeIds: string[];
  maxAttendees?: number;
  registrationFee?: string;
  registrationOpen: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'reaction' | 'comment' | 'message' | 'verification' | 'job_status' | 'event';
  title: string;
  description: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'post' | 'comment' | 'profile' | 'job' | 'community' | 'message';
  targetId: string;
  targetTitle: string;
  reason: 'Spam' | 'Harassment' | 'False Information' | 'Unauthorized Practice of Law' | 'Ethics Violation' | 'Fraud / Scam' | 'Other';
  explanation: string;
  status: 'pending' | 'resolved' | 'dismissed';
  actionTaken?: string;
  createdAt: string;
}

export type ContentReport = ModerationReport;
export type Notification = NotificationItem;

export interface LawyerVerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  barCouncil: string;
  jurisdiction: string;
  licenseNumber: string;
  admissionYear: number;
  firmName: string;
  documentSummary: string;
  documentUrl?: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export type VerificationRequest = LawyerVerificationRequest;
