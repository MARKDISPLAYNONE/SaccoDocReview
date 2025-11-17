import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==================== USERS & AUTH ====================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'member' | 'staff' | 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ==================== MEMBERS ====================
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  memberNumber: text("member_number").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  idNumber: text("id_number").notNull().unique(),
  kraPin: text("kra_pin"),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  occupation: text("occupation"),
  employer: text("employer"),
  monthlyIncome: decimal("monthly_income", { precision: 12, scale: 2 }),
  address: text("address"),
  city: text("city"),
  county: text("county"),
  status: text("status").notNull(), // 'active' | 'inactive' | 'suspended'
  kycStatus: text("kyc_status").notNull(), // 'pending' | 'verified' | 'rejected'
  profilePhoto: text("profile_photo"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastActive: timestamp("last_active"),
});

export const insertMemberSchema = createInsertSchema(members).omit({ id: true, joinedAt: true });
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

// ==================== ACCOUNTS ====================
export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull(),
  accountType: text("account_type").notNull(), // 'shares' | 'savings' | 'emergency' | 'fixed_deposit'
  accountNumber: text("account_number").notNull().unique(),
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default('0'),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'active' | 'dormant' | 'closed'
  openedAt: timestamp("opened_at").defaultNow().notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true, openedAt: true });
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

// ==================== TRANSACTIONS ====================
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").notNull(),
  memberId: varchar("member_id").notNull(),
  type: text("type").notNull(), // 'deposit' | 'withdrawal' | 'transfer' | 'loan_disbursement' | 'loan_repayment' | 'interest' | 'dividend' | 'fee'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  balanceBefore: decimal("balance_before", { precision: 12, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  reference: text("reference").notNull().unique(),
  channel: text("channel").notNull(), // 'mpesa' | 'cash' | 'bank_transfer' | 'internal' | 'system'
  status: text("status").notNull(), // 'pending' | 'completed' | 'failed' | 'reversed'
  processedBy: varchar("processed_by"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// ==================== LOANS ====================
export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull(),
  loanNumber: text("loan_number").notNull().unique(),
  loanType: text("loan_type").notNull(), // 'emergency' | 'development' | 'school_fees' | 'business' | 'asset_financing'
  principalAmount: decimal("principal_amount", { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  outstandingBalance: decimal("outstanding_balance", { precision: 12, scale: 2 }).notNull(),
  monthlyRepayment: decimal("monthly_repayment", { precision: 12, scale: 2 }).notNull(),
  loanTerm: integer("loan_term").notNull(), // in months
  purpose: text("purpose").notNull(),
  status: text("status").notNull(), // 'pending' | 'approved' | 'rejected' | 'disbursed' | 'active' | 'completed' | 'defaulted'
  creditScore: integer("credit_score"),
  disbursedAmount: decimal("disbursed_amount", { precision: 12, scale: 2 }),
  disbursedAt: timestamp("disbursed_at"),
  firstRepaymentDate: text("first_repayment_date"),
  nextRepaymentDate: text("next_repayment_date"),
  completedAt: timestamp("completed_at"),
  approvedBy: varchar("approved_by"),
  rejectedReason: text("rejected_reason"),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, appliedAt: true });
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;

// ==================== GUARANTORS ====================
export const guarantors = pgTable("guarantors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").notNull(),
  guarantorMemberId: varchar("guarantor_member_id").notNull(),
  guaranteedAmount: decimal("guaranteed_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'pending' | 'approved' | 'rejected'
  approvedAt: timestamp("approved_at"),
  rejectedReason: text("rejected_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGuarantorSchema = createInsertSchema(guarantors).omit({ id: true, createdAt: true });
export type InsertGuarantor = z.infer<typeof insertGuarantorSchema>;
export type Guarantor = typeof guarantors.$inferSelect;

// ==================== NOTIFICATIONS ====================
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'transaction' | 'loan' | 'system' | 'reminder' | 'alert'
  priority: text("priority").notNull(), // 'low' | 'medium' | 'high'
  isRead: boolean("is_read").notNull().default(false),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// ==================== DOCUMENTS ====================
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id"),
  loanId: varchar("loan_id"),
  documentType: text("document_type").notNull(), // 'id_card' | 'kra_pin' | 'payslip' | 'bank_statement' | 'loan_agreement' | 'other'
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedBy: varchar("uploaded_by").notNull(),
  status: text("status").notNull(), // 'pending' | 'verified' | 'rejected'
  verifiedBy: varchar("verified_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadedAt: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// ==================== AUDIT LOGS ====================
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // 'member' | 'account' | 'transaction' | 'loan' | 'user'
  entityId: varchar("entity_id").notNull(),
  changes: jsonb("changes"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// ==================== MESSAGES / SUPPORT TICKETS ====================
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull(),
  receiverId: varchar("receiver_id"),
  subject: text("subject"),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'inquiry' | 'complaint' | 'feedback' | 'request' | 'announcement'
  priority: text("priority").notNull(), // 'low' | 'medium' | 'high'
  status: text("status").notNull(), // 'open' | 'in_progress' | 'resolved' | 'closed'
  assignedTo: varchar("assigned_to"),
  isRead: boolean("is_read").notNull().default(false),
  parentId: varchar("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// ==================== CAMPAIGNS ====================
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'referral' | 'promotion' | 'recruitment' | 'savings_drive'
  description: text("description").notNull(),
  status: text("status").notNull(), // 'draft' | 'active' | 'paused' | 'completed'
  targetAudience: text("target_audience").notNull(), // 'all' | 'active' | 'dormant' | 'new'
  message: text("message").notNull(),
  channel: text("channel").notNull(), // 'sms' | 'email' | 'in_app' | 'all'
  totalReach: integer("total_reach").notNull().default(0),
  totalResponses: integer("total_responses").notNull().default(0),
  createdBy: varchar("created_by").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

// ==================== REFERRALS ====================
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerMemberId: varchar("referrer_member_id").notNull(),
  referredMemberId: varchar("referred_member_id"),
  referralCode: text("referral_code").notNull().unique(),
  referredName: text("referred_name"),
  referredPhone: text("referred_phone"),
  status: text("status").notNull(), // 'pending' | 'registered' | 'completed'
  reward: decimal("reward", { precision: 12, scale: 2 }),
  rewardPaid: boolean("reward_paid").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true, createdAt: true });
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

// ==================== SETTINGS ====================
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  category: text("category").notNull(), // 'system' | 'loan' | 'account' | 'notification' | 'compliance'
  description: text("description"),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({ id: true, updatedAt: true });
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
