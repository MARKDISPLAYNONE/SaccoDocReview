import { randomUUID } from "crypto";
import type {
  User, InsertUser,
  Member, InsertMember,
  Account, InsertAccount,
  Transaction, InsertTransaction,
  Loan, InsertLoan,
  Guarantor, InsertGuarantor,
  Notification, InsertNotification,
  Document, InsertDocument,
  AuditLog, InsertAuditLog,
  Message, InsertMessage,
  Campaign, InsertCampaign,
  Referral, InsertReferral,
  Setting, InsertSetting,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Members
  getMember(id: string): Promise<Member | undefined>;
  getMemberByUserId(userId: string): Promise<Member | undefined>;
  getMemberByMemberNumber(memberNumber: string): Promise<Member | undefined>;
  getAllMembers(limit?: number, offset?: number): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, updates: Partial<Member>): Promise<Member | undefined>;
  
  // Accounts
  getAccount(id: string): Promise<Account | undefined>;
  getAccountsByMemberId(memberId: string): Promise<Account[]>;
  getAllAccounts(): Promise<Account[]>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccountBalance(id: string, newBalance: string): Promise<Account | undefined>;
  
  // Transactions
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByAccountId(accountId: string, limit?: number): Promise<Transaction[]>;
  getTransactionsByMemberId(memberId: string, limit?: number): Promise<Transaction[]>;
  getAllTransactions(limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Loans
  getLoan(id: string): Promise<Loan | undefined>;
  getLoansByMemberId(memberId: string): Promise<Loan[]>;
  getLoansByStatus(status: string): Promise<Loan[]>;
  getAllLoans(): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: string, updates: Partial<Loan>): Promise<Loan | undefined>;
  
  // Guarantors
  getGuarantorsByLoanId(loanId: string): Promise<Guarantor[]>;
  createGuarantor(guarantor: InsertGuarantor): Promise<Guarantor>;
  updateGuarantor(id: string, updates: Partial<Guarantor>): Promise<Guarantor | undefined>;
  
  // Notifications
  getNotificationsByUserId(userId: string, limit?: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  
  // Documents
  getDocumentsByMemberId(memberId: string): Promise<Document[]>;
  getDocumentsByLoanId(loanId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Audit Logs
  getAuditLogsByUserId(userId: string, limit?: number): Promise<AuditLog[]>;
  getAuditLogsByEntityId(entityId: string): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  
  // Messages
  getMessagesByUserId(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined>;
  
  // Campaigns
  getAllCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  
  // Referrals
  getReferralsByMemberId(memberId: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  
  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  getAllSettings(): Promise<Setting[]>;
  createOrUpdateSetting(setting: InsertSetting): Promise<Setting>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private members: Map<string, Member>;
  private accounts: Map<string, Account>;
  private transactions: Map<string, Transaction>;
  private loans: Map<string, Loan>;
  private guarantors: Map<string, Guarantor>;
  private notifications: Map<string, Notification>;
  private documents: Map<string, Document>;
  private auditLogs: Map<string, AuditLog>;
  private messages: Map<string, Message>;
  private campaigns: Map<string, Campaign>;
  private referrals: Map<string, Referral>;
  private settings: Map<string, Setting>;

  constructor() {
    this.users = new Map();
    this.members = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.loans = new Map();
    this.guarantors = new Map();
    this.notifications = new Map();
    this.documents = new Map();
    this.auditLogs = new Map();
    this.messages = new Map();
    this.campaigns = new Map();
    this.referrals = new Map();
    this.settings = new Map();
    
    this.seedDemoData();
  }

  // ==================== USERS ====================
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date().toISOString() };
    this.users.set(id, user);
    return user;
  }

  // ==================== MEMBERS ====================
  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByUserId(userId: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(m => m.userId === userId);
  }

  async getMemberByMemberNumber(memberNumber: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(m => m.memberNumber === memberNumber);
  }

  async getAllMembers(limit: number = 100, offset: number = 0): Promise<Member[]> {
    return Array.from(this.members.values()).slice(offset, offset + limit);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const member: Member = {
      ...insertMember,
      id,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    this.members.set(id, member);
    return member;
  }

  async updateMember(id: string, updates: Partial<Member>): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    
    const updated = { ...member, ...updates };
    this.members.set(id, updated);
    return updated;
  }

  // ==================== ACCOUNTS ====================
  async getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async getAccountsByMemberId(memberId: string): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(a => a.memberId === memberId);
  }

  async getAllAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = randomUUID();
    const account: Account = {
      ...insertAccount,
      id,
      openedAt: new Date().toISOString(),
    };
    this.accounts.set(id, account);
    return account;
  }

  async updateAccountBalance(id: string, newBalance: string): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account) return undefined;
    
    const updated = { ...account, balance: newBalance };
    this.accounts.set(id, updated);
    return updated;
  }

  // ==================== TRANSACTIONS ====================
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByAccountId(accountId: string, limit: number = 50): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getTransactionsByMemberId(memberId: string, limit: number = 50): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.memberId === memberId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getAllTransactions(limit: number = 100): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date().toISOString(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // ==================== LOANS ====================
  async getLoan(id: string): Promise<Loan | undefined> {
    return this.loans.get(id);
  }

  async getLoansByMemberId(memberId: string): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(l => l.memberId === memberId);
  }

  async getLoansByStatus(status: string): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(l => l.status === status);
  }

  async getAllLoans(): Promise<Loan[]> {
    return Array.from(this.loans.values());
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const id = randomUUID();
    const loan: Loan = {
      ...insertLoan,
      id,
      appliedAt: new Date().toISOString(),
    };
    this.loans.set(id, loan);
    return loan;
  }

  async updateLoan(id: string, updates: Partial<Loan>): Promise<Loan | undefined> {
    const loan = this.loans.get(id);
    if (!loan) return undefined;
    
    const updated = { ...loan, ...updates };
    this.loans.set(id, updated);
    return updated;
  }

  // ==================== GUARANTORS ====================
  async getGuarantorsByLoanId(loanId: string): Promise<Guarantor[]> {
    return Array.from(this.guarantors.values()).filter(g => g.loanId === loanId);
  }

  async createGuarantor(insertGuarantor: InsertGuarantor): Promise<Guarantor> {
    const id = randomUUID();
    const guarantor: Guarantor = {
      ...insertGuarantor,
      id,
      createdAt: new Date().toISOString(),
    };
    this.guarantors.set(id, guarantor);
    return guarantor;
  }

  async updateGuarantor(id: string, updates: Partial<Guarantor>): Promise<Guarantor | undefined> {
    const guarantor = this.guarantors.get(id);
    if (!guarantor) return undefined;
    
    const updated = { ...guarantor, ...updates };
    this.guarantors.set(id, updated);
    return updated;
  }

  // ==================== NOTIFICATIONS ====================
  async getNotificationsByUserId(userId: string, limit: number = 20): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updated = { ...notification, isRead: true };
    this.notifications.set(id, updated);
    return updated;
  }

  // ==================== DOCUMENTS ====================
  async getDocumentsByMemberId(memberId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.memberId === memberId);
  }

  async getDocumentsByLoanId(loanId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.loanId === loanId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      uploadedAt: new Date().toISOString(),
    };
    this.documents.set(id, document);
    return document;
  }

  // ==================== AUDIT LOGS ====================
  async getAuditLogsByUserId(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .filter(l => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getAuditLogsByEntityId(entityId: string): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values()).filter(l => l.entityId === entityId);
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = {
      ...insertLog,
      id,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.set(id, log);
    return log;
  }

  // ==================== MESSAGES ====================
  async getMessagesByUserId(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.senderId === userId || m.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date().toISOString(),
    };
    this.messages.set(id, message);
    return message;
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updated = { ...message, ...updates };
    this.messages.set(id, updated);
    return updated;
  }

  // ==================== CAMPAIGNS ====================
  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      createdAt: new Date().toISOString(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  // ==================== REFERRALS ====================
  async getReferralsByMemberId(memberId: string): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(r => r.referrerMemberId === memberId);
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = randomUUID();
    const referral: Referral = {
      ...insertReferral,
      id,
      createdAt: new Date().toISOString(),
    };
    this.referrals.set(id, referral);
    return referral;
  }

  // ==================== SETTINGS ====================
  async getSetting(key: string): Promise<Setting | undefined> {
    return Array.from(this.settings.values()).find(s => s.key === key);
  }

  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }

  async createOrUpdateSetting(insertSetting: InsertSetting): Promise<Setting> {
    const existing = await this.getSetting(insertSetting.key);
    
    if (existing) {
      const updated: Setting = {
        ...existing,
        ...insertSetting,
        updatedAt: new Date().toISOString(),
      };
      this.settings.set(existing.id, updated);
      return updated;
    }
    
    const id = randomUUID();
    const setting: Setting = {
      ...insertSetting,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.settings.set(id, setting);
    return setting;
  }

  // ==================== DEMO DATA SEEDING ====================
  private seedDemoData() {
    console.log("🌱 Seeding comprehensive demo data for SACCO platform...");

    // Kenyan first names and last names for realistic data
    const firstNames = ["John", "Jane", "Peter", "Mary", "David", "Grace", "James", "Alice", "Joseph", "Ruth", 
      "Daniel", "Faith", "Samuel", "Rose", "Stephen", "Joy", "Moses", "Christine", "Benjamin", "Lucy",
      "Isaac", "Sarah", "Joshua", "Agnes", "Emmanuel", "Margaret", "Patrick", "Catherine", "Michael", "Ann"];
    
    const lastNames = ["Kamau", "Wanjiku", "Omondi", "Nyambura", "Kiprop", "Akinyi", "Mwangi", "Chebet",
      "Ndung'u", "Adhiambo", "Kiptoo", "Wambui", "Kimani", "Otieno", "Kiplagat", "Wanjiru"];
    
    const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kitale", "Kakamega"];
    
    const occupations = ["Teacher", "Nurse", "Driver", "Accountant", "Engineer", "Shop Owner", "Farmer", 
      "Mechanic", "Tailor", "Security Guard", "Salesperson", "Chef"];

    // Create staff and admin users
    const staffUser = {
      id: "staff-user-1",
      username: "staff.user",
      password: "staff123",
      role: "staff",
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const adminUser = {
      id: "admin-user-1",
      username: "admin.user",
      password: "admin123",
      role: "admin",
      createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.users.set(staffUser.id, staffUser);
    this.users.set(adminUser.id, adminUser);

    const allMembers: Member[] = [];
    
    // Generate 80 members (including John Doe)
    for (let i = 0; i < 80; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const userId = `member-user-${i + 1}`;
      const memberId = `member-${i + 1}`;
      const joinDaysAgo = Math.floor(Math.random() * 730) + 30; // 30 days to 2 years ago
      
      // Create user
      const user = {
        id: userId,
        username: i === 0 ? "john.doe" : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`,
        password: "member123",
        role: "member",
        createdAt: new Date(Date.now() - joinDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
      };
      this.users.set(user.id, user);

      // Create member
      const member: Member = {
        id: memberId,
        userId: user.id,
        memberNumber: `APL${String(i + 1).padStart(6, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+2547${String(10000000 + i).slice(0, 8)}`,
        idNumber: String(10000000 + i * 123).slice(0, 8),
        kraPin: `A${String(100000000 + i).slice(0, 9)}P`,
        dateOfBirth: `19${60 + (i % 35)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        gender: i % 2 === 0 ? "male" : "female",
        occupation: occupations[i % occupations.length],
        employer: i % 3 === 0 ? `${occupations[i % occupations.length]} Ltd` : null,
        monthlyIncome: String((30000 + (i * 5000) % 150000).toFixed(2)),
        address: `${i + 1} ${lastNames[i % lastNames.length]} Street`,
        city: counties[i % counties.length],
        county: counties[i % counties.length],
        status: i % 20 === 0 ? "inactive" : "active",
        kycStatus: i % 15 === 0 ? "pending" : "verified",
        profilePhoto: null,
        joinedAt: new Date(Date.now() - joinDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - (i % 7) * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      this.members.set(member.id, member);
      allMembers.push(member);

      // Create accounts for each member
      const sharesBalance = 20000 + (i * 2500) % 80000;
      const savingsBalance = 50000 + (i * 7000) % 200000;

      const sharesAccount: Account = {
        id: `acc-shares-${i + 1}`,
        memberId: member.id,
        accountType: "shares",
        accountNumber: `SH${String(1000000 + i).slice(0, 9)}`,
        balance: String(sharesBalance.toFixed(2)),
        interestRate: "8.00",
        status: "active",
        openedAt: member.joinedAt,
      };

      const savingsAccount: Account = {
        id: `acc-savings-${i + 1}`,
        memberId: member.id,
        accountType: "savings",
        accountNumber: `SV${String(1000000 + i).slice(0, 9)}`,
        balance: String(savingsBalance.toFixed(2)),
        interestRate: "6.50",
        status: "active",
        openedAt: member.joinedAt,
      };

      this.accounts.set(sharesAccount.id, sharesAccount);
      this.accounts.set(savingsAccount.id, savingsAccount);

      // Create emergency account for some members
      if (i % 3 === 0) {
        const emergencyAccount: Account = {
          id: `acc-emergency-${i + 1}`,
          memberId: member.id,
          accountType: "emergency",
          accountNumber: `EM${String(1000000 + i).slice(0, 9)}`,
          balance: String((10000 + (i * 1000) % 30000).toFixed(2)),
          interestRate: "5.00",
          status: "active",
          openedAt: new Date(Date.now() - (joinDaysAgo / 2) * 24 * 60 * 60 * 1000).toISOString(),
        };
        this.accounts.set(emergencyAccount.id, emergencyAccount);
      }

      // Generate transactions for last 6 months
      const monthsToGenerate = 6;
      for (let month = 0; month < monthsToGenerate; month++) {
        const daysAgo = month * 30 + (i % 30);
        
        // Monthly deposit
        const depositAmount = 3000 + (i * 500) % 10000;
        const depositTxn: Transaction = {
          id: `txn-deposit-${i}-${month}`,
          accountId: savingsAccount.id,
          memberId: member.id,
          type: "deposit",
          amount: String(depositAmount.toFixed(2)),
          balanceBefore: String((parseFloat(savingsAccount.balance) - depositAmount).toFixed(2)),
          balanceAfter: savingsAccount.balance,
          description: "Monthly Contribution",
          reference: `TXN${Date.now()}${i}${month}DEP`,
          channel: i % 2 === 0 ? "mpesa" : "cash",
          status: "completed",
          processedBy: i % 2 === 0 ? null : staffUser.id,
          metadata: null,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        };
        this.transactions.set(depositTxn.id, depositTxn);

        // Interest payment monthly
        const interestAmount = (parseFloat(savingsAccount.balance) * 0.065 / 12);
        const interestTxn: Transaction = {
          id: `txn-interest-${i}-${month}`,
          accountId: sharesAccount.id,
          memberId: member.id,
          type: "interest",
          amount: String(interestAmount.toFixed(2)),
          balanceBefore: String((parseFloat(sharesAccount.balance) - interestAmount).toFixed(2)),
          balanceAfter: sharesAccount.balance,
          description: "Monthly Interest",
          reference: `TXN${Date.now()}${i}${month}INT`,
          channel: "system",
          status: "completed",
          processedBy: null,
          metadata: null,
          createdAt: new Date(Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000).toISOString(),
        };
        this.transactions.set(interestTxn.id, interestTxn);
      }
    }

    // Generate 30 diverse loans
    const loanTypes = ["emergency", "development", "school_fees", "business", "asset_financing"];
    const loanStatuses = ["pending", "approved", "rejected", "disbursed", "active", "completed", "defaulted"];
    
    for (let i = 0; i < 30; i++) {
      const member = allMembers[i % allMembers.length];
      const loanType = loanTypes[i % loanTypes.length];
      const principal = (i + 1) * 15000 + (i * 5000) % 200000;
      const interestRate = loanType === "emergency" ? 12 : loanType === "business" ? 14 : 10;
      const term = loanType === "emergency" ? 12 : loanType === "school_fees" ? 18 : 24;
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      const totalAmount = monthlyPayment * term;
      const status = loanStatuses[i % loanStatuses.length];
      const daysAgo = 90 + (i * 10);
      
      let outstandingBalance = "0.00";
      let disbursedAt = null;
      let disbursedAmount = null;
      
      if (status === "active" || status === "completed" || status === "defaulted") {
        const monthsPaid = i % term;
        outstandingBalance = String((totalAmount - (monthlyPayment * monthsPaid)).toFixed(2));
        disbursedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
        disbursedAmount = String(principal.toFixed(2));
      }

      const loan: Loan = {
        id: `loan-${i + 1}`,
        memberId: member.id,
        loanNumber: `LN${String(100000 + i).slice(0, 9)}`,
        loanType: loanType as any,
        principalAmount: String(principal.toFixed(2)),
        interestRate: String(interestRate.toFixed(2)),
        totalAmount: String(totalAmount.toFixed(2)),
        outstandingBalance: status === "completed" ? "0.00" : outstandingBalance,
        monthlyRepayment: String(monthlyPayment.toFixed(2)),
        loanTerm: term,
        purpose: `${loanType.replace(/_/g, ' ')} purpose`,
        status: status as any,
        creditScore: 500 + (i * 15) % 350,
        disbursedAmount,
        disbursedAt,
        firstRepaymentDate: disbursedAt ? new Date(new Date(disbursedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        nextRepaymentDate: (status === "active" && disbursedAt) ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        completedAt: status === "completed" ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        approvedBy: status !== "pending" && status !== "rejected" ? staffUser.id : null,
        rejectedReason: status === "rejected" ? "Insufficient savings balance" : null,
        appliedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      this.loans.set(loan.id, loan);
    }

    console.log(`✅ Demo data seeded: ${allMembers.length} members, ${this.accounts.size} accounts, ${this.transactions.size} transactions, ${this.loans.size} loans`);
  }
}

export const storage = new MemStorage();
