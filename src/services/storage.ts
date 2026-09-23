import {
  User,
  UserRole,
  LegalPost,
  Community,
  LegalJob,
  LegalEvent,
  NotificationItem,
  ModerationReport,
  LawyerVerificationRequest,
  Conversation,
  DirectMessage,
  JobApplication,
  ConnectionRequest,
  VerificationStatus,
  LegalPostCategory
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_COMMUNITIES,
  INITIAL_JOBS,
  INITIAL_EVENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_REPORTS
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'lexjurist_current_user_id',
  USERS: 'lexjurist_users_v1',
  POSTS: 'lexjurist_posts_v1',
  COMMUNITIES: 'lexjurist_communities_v1',
  JOBS: 'lexjurist_jobs_v1',
  JOB_APPLICATIONS: 'lexjurist_job_apps_v1',
  EVENTS: 'lexjurist_events_v1',
  CONVERSATIONS: 'lexjurist_conversations_v1',
  MESSAGES: 'lexjurist_messages_v1',
  NOTIFICATIONS: 'lexjurist_notifications_v1',
  VERIFICATIONS: 'lexjurist_verifications_v1',
  REPORTS: 'lexjurist_reports_v1',
  CONNECTIONS: 'lexjurist_connections_v1',
  SAVED_ITEMS: 'lexjurist_saved_items_v1',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeStorage(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading storage key ${key}:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch (err) {
    console.error(`Error saving storage key ${key}:`, err);
  }
}

export const LegalStorage = {
  // Current session & auth
  getCurrentUserId(): string {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return stored || 'user-eleanor-vance';
  },

  setCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    notify();
  },

  getCurrentUser(): User {
    const currentId = this.getCurrentUserId();
    const users = this.getUsers();
    const match = users.find((u) => u.id === currentId);
    return match || users[0];
  },

  getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  updateUser(updated: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === updated.id);
    if (index >= 0) {
      users[index] = updated;
    } else {
      users.push(updated);
    }
    setStored(STORAGE_KEYS.USERS, users);
  },

  registerUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    setStored(STORAGE_KEYS.USERS, users);
    this.setCurrentUserId(user.id);
  },

  createUser(userData: {
    fullName: string;
    email: string;
    role: UserRole;
    lawyerProfile?: any;
    organizationProfile?: any;
  }): User {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      isEmailVerified: true,
      status: 'active',
      isSuspended: false,
      createdAt: new Date().toISOString(),
      lawyerProfile: userData.lawyerProfile
        ? {
            ...userData.lawyerProfile,
            id: `prof-${Date.now()}`,
            userId: `user-${Date.now()}`,
            fullName: userData.fullName,
            headline: `${userData.lawyerProfile.title} at ${userData.lawyerProfile.firmOrOrganization}`,
            contactPreferences: {
              allowDirectMessages: 'connections_only',
              showEmailToConnections: true,
              showPhoneToConnections: false,
              availableForReferrals: true,
            },
          }
        : undefined,
      organizationProfile: userData.organizationProfile
        ? {
            ...userData.organizationProfile,
            id: `org-${Date.now()}`,
            userId: `user-${Date.now()}`,
            size: '50-200 attorneys',
            activeJobsCount: 1,
          }
        : undefined,
      privacySettings: {
        profileVisibility: 'public',
        whoCanMessage: 'connections_only',
        whoCanConnect: 'everyone',
        showNetwork: true,
      },
    };

    this.registerUser(newUser);
    return newUser;
  },

  // Posts
  getPosts(): LegalPost[] {
    return getStored<LegalPost[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  },

  createPost(data: {
    category: LegalPostCategory;
    content: string;
    caseCitation?: string;
    tags: string[];
    documentName?: string;
    communityId?: string;
    communityName?: string;
  }): LegalPost {
    const user = this.getCurrentUser();
    const newPost: LegalPost = {
      id: `post-${Date.now()}`,
      authorId: user.id,
      authorName: user.fullName,
      authorTitle: user.lawyerProfile?.title || user.organizationProfile?.tagline || 'Legal Professional',
      authorFirm: user.lawyerProfile?.firmOrOrganization || user.organizationProfile?.name || 'Chambers',
      authorRole: user.role,
      authorVerification: user.lawyerProfile?.verificationStatus || (user.organizationProfile?.isVerified ? 'verified' : 'not_verified'),
      category: data.category,
      caseCitation: data.caseCitation,
      content: data.content,
      tags: data.tags,
      documentName: data.documentName,
      reactions: {},
      comments: [],
      sharesCount: 0,
      communityId: data.communityId,
      communityName: data.communityName,
      createdAt: new Date().toISOString(),
    };

    const posts = this.getPosts();
    posts.unshift(newPost);
    setStored(STORAGE_KEYS.POSTS, posts);

    // If posted to community, increment count
    if (data.communityId) {
      const comms = this.getCommunities();
      const comm = comms.find((c) => c.id === data.communityId);
      if (comm) {
        comm.postsCount += 1;
        setStored(STORAGE_KEYS.COMMUNITIES, comms);
      }
    }

    return newPost;
  },

  toggleReaction(postId: string, reactionType: 'helpful' | 'insightful' | 'agree' | 'precedent'): void {
    const user = this.getCurrentUser();
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (!post.reactions) post.reactions = {};

    if (post.reactions[user.id] === reactionType) {
      delete post.reactions[user.id];
    } else {
      post.reactions[user.id] = reactionType;
    }

    setStored(STORAGE_KEYS.POSTS, posts);
  },

  addComment(postId: string, content: string): void {
    const user = this.getCurrentUser();
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: user.id,
      authorName: user.fullName,
      authorTitle: user.lawyerProfile?.title || 'Legal Professional',
      authorFirm: user.lawyerProfile?.firmOrOrganization || 'Legal Practice',
      authorVerification: user.lawyerProfile?.verificationStatus || 'not_verified',
      content,
      createdAt: new Date().toISOString(),
      likes: [],
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    setStored(STORAGE_KEYS.POSTS, posts);

    // Notify author if not same
    if (post.authorId !== user.id) {
      this.createNotification({
        userId: post.authorId,
        type: 'comment',
        title: 'New response to your legal post',
        description: `${user.fullName} commented on your ${post.category} publication.`,
        link: '/home',
      });
    }
  },

  deletePost(postId: string): void {
    const posts = this.getPosts().filter((p) => p.id !== postId);
    setStored(STORAGE_KEYS.POSTS, posts);
  },

  // Communities
  getCommunities(): Community[] {
    return getStored<Community[]>(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES);
  },

  toggleJoinCommunity(communityId: string): void {
    const user = this.getCurrentUser();
    const comms = this.getCommunities();
    const comm = comms.find((c) => c.id === communityId);
    if (!comm) return;

    const isMember = comm.memberIds.includes(user.id);
    if (isMember) {
      comm.memberIds = comm.memberIds.filter((id) => id !== user.id);
      comm.membersCount = Math.max(0, comm.membersCount - 1);
    } else {
      comm.memberIds.push(user.id);
      comm.membersCount += 1;
    }
    setStored(STORAGE_KEYS.COMMUNITIES, comms);
  },

  // Jobs
  getJobs(): LegalJob[] {
    return getStored<LegalJob[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },

  createJob(jobData: Omit<LegalJob, 'id' | 'createdAt' | 'applicantsCount' | 'status'>): LegalJob {
    const jobs = this.getJobs();
    const newJob: LegalJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      applicantsCount: 0,
      status: 'active',
    };
    jobs.unshift(newJob);
    setStored(STORAGE_KEYS.JOBS, jobs);
    return newJob;
  },

  getJobApplications(): JobApplication[] {
    return getStored<JobApplication[]>(STORAGE_KEYS.JOB_APPLICATIONS, []);
  },

  submitJobApplication(application: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>): JobApplication {
    const apps = this.getJobApplications();
    const newApp: JobApplication = {
      ...application,
      id: `app-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    apps.unshift(newApp);
    setStored(STORAGE_KEYS.JOB_APPLICATIONS, apps);

    // Increment applicantsCount on job
    const jobs = this.getJobs();
    const job = jobs.find((j) => j.id === application.jobId);
    if (job) {
      job.applicantsCount += 1;
      setStored(STORAGE_KEYS.JOBS, jobs);
    }

    return newApp;
  },

  // Events
  getEvents(): LegalEvent[] {
    return getStored<LegalEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  toggleEventRsvp(eventId: string): boolean {
    const user = this.getCurrentUser();
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) return false;

    const isRegistered = event.attendeeIds.includes(user.id);
    if (isRegistered) {
      event.attendeeIds = event.attendeeIds.filter((id) => id !== user.id);
      event.attendeesCount = Math.max(0, event.attendeesCount - 1);
    } else {
      event.attendeeIds.push(user.id);
      event.attendeesCount += 1;
    }
    setStored(STORAGE_KEYS.EVENTS, events);
    return !isRegistered;
  },

  createEvent(eventData: Omit<LegalEvent, 'id' | 'attendeesCount' | 'attendeeIds'>): LegalEvent {
    const user = this.getCurrentUser();
    const events = this.getEvents();
    const newEvent: LegalEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      attendeesCount: 1,
      attendeeIds: [user.id],
    };
    events.unshift(newEvent);
    setStored(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  // Connections
  getConnections(): ConnectionRequest[] {
    return getStored<ConnectionRequest[]>(STORAGE_KEYS.CONNECTIONS, [
      {
        id: 'conn-demo-1',
        senderId: 'user-david-oconnor',
        receiverId: 'user-eleanor-vance',
        status: 'pending',
        note: 'Eleanor, I greatly admired your Second Circuit competition brief and would welcome connecting on LexJurist.',
        createdAt: '2026-09-21T11:15:00Z',
      },
      {
        id: 'conn-demo-2',
        senderId: 'user-eleanor-vance',
        receiverId: 'user-marcus-chen',
        status: 'accepted',
        createdAt: '2025-02-05T10:00:00Z',
      },
      {
        id: 'conn-demo-3',
        senderId: 'user-eleanor-vance',
        receiverId: 'user-sarah-mansoor',
        status: 'accepted',
        createdAt: '2025-02-20T12:00:00Z',
      }
    ]);
  },

  sendConnectionRequest(targetUserId: string, note?: string): void {
    const user = this.getCurrentUser();
    const connections = this.getConnections();
    const existing = connections.find(
      (c) =>
        (c.senderId === user.id && c.receiverId === targetUserId) ||
        (c.senderId === targetUserId && c.receiverId === user.id)
    );

    if (existing) return;

    const newReq: ConnectionRequest = {
      id: `conn-${Date.now()}`,
      senderId: user.id,
      receiverId: targetUserId,
      status: 'pending',
      note,
      createdAt: new Date().toISOString(),
    };
    connections.unshift(newReq);
    setStored(STORAGE_KEYS.CONNECTIONS, connections);

    this.createNotification({
      userId: targetUserId,
      type: 'connection_request',
      title: 'New Connection Request',
      description: `${user.fullName} requested to connect with you.`,
      link: '/connections',
    });
  },

  respondConnectionRequest(requestId: string, accept: boolean): void {
    const connections = this.getConnections();
    const req = connections.find((c) => c.id === requestId);
    if (!req) return;

    req.status = accept ? 'accepted' : 'rejected';
    setStored(STORAGE_KEYS.CONNECTIONS, connections);

    if (accept) {
      // update connectionsCount on both users
      const users = this.getUsers();
      const u1 = users.find((u) => u.id === req.senderId);
      const u2 = users.find((u) => u.id === req.receiverId);
      if (u1?.lawyerProfile) u1.lawyerProfile.connectionsCount += 1;
      if (u2?.lawyerProfile) u2.lawyerProfile.connectionsCount += 1;
      setStored(STORAGE_KEYS.USERS, users);

      this.createNotification({
        userId: req.senderId,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        description: `${u2?.fullName || 'Colleague'} accepted your connection request.`,
        link: `/profile/${req.receiverId}`,
      });
    }
  },

  // Messaging
  getConversations(): Conversation[] {
    return getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  },

  getMessages(): DirectMessage[] {
    return getStored<DirectMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  },

  sendMessage(recipientId: string, content: string): DirectMessage {
    const user = this.getCurrentUser();
    const messages = this.getMessages();
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      recipientId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };
    messages.push(newMsg);
    setStored(STORAGE_KEYS.MESSAGES, messages);

    // Update or create conversation
    const convos = this.getConversations();
    let convo = convos.find(
      (c) => c.participantIds.includes(user.id) && c.participantIds.includes(recipientId)
    );

    if (!convo) {
      convo = {
        id: `conv-${user.id}-${recipientId}`,
        participantIds: [user.id, recipientId],
        lastMessage: newMsg,
        unreadCount: { [recipientId]: 1, [user.id]: 0 },
        updatedAt: newMsg.createdAt,
      };
      convos.unshift(convo);
    } else {
      convo.lastMessage = newMsg;
      convo.unreadCount = {
        ...convo.unreadCount,
        [recipientId]: (convo.unreadCount[recipientId] || 0) + 1,
      };
      convo.updatedAt = newMsg.createdAt;
    }
    setStored(STORAGE_KEYS.CONVERSATIONS, convos);

    return newMsg;
  },

  markConversationRead(conversationId: string): void {
    const user = this.getCurrentUser();
    const convos = this.getConversations();
    const convo = convos.find((c) => c.id === conversationId);
    if (!convo) return;

    if (convo.unreadCount[user.id] > 0) {
      convo.unreadCount[user.id] = 0;
      setStored(STORAGE_KEYS.CONVERSATIONS, convos);
    }
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    const user = this.getCurrentUser();
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter((n) => n.userId === user.id);
  },

  createNotification(data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void {
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    all.unshift(newNotif);
    setStored(STORAGE_KEYS.NOTIFICATIONS, all);
  },

  markAllNotificationsRead(): void {
    const user = this.getCurrentUser();
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    all.forEach((n) => {
      if (n.userId === user.id) n.read = true;
    });
    setStored(STORAGE_KEYS.NOTIFICATIONS, all);
  },

  markNotificationRead(notificationId: string): void {
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const notif = all.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
      setStored(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  },

  // Verifications
  getVerificationRequests(): LawyerVerificationRequest[] {
    return getStored<LawyerVerificationRequest[]>(
      STORAGE_KEYS.VERIFICATIONS,
      INITIAL_VERIFICATION_REQUESTS
    );
  },

  createVerificationRequest(req: {
    barCouncil: string;
    jurisdiction: string;
    licenseNumber: string;
    admissionYear: number;
    documentUrl?: string;
    documentSummary?: string;
  }): void {
    this.submitVerificationRequest({
      barCouncil: req.barCouncil,
      jurisdiction: req.jurisdiction,
      licenseNumber: req.licenseNumber,
      admissionYear: req.admissionYear,
      documentSummary: req.documentSummary || req.documentUrl || 'Certificate of Good Standing',
    });
  },

  submitVerificationRequest(req: {
    barCouncil: string;
    jurisdiction: string;
    licenseNumber: string;
    admissionYear: number;
    documentSummary: string;
  }): void {
    const user = this.getCurrentUser();
    const requests = this.getVerificationRequests();

    const newReq: LawyerVerificationRequest = {
      id: `verif-${Date.now()}`,
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      barCouncil: req.barCouncil,
      jurisdiction: req.jurisdiction,
      licenseNumber: req.licenseNumber,
      admissionYear: req.admissionYear,
      firmName: user.lawyerProfile?.firmOrOrganization || 'Legal Practice',
      documentSummary: req.documentSummary,
      documentUrl: req.documentSummary,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    requests.unshift(newReq);
    setStored(STORAGE_KEYS.VERIFICATIONS, requests);

    // Update user profile status
    if (user.lawyerProfile) {
      user.lawyerProfile.verificationStatus = 'pending';
      this.updateUser(user);
    }
  },

  processVerificationRequest(requestId: string, status: 'approved' | 'rejected', notes: string): void {
    this.reviewVerification(requestId, status === 'approved' ? 'verified' : 'rejected', notes);
  },

  reviewVerification(requestId: string, status: VerificationStatus, adminNotes: string): void {
    const admin = this.getCurrentUser();
    const requests = this.getVerificationRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = status;
    req.reviewedBy = admin.fullName;
    req.reviewedAt = new Date().toISOString();
    req.adminNotes = adminNotes;
    setStored(STORAGE_KEYS.VERIFICATIONS, requests);

    // Update target user
    const users = this.getUsers();
    const targetUser = users.find((u) => u.id === req.userId);
    if (targetUser && targetUser.lawyerProfile) {
      targetUser.lawyerProfile.verificationStatus = status;
      if (status === 'verified') {
        targetUser.lawyerProfile.verificationBadgeGrantedAt = new Date().toISOString();
        if (targetUser.lawyerProfile.barAdmissions[0]) {
          targetUser.lawyerProfile.barAdmissions[0].isVerified = true;
        }
      }
      setStored(STORAGE_KEYS.USERS, users);

      this.createNotification({
        userId: targetUser.id,
        type: 'verification',
        title: status === 'verified' ? 'Bar Verification Approved' : 'Bar Verification Update',
        description:
          status === 'verified'
            ? 'Your credentials have been verified by the admissions committee. Verified Lawyer badge is now active on your profile.'
            : `Your verification request was reviewed: ${adminNotes || 'Please supply additional documentation.'}`,
        link: '/profile',
      });
    }
  },

  // Moderation / Reports
  getReports(): ModerationReport[] {
    return getStored<ModerationReport[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  },

  createReport(data: {
    targetType: 'post' | 'comment' | 'profile' | 'job' | 'community' | 'message';
    targetId: string;
    targetTitle: string;
    reason: 'Spam' | 'Harassment' | 'False Information' | 'Unauthorized Practice of Law' | 'Ethics Violation' | 'Fraud / Scam' | 'Other';
    explanation: string;
  }): void {
    const user = this.getCurrentUser();
    const reports = this.getReports();
    const newReport: ModerationReport = {
      id: `rep-${Date.now()}`,
      reporterId: user.id,
      reporterName: user.fullName,
      targetType: data.targetType,
      targetId: data.targetId,
      targetTitle: data.targetTitle,
      reason: data.reason,
      explanation: data.explanation,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    reports.unshift(newReport);
    setStored(STORAGE_KEYS.REPORTS, reports);
  },

  resolveReport(reportId: string, action: 'resolved' | 'dismissed', actionTaken?: string): void {
    const reports = this.getReports();
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    rep.status = action;
    rep.actionTaken = actionTaken;
    setStored(STORAGE_KEYS.REPORTS, reports);
  },

  // Saved / Bookmarks
  getSavedItems(): { posts: string[]; jobs: string[]; events: string[] } {
    return getStored(STORAGE_KEYS.SAVED_ITEMS, {
      posts: ['post-1'],
      jobs: ['job-1'],
      events: ['event-1'],
    });
  },

  toggleSaveItem(type: 'posts' | 'jobs' | 'events', id: string): boolean {
    const saved = this.getSavedItems();
    const list = saved[type];
    const index = list.indexOf(id);
    let isSaved = false;
    if (index >= 0) {
      list.splice(index, 1);
      isSaved = false;
    } else {
      list.push(id);
      isSaved = true;
    }
    setStored(STORAGE_KEYS.SAVED_ITEMS, saved);
    return isSaved;
  },

  // Reset to initial demo state
  resetAll(): void {
    localStorage.clear();
    notify();
  }
};
