import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertAccountSchema, insertTransactionSchema, insertLoanSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTH & USER ROUTES ====================
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const member = await storage.getMemberByUserId(user.id);
      
      return res.json({
        user: { ...user, password: undefined },
        member,
      });
    } catch (error) {
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const member = await storage.getMemberByUserId(userId);
    return res.json({ user: { ...user, password: undefined }, member });
  });

  // ==================== MEMBER ROUTES ====================
  app.get("/api/members", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      // If userId is provided, get member by userId
      if (userId) {
        const member = await storage.getMemberByUserId(userId);
        return res.json(member ? [member] : []);
      }
      
      // Otherwise return all members with pagination
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      const members = await storage.getAllMembers(limit, offset);
      return res.json(members);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      return res.json(member);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch member" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const validated = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(validated);
      return res.status(201).json(member);
    } catch (error) {
      return res.status(400).json({ error: "Invalid member data" });
    }
  });

  app.patch("/api/members/:id", async (req, res) => {
    try {
      const updated = await storage.updateMember(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Member not found" });
      }
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update member" });
    }
  });

  // ==================== ACCOUNT ROUTES ====================
  app.get("/api/accounts", async (req, res) => {
    try {
      const memberId = req.query.memberId as string;
      
      if (memberId) {
        const accounts = await storage.getAccountsByMemberId(memberId);
        return res.json(accounts);
      }
      
      const accounts = await storage.getAllAccounts();
      return res.json(accounts);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      return res.json(account);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch account" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const validated = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(validated);
      return res.status(201).json(account);
    } catch (error) {
      return res.status(400).json({ error: "Invalid account data" });
    }
  });

  // ==================== TRANSACTION ROUTES ====================
  app.get("/api/transactions", async (req, res) => {
    try {
      const memberId = req.query.memberId as string;
      const accountId = req.query.accountId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      
      if (memberId) {
        const transactions = await storage.getTransactionsByMemberId(memberId, limit);
        return res.json(transactions);
      }
      
      if (accountId) {
        const transactions = await storage.getTransactionsByAccountId(accountId, limit);
        return res.json(transactions);
      }
      
      const transactions = await storage.getAllTransactions(limit);
      return res.json(transactions);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validated = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validated);
      
      // Update account balance
      await storage.updateAccountBalance(validated.accountId, validated.balanceAfter);
      
      // Create notification
      await storage.createNotification({
        userId: validated.memberId,
        title: `Transaction ${validated.type}`,
        message: `${validated.description} - ${validated.amount}`,
        type: "transaction",
        priority: "medium",
        isRead: false,
        actionUrl: "/member/transactions",
        metadata: null,
      });
      
      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  // ==================== LOAN ROUTES ====================
  app.get("/api/loans", async (req, res) => {
    try {
      const memberId = req.query.memberId as string;
      const status = req.query.status as string;
      
      if (memberId) {
        const loans = await storage.getLoansByMemberId(memberId);
        return res.json(loans);
      }
      
      if (status) {
        const loans = await storage.getLoansByStatus(status);
        return res.json(loans);
      }
      
      const loans = await storage.getAllLoans();
      return res.json(loans);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch loans" });
    }
  });

  app.get("/api/loans/:id", async (req, res) => {
    try {
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }
      return res.json(loan);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch loan" });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const validated = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(validated);
      
      // Create notification for new loan application
      await storage.createNotification({
        userId: validated.memberId,
        title: "Loan Application Received",
        message: `Your loan application for ${validated.principalAmount} has been received and is being processed`,
        type: "loan",
        priority: "high",
        isRead: false,
        actionUrl: "/member/loans",
        metadata: null,
      });
      
      return res.status(201).json(loan);
    } catch (error) {
      return res.status(400).json({ error: "Invalid loan data" });
    }
  });

  app.patch("/api/loans/:id", async (req, res) => {
    try {
      const updated = await storage.updateLoan(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Loan not found" });
      }
      
      // Create notification for loan status update
      if (req.body.status === "approved") {
        await storage.createNotification({
          userId: updated.memberId,
          title: "Loan Approved!",
          message: `Your loan of ${updated.principalAmount} has been approved`,
          type: "loan",
          priority: "high",
          isRead: false,
          actionUrl: "/member/loans",
          metadata: null,
        });
      } else if (req.body.status === "rejected") {
        await storage.createNotification({
          userId: updated.memberId,
          title: "Loan Application Update",
          message: `Your loan application has been reviewed`,
          type: "loan",
          priority: "high",
          isRead: false,
          actionUrl: "/member/loans",
          metadata: null,
        });
      }
      
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update loan" });
    }
  });

  // ==================== GUARANTOR ROUTES ====================
  app.get("/api/guarantors", async (req, res) => {
    try {
      const loanId = req.query.loanId as string;
      if (!loanId) {
        return res.status(400).json({ error: "loanId is required" });
      }
      
      const guarantors = await storage.getGuarantorsByLoanId(loanId);
      return res.json(guarantors);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch guarantors" });
    }
  });

  // ==================== NOTIFICATION ROUTES ====================
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      const limit = parseInt(req.query.limit as string) || 20;
      const notifications = await storage.getNotificationsByUserId(userId, limit);
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const updated = await storage.markNotificationAsRead(req.params.id);
      if (!updated) {
        return res.status(404).json({ error: "Notification not found" });
      }
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update notification" });
    }
  });

  // ==================== DOCUMENT ROUTES ====================
  app.get("/api/documents", async (req, res) => {
    try {
      const memberId = req.query.memberId as string;
      const loanId = req.query.loanId as string;
      
      if (memberId) {
        const documents = await storage.getDocumentsByMemberId(memberId);
        return res.json(documents);
      }
      
      if (loanId) {
        const documents = await storage.getDocumentsByLoanId(loanId);
        return res.json(documents);
      }
      
      return res.status(400).json({ error: "memberId or loanId is required" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // ==================== MESSAGE ROUTES ====================
  app.get("/api/messages", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      const messages = await storage.getMessagesByUserId(userId);
      return res.json(messages);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // ==================== CAMPAIGN ROUTES ====================
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      return res.json(campaigns);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  // ==================== REFERRAL ROUTES ====================
  app.get("/api/referrals", async (req, res) => {
    try {
      const memberId = req.query.memberId as string;
      if (!memberId) {
        return res.status(400).json({ error: "memberId is required" });
      }
      
      const referrals = await storage.getReferralsByMemberId(memberId);
      return res.json(referrals);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  // ==================== SETTINGS ROUTES ====================
  app.get("/api/settings", async (req, res) => {
    try {
      const key = req.query.key as string;
      
      if (key) {
        const setting = await storage.getSetting(key);
        return res.json(setting);
      }
      
      const settings = await storage.getAllSettings();
      return res.json(settings);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // ==================== AUDIT LOG ROUTES ====================
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const entityId = req.query.entityId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      
      if (userId) {
        const logs = await storage.getAuditLogsByUserId(userId, limit);
        return res.json(logs);
      }
      
      if (entityId) {
        const logs = await storage.getAuditLogsByEntityId(entityId);
        return res.json(logs);
      }
      
      return res.status(400).json({ error: "userId or entityId is required" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // ==================== ANALYTICS & STATS ROUTES ====================
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      const role = req.query.role as string;
      const userId = req.query.userId as string;
      
      if (role === "member" && userId) {
        const member = await storage.getMemberByUserId(userId);
        if (!member) {
          return res.status(404).json({ error: "Member not found" });
        }
        
        const accounts = await storage.getAccountsByMemberId(member.id);
        const loans = await storage.getLoansByMemberId(member.id);
        const transactions = await storage.getTransactionsByMemberId(member.id, 10);
        
        const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
        const activeLoans = loans.filter(l => l.status === "active" || l.status === "disbursed");
        const totalLoanBalance = activeLoans.reduce((sum, loan) => sum + parseFloat(loan.outstandingBalance), 0);
        
        return res.json({
          totalBalance,
          totalLoanBalance,
          accountsCount: accounts.length,
          activeLoansCount: activeLoans.length,
          accounts,
          loans: activeLoans,
          recentTransactions: transactions,
        });
      }
      
      if (role === "staff" || role === "admin") {
        const allMembers = await storage.getAllMembers(1000, 0);
        const allLoans = await storage.getAllLoans();
        const allTransactions = await storage.getAllTransactions(100);
        const allAccounts = await storage.getAllAccounts();
        
        const pendingLoans = allLoans.filter(l => l.status === "pending");
        const activeLoans = allLoans.filter(l => l.status === "active" || l.status === "disbursed");
        const defaultedLoans = allLoans.filter(l => l.status === "defaulted");
        
        const totalDeposits = allAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
        const totalLoanPortfolio = activeLoans.reduce((sum, loan) => sum + parseFloat(loan.outstandingBalance), 0);
        
        return res.json({
          totalMembers: allMembers.length,
          activeMembers: allMembers.filter(m => m.status === "active").length,
          totalDeposits,
          totalLoanPortfolio,
          pendingLoansCount: pendingLoans.length,
          activeLoansCount: activeLoans.length,
          defaultedLoansCount: defaultedLoans.length,
          recentTransactions: allTransactions.slice(0, 10),
          pendingLoans: pendingLoans.slice(0, 10),
        });
      }
      
      return res.status(400).json({ error: "Invalid role" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
