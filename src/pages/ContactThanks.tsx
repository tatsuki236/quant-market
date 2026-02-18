import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

/**
 * お問い合わせ完了ページ
 */

const ContactThanks = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              お問い合わせを受け付けました
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              お問い合わせいただきありがとうございます。通常、2営業日以内にご返信いたします。しばらくお待ちくださいませ。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/">
                  トップページへ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">商品を見る</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactThanks;
