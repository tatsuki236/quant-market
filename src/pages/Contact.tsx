import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Building2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

/**
 * お問い合わせページ
 * SEOキーワード: お問い合わせ, インジケータ 質問, 購入相談, 出品相談
 */

const inquiryTypes = [
  { value: "purchase-before", label: "購入前のご相談" },
  { value: "purchase-after", label: "購入後のお問い合わせ" },
  { value: "bank-transfer", label: "銀行振込について" },
  { value: "corporate", label: "法人のお客様" },
  { value: "seller", label: "出品に関するご相談" },
  { value: "other", label: "その他" },
];

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "送信完了",
      description: "お問い合わせを受け付けました。",
    });

    navigate("/contact/thanks");
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">お問い合わせ</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                お問い合わせフォーム
              </h1>
              <p className="text-sm text-muted-foreground">
                QuantMarketに関するご質問・ご相談を承っております。
                購入前のご相談、購入後のサポート、銀行振込のお問い合わせ、
                法人のお客様、出品に関するご相談など、お気軽にお問い合わせください。
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">メール</p>
                  <p className="font-medium">support@quantsmarket.com</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-4">
                <Building2 className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">法人のお客様</p>
                  <p className="font-medium">請求書払い対応可</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="山田 太郎"
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiryType">お問い合わせ種別 *</Label>
                <Select
                  value={formData.inquiryType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, inquiryType: value })
                  }
                  required
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">お問い合わせ内容 *</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="お問い合わせ内容をご記入ください"
                  className="min-h-[150px] bg-card"
                />
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>通常、2営業日以内にご返信いたします。</p>
                  <p>土日祝日にいただいたお問い合わせは、翌営業日以降の対応となります。</p>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "送信中..." : "送信する"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
