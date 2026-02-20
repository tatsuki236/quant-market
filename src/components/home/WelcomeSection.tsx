const WelcomeSection = () => {
  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">
            QuantMarket へようこそ
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            難しい専門知識がなくても、チャート分析をより身近に始められるお手伝いをします。気になるカテゴリの商品をご覧ください。
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
