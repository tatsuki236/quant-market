import Layout from "@/components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSellerProduct, useCreateProduct, useUpdateProduct } from "@/hooks/use-seller-products";
import { useProductImage } from "@/hooks/use-product-image";

const RichEditor = lazy(() => import("@/components/ui/rich-editor"));

const SellerProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: existingProduct, isLoading: loadingProduct } = useSellerProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { uploadProductImage, deleteProductImage } = useProductImage();

  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    price: "",
    category: "indicator" as string,
    platform: "MT4",
    market: "FX" as string,
    icon_name: "TrendingUp",
    features: "",
    full_description: "",
    technical_logic: "",
    indicators: "",
    market_condition: "",
    backtest_info: "",
    detail_features: "",
    free_content: "",
    paid_content: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingProduct) {
      setForm({
        slug: existingProduct.slug,
        name: existingProduct.name,
        description: existingProduct.description,
        price: existingProduct.price.toString(),
        category: existingProduct.category ?? "indicator",
        platform: existingProduct.platform,
        market: existingProduct.market,
        icon_name: existingProduct.icon_name,
        features: existingProduct.features.join(", "),
        full_description: existingProduct.full_description ?? "",
        technical_logic: existingProduct.technical_logic ?? "",
        indicators: existingProduct.indicators?.join(", ") ?? "",
        market_condition: existingProduct.market_condition ?? "",
        backtest_info: existingProduct.backtest_info ?? "",
        detail_features: existingProduct.detail_features?.join("\n") ?? "",
        free_content: existingProduct.free_content ?? "",
        paid_content: existingProduct.paid_content ?? "",
      });
      if (existingProduct.image && existingProduct.image !== "/placeholder.svg") {
        setExistingImageUrl(existingProduct.image);
      }
    }
  }, [existingProduct]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const splitComma = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);
  const splitNewline = (s: string) => s.split("\n").map((v) => v.trim()).filter(Boolean);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "画像ファイルを選択してください", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "ファイルサイズは5MB以下にしてください", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseInt(form.price, 10);
    if (!price || price <= 0) {
      toast({ title: "価格を正しく入力してください", variant: "destructive" });
      return;
    }

    let imageUrl: string | undefined;

    // Upload image if a new file was selected
    if (imageFile) {
      setIsUploadingImage(true);
      try {
        imageUrl = await uploadProductImage(imageFile, form.slug);
      } catch (error) {
        toast({
          title: "画像のアップロードに失敗しました",
          description: error instanceof Error ? error.message : "再度お試しください",
          variant: "destructive",
        });
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }

    const payload: Record<string, any> = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      price,
      category: form.category,
      platform: form.category === "有料記事" ? "-" : form.platform,
      market: form.category === "有料記事" ? "その他" : form.market,
      icon_name: form.icon_name,
      features: splitComma(form.features),
      full_description: form.full_description || null,
      technical_logic: form.technical_logic || null,
      indicators: splitComma(form.indicators),
      market_condition: form.market_condition || null,
      backtest_info: form.backtest_info || null,
      detail_features: splitNewline(form.detail_features),
      free_content: form.free_content || null,
      paid_content: form.paid_content || null,
    };

    if (imageUrl) {
      payload.image = imageUrl;
    }

    try {
      if (isEditing) {
        await updateProduct.mutateAsync({ id, ...payload });
        toast({ title: "商品を更新しました" });
      } else {
        await createProduct.mutateAsync(payload);
        toast({ title: "商品を作成しました。管理者の審査後に掲載されます。" });
      }
      navigate("/seller/products");
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "保存に失敗しました",
        variant: "destructive",
      });
    }
  };

  if (isEditing && loadingProduct) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const isSubmitting = createProduct.isPending || updateProduct.isPending || isUploadingImage;
  const currentImage = imagePreview || existingImageUrl;

  return (
    <Layout>
      <section className="py-10 lg:py-14">
        <div className="section-container">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
            <button
              onClick={() => navigate("/seller/products")}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              商品一覧に戻る
            </button>
            <h1 className="text-lg font-bold">
              {isEditing ? "商品を編集" : "新しい商品を出品"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ====== G1: 商品情報 + G2: 販売設定 — コンパクトにまとめる ====== */}
            <div className="max-w-3xl mx-auto p-4 sm:p-6 rounded-xl bg-card border border-border">
              {/* 商品名（フルワイド） */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="name">商品名</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="トレンドマスター Pro"
                  required
                  className="text-base"
                />
              </div>

              {/* 概要説明（フルワイド） */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="description">概要説明</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="商品の簡単な説明"
                  required
                  rows={2}
                />
              </div>

              {/* コンパクトグリッド: スラッグ・カテゴリ・価格 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <Label htmlFor="slug" className="text-xs">スラッグ</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="my-product"
                    required
                    disabled={isEditing}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">カテゴリ</Label>
                  <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indicator">インジケータ</SelectItem>
                      <SelectItem value="有料記事">電子書籍</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">価格（円）</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="12800"
                    required
                    min={1}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* インジケータ専用: プラットフォーム・市場・アイコン */}
              {form.category !== "有料記事" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">プラットフォーム</Label>
                    <Select value={form.platform} onValueChange={(v) => handleChange("platform", v)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MT4">MT4</SelectItem>
                        <SelectItem value="MT5">MT5</SelectItem>
                        <SelectItem value="MT4/MT5">MT4/MT5</SelectItem>
                        <SelectItem value="TradingView">TradingView</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">対象市場</Label>
                    <Select value={form.market} onValueChange={(v) => handleChange("market", v)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FX">FX</SelectItem>
                        <SelectItem value="株式">株式</SelectItem>
                        <SelectItem value="仮想通貨">仮想通貨</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">アイコン</Label>
                    <Select value={form.icon_name} onValueChange={(v) => handleChange("icon_name", v)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TrendingUp">TrendingUp</SelectItem>
                        <SelectItem value="LineChart">LineChart</SelectItem>
                        <SelectItem value="BarChart3">BarChart3</SelectItem>
                        <SelectItem value="Activity">Activity</SelectItem>
                        <SelectItem value="Zap">Zap</SelectItem>
                        <SelectItem value="Target">Target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* 特徴タグ + 画像 横並び */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">特徴タグ（カンマ区切り）</Label>
                  <Input
                    value={form.features}
                    onChange={(e) => handleChange("features", e.target.value)}
                    placeholder="移動平均, トレンド分析"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">商品画像</Label>
                  {currentImage ? (
                    <div className="relative h-9 flex items-center gap-2">
                      <img src={currentImage} alt="" className="h-9 w-14 object-contain rounded border border-border bg-muted" />
                      <span className="text-xs text-muted-foreground truncate flex-1">{imageFile?.name || "設定済み"}</span>
                      <button type="button" onClick={removeImage} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-9 flex items-center justify-center rounded-md border border-dashed cursor-pointer text-xs transition-colors ${
                        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      画像をアップロード
                    </div>
                  )}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>

            {/* ====== G3: コンテンツ — メイン領域 ====== */}

            {/* 電子書籍: リッチエディタ */}
            {form.category === "有料記事" && (
              <div className="space-y-6">
                <Suspense fallback={<div className="h-[400px] rounded-xl border border-border bg-muted animate-pulse" />}>
                  <RichEditor
                    value={form.free_content}
                    onChange={(html) => handleChange("free_content", html)}
                    placeholder="無料で公開する記事の内容を入力..."
                    label="無料パート（誰でも閲覧可能）"
                  />
                </Suspense>

                <Suspense fallback={<div className="h-[400px] rounded-xl border border-border bg-muted animate-pulse" />}>
                  <RichEditor
                    value={form.paid_content}
                    onChange={(html) => handleChange("paid_content", html)}
                    placeholder="有料コンテンツの内容を入力..."
                    label="有料パート（購入者のみ閲覧可能）"
                  />
                </Suspense>
              </div>
            )}

            {/* インジケータ: 詳細情報 */}
            {form.category !== "有料記事" && (
              <div className="max-w-3xl mx-auto p-4 sm:p-6 rounded-xl bg-card border border-border space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">詳細情報（任意）</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">商品の詳細説明</Label>
                    <Textarea value={form.full_description} onChange={(e) => handleChange("full_description", e.target.value)} rows={4} placeholder="商品の詳細な説明..." />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">テクニカル分析ロジック</Label>
                    <Textarea value={form.technical_logic} onChange={(e) => handleChange("technical_logic", e.target.value)} rows={3} placeholder="使用するテクニカル指標やロジックの説明..." />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">想定相場・使用条件</Label>
                    <Textarea value={form.market_condition} onChange={(e) => handleChange("market_condition", e.target.value)} rows={3} placeholder="どのような相場で有効か..." />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">使用指標（カンマ区切り）</Label>
                    <Input value={form.indicators} onChange={(e) => handleChange("indicators", e.target.value)} placeholder="移動平均（EMA）, トレンド強度スコア" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">バックテスト情報</Label>
                    <Textarea value={form.backtest_info} onChange={(e) => handleChange("backtest_info", e.target.value)} rows={2} placeholder="過去データでの検証結果..." />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">機能一覧（1行1項目）</Label>
                    <Textarea value={form.detail_features} onChange={(e) => handleChange("detail_features", e.target.value)} rows={3} placeholder={"エントリーシグナル表示\nトレンド強度メーター\nアラート機能"} />
                  </div>
                </div>
              </div>
            )}

            {/* ====== G4: アクション ====== */}
            <div className="max-w-3xl mx-auto space-y-3">
              {!isEditing && (
                <p className="text-xs text-muted-foreground text-center">
                  出品された商品は管理者の審査後に掲載されます
                </p>
              )}
              <div className="flex gap-3">
                <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploadingImage ? "画像アップロード中..." : "保存中..."}
                    </>
                  ) : isEditing ? (
                    "商品を更新"
                  ) : (
                    "商品を出品"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/seller/products")}>
                  キャンセル
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default SellerProductForm;
