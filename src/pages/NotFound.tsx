import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">404</h1>
              <p className="mb-6 text-xl text-muted-foreground">ページが見つかりませんでした</p>
              <Button variant="outline" asChild>
                <a href="/">ホームに戻る</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
