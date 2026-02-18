import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";

/**
 * FAQページ
 * SEOキーワード: インジケータ FAQ, MT4 MT5 違い, TradingView,
 * 銀行振込, 返金ポリシー, 初心者
 */

const faqData = [
  {
    category: "基本的な質問",
    items: [
      {
        question: "インジケータとは何ですか？",
        answer: "テクニカルインジケータは、過去の価格データ（始値・高値・安値・終値）や出来高を基に計算され、チャート上に表示される分析ツールです。移動平均、RSI、MACD、ボリンジャーバンドなど様々な種類があり、トレンドの方向性や売買タイミングの判断に活用されます。インジケータは「売買の補助ツール」であり、最終的な投資判断はトレーダー自身が行います。",
      },
      {
        question: "インジケータはどのように活用すればいいですか？",
        answer: "インジケータはチャート上に分析結果を表示し、トレーダー自身が売買判断を行う「裁量トレード」を補助するツールです。トレンドの方向性、相場の過熱感、売買タイミングの判断に活用できます。まずはデモ口座でテストし、インジケータの特性を理解してから実運用することをお勧めします。",
      },
      {
        question: "どのようなプラットフォームに対応していますか？",
        answer: "QuantMarketでは、MT4（MetaTrader 4）、MT5（MetaTrader 5）、TradingViewの3つの主要プラットフォームに対応したインジケータを取り扱っています。各商品ページで対応プラットフォームをご確認ください。",
      },
      {
        question: "株式・FX・仮想通貨、どの市場に対応していますか？",
        answer: "QuantMarketでは、株式（日本株・米国株）、FX（外国為替）、仮想通貨（暗号資産）の3つの市場に対応したインジケータを取り扱っています。各商品ページで対象市場をご確認ください。ただし、インジケータによっては特定の市場での使用を推奨しているものもありますので、商品説明をよくお読みください。",
      },
    ],
  },
  {
    category: "購入・決済について",
    items: [
      {
        question: "どのような決済方法がありますか？",
        answer: "クレジットカード決済（Square経由）と銀行振込に対応しています。クレジットカード決済は即時反映され、ご購入後すぐにダウンロードいただけます。銀行振込の場合は入金確認後にダウンロード可能となります（通常1-2営業日）。",
      },
      {
        question: "銀行振込の場合、いつダウンロードできますか？",
        answer: "銀行振込の場合、当社にて入金確認後にダウンロードが可能となります。通常、入金確認は1-2営業日以内に行っております。お急ぎの場合はクレジットカード決済をご利用ください。",
      },
      {
        question: "領収書は発行できますか？",
        answer: "はい、ご購入完了後にメールにて領収書をお送りいたします。法人のお客様で請求書払いをご希望の場合は、お問い合わせフォームよりご連絡ください。",
      },
      {
        question: "返金はできますか？",
        answer: "デジタル商品の性質上、ご購入後の返金は原則としてお受けしておりません。ただし、商品に重大な欠陥がある場合や、明らかに説明と異なる場合は、個別にご相談を承ります。ご購入前に商品説明をよくお読みいただき、ご不明な点があればお問い合わせください。",
      },
    ],
  },
  {
    category: "使い方・技術的な質問",
    items: [
      {
        question: "MT4とMT5の違いは何ですか？",
        answer: "MT4（MetaTrader 4）は主にFX取引向けのプラットフォームで、世界中のトレーダーに最も広く利用されています。MT5（MetaTrader 5）はMT4の後継として開発され、株式・先物を含む幅広い市場に対応し、より高度なバックテスト機能を備えています。開発言語もMT4はMQL4、MT5はMQL5と異なります。",
      },
      {
        question: "インジケータのインストール方法を教えてください。",
        answer: "【MT4/MT5の場合】ダウンロードしたファイルを、MT4/MT5のデータフォルダ内のIndicatorsフォルダに配置し、プラットフォームを再起動してください。ナビゲーターからインジケータを選択し、チャートにドラッグ＆ドロップで適用できます。【TradingViewの場合】Pine Editorにスクリプトをペーストし、「チャートに追加」をクリックしてください。",
      },
      {
        question: "バックテストは必要ですか？",
        answer: "はい、インジケータを実際のトレードで使用する前に、必ずバックテスト（過去データでの検証）を行うことを推奨しています。バックテストにより、インジケータがあなたのトレードスタイルや対象市場に適しているかを確認できます。ただし、過去の成績が将来の利益を保証するものではないことにご留意ください。",
      },
      {
        question: "初心者でも使えますか？",
        answer: "はい、初心者の方でもご利用いただけます。ただし、テクニカル分析の基礎知識があると、より効果的に活用できます。各商品ページには使用方法や推奨環境を記載しておりますので、ご参考ください。また、購入者ガイドページでインジケータの基礎知識を解説しておりますので、ぜひご一読ください。",
      },
    ],
  },
  {
    category: "出品について",
    items: [
      {
        question: "自作のインジケータを出品できますか？",
        answer: "はい、MT4（MQL4）、MT5（MQL5）、TradingView（Pine Script）で開発されたインジケータの出品を受け付けています。出品をご希望の方は、お問い合わせフォームよりご連絡ください。詳細な出品条件をご案内いたします。",
      },
      {
        question: "出品の審査はありますか？",
        answer: "はい、品質維持のため出品審査を行っております。インジケータの動作確認、説明文の適切さ、スクリーンショットの品質などを確認いたします。審査の詳細は出品申請時にご案内いたします。",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">よくある質問</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              FAQ
            </h1>
            <p className="text-base text-muted-foreground">
              QuantMarketに関するよくある質問をまとめました。
              インジケータの使い方、MT4・MT5・TradingViewの違い、
              決済方法など、ご不明な点がございましたらご確認ください。
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="max-w-3xl mx-auto space-y-12">
            {faqData.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-border">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {section.items.map((item, j) => (
                    <AccordionItem
                      key={j}
                      value={`${i}-${j}`}
                      className="border border-border rounded-lg px-6 data-[state=open]:border-primary/30"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="max-w-2xl mx-auto text-center mt-16 pt-16 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">
              お探しの回答が見つかりませんでしたか？
            </h2>
            <p className="text-muted-foreground mb-8">
              その他のご質問がございましたら、お気軽にお問い合わせください。
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                お問い合わせ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
