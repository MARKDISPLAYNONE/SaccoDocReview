import { Search, HelpCircle, Book, MessageSquare, Shield, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const faqCategories = [
  {
    title: "Account & Membership",
    icon: Shield,
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click on 'Join Now' on the homepage and follow the 4-step registration process. You'll need your national ID, phone number, and basic personal information. KYC verification typically takes 1-2 business days.",
      },
      {
        question: "What documents do I need for KYC verification?",
        answer: "You need a valid national ID, KRA PIN (optional but recommended), proof of address, and a recent passport photo. All documents can be uploaded digitally during registration.",
      },
      {
        question: "How can I update my profile information?",
        answer: "Log in to your account, navigate to Profile > Edit Profile. You can update your contact information, address, and employment details. Changes to ID number or KRA PIN require staff verification.",
      },
    ],
  },
  {
    title: "Savings & Deposits",
    icon: Smartphone,
    faqs: [
      {
        question: "How do I make a deposit?",
        answer: "You can deposit via M-PESA using our paybill number 123456. Enter your account number as the reference. Deposits are reflected in your account within minutes. You can also deposit cash at any branch during business hours.",
      },
      {
        question: "What types of savings accounts are available?",
        answer: "We offer Shares Account (8% p.a.), Savings Account (6.5% p.a.), Emergency Fund (5% p.a.), and Fixed Deposit (7-9% p.a. depending on term). Each account has different features and benefits.",
      },
      {
        question: "When is interest paid on my savings?",
        answer: "Interest is calculated daily and credited to your account monthly on the last day of each month. Annual dividend payments are made in January for shares accounts.",
      },
    ],
  },
  {
    title: "Loans",
    icon: Book,
    faqs: [
      {
        question: "What loan products are available?",
        answer: "We offer Emergency Loans (up to KES 100,000), Development Loans (up to KES 500,000), School Fees Loans (up to KES 300,000), Business Loans (up to KES 1,000,000), and Asset Financing. Terms range from 3 to 36 months.",
      },
      {
        question: "How is my loan limit determined?",
        answer: "Your loan limit is based on your credit score, savings balance, repayment history, and income. Generally, you can borrow up to 3 times your savings balance, subject to guarantor approval.",
      },
      {
        question: "How long does loan approval take?",
        answer: "Emergency loans are approved within 24 hours. Other loan types take 2-5 business days depending on the amount and guarantor approval. You'll receive notifications at each stage of the process.",
      },
      {
        question: "What is credit scoring and how does it affect me?",
        answer: "Credit scoring (300-850) assesses your creditworthiness based on income, savings, repayment history, and account age. Higher scores qualify for better rates and larger loan amounts. You can improve your score by maintaining regular savings and timely repayments.",
      },
    ],
  },
  {
    title: "M-PESA Integration",
    icon: MessageSquare,
    faqs: [
      {
        question: "How do I link my M-PESA account?",
        answer: "Your M-PESA is automatically linked using your registered phone number. Simply use Paybill 123456 and your account number as the reference to make deposits or repay loans.",
      },
      {
        question: "Can I withdraw to M-PESA?",
        answer: "Yes! Navigate to Accounts > Withdraw and select M-PESA as the destination. Withdrawals are processed within 5 minutes during business hours. Minimum withdrawal is KES 100, maximum is KES 150,000 per day.",
      },
      {
        question: "What are the M-PESA transaction charges?",
        answer: "Deposits up to KES 10,000 are free. Above that, standard M-PESA rates apply. Withdrawals attract a flat fee of KES 30 regardless of amount. There are no hidden charges.",
      },
    ],
  },
];

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-5xl py-8">
        <div className="text-center mb-8">
          <HelpCircle className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">How Can We Help?</h1>
          <p className="text-muted-foreground">Find answers to common questions or contact our support team</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10 h-12"
              data-testid="input-search-help"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="hover-elevate transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Chat Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Get instant help from our team</p>
              <Badge variant="secondary">9 AM - 5 PM</Badge>
            </CardContent>
          </Card>
          <Card className="hover-elevate transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">User Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">Detailed documentation</p>
              <Badge variant="secondary">Coming Soon</Badge>
            </CardContent>
          </Card>
          <Card className="hover-elevate transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Smartphone className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Speak with our team</p>
              <Badge variant="secondary">+254 700 000 000</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {faqCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="h-6 w-6 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">Our support team is ready to assist you</p>
            <Button data-testid="button-contact-support">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
