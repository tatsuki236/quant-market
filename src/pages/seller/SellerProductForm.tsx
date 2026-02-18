import Layout from "@/components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSellerProduct, useCreateProduct, useUpdateProduct } from "@/hooks/use-seller-products";
import { useProductImage } from "@/hooks/use-product-image";

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
      platform: form.platform,
      market: form.market,
      icon_name: form.icon_name,
      features: splitComma(form.features),
      full_description: form.full_description || null,
      technical_logic: form.technical_logic || null,
      indicators: splitComma(form.indicators),
      market_condition: form.market_condition || null,
      backtest_info: form.backtest_info || null,
      detail_features: splitNewline(form.detail_features),
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
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/seller/products")}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            商品一覧に戻る
          </button>

          <h1 className="text-2xl font-bold mb-8">
            {isEditing ? "商品を編集" : "新しい商品を出品"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h2 className="text-lg font-semibold">基本情報</h2>

              <div className="space-y-2">
                <Label htmlFor="slug">スラッグ（URL用ID）</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="my-indicator-tool"
                  required
                  disabled={isEditing}
                />
                <p className="text-xs text-muted-foreground">英数字とハイフンのみ。一度設定すると変更できません。</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">商品名</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="トレンドマスター Pro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">概要説明</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="商品の簡単な説明"
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">価格（円）</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="12800"
                    required
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>プラットフォーム</Label>
                  <Select value={form.platform} onValueChange={(v) => handleChange("platform", v)}>
                    <SelectTrigger>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>対象市場</Label>
                  <Select value={form.market} onValueChange={(v) => handleChange("market", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FX">FX</SelectItem>
                      <SelectItem value="株式">株式</SelectItem>
                      <SelectItem value="仮想通貨">仮想通貨</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>アイコン</Label>
                  <Select value={form.icon_name} onValueChange={(v) => handleChange("icon_name", v)}>
                    <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="features">特徴タグ（カンマ区切り）</Label>
                <Input
                  id="features"
                  value={form.features}
                  onChange={(e) => handleChange("features", e.target.value)}
                  placeholder="移動平均, トレンド分析, 売買シグナル"
                />
              </div>
            </div>

            {/* 商品画像 */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h2 className="text-lg font-semibold">商品画像</h2>

              {currentImage ? (
                <div className="relative">
                  <img
                    src={currentImage}
                    alt="商品画像プレビュー"
                    className="w-full max-h-64 object-contain rounded-lg border border-border bg-muted"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background/80 border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {imageFile && (
                    <p className="text-xs text-muted-foreground mt-2">
                      新しい画像: {imageFile.name}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors
                    ${isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }
                  `}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">クリックまたはドラッグ&ドロップで画像をアップロード</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP（最大5MB）</p>
                </div>
              )}

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

              {!currentImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  ファイルを選択
                </Button>
              )}
            </div>

            {/* 詳細情報 */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h2 className="text-lg font-semibold">詳細情報（任意）</h2>

              <div className="space-y-2">
                <Label htmlFor="full_description">商品の詳細説明</Label>
                <Textarea
                  id="full_description"
                  value={form.full_description}
                  onChange={(e) => handleChange("full_description", e.target.value)}
                  rows={5}
                  placeholder="商品の詳細な説明..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical_logic">テクニカル分析ロジック</Label>
                <Textarea
                  id="technical_logic"
                  value={form.technical_logic}
                  onChange={(e) => handleChange("technical_logic", e.target.value)}
                  rows={4}
                  placeholder="使用するテクニカル指標やロジックの説明..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="indicators">使用指標（カンマ区切り）</Label>
                <Input
                  id="indicators"
                  value={form.indicators}
                  onChange={(e) => handleChange("indicators", e.target.value)}
                  placeholder="移動平均（EMA）, トレンド強度スコア"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="market_condition">想定相場・使用条件</Label>
                <Textarea
                  id="market_condition"
                  value={form.market_condition}
                  onChange={(e) => handleChange("market_condition", e.target.value)}
                  rows={3}
                  placeholder="どのような相場で有効か..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backtest_info">バックテスト情報</Label>
                <Textarea
                  id="backtest_info"
                  value={form.backtest_info}
                  onChange={(e) => handleChange("backtest_info", e.target.value)}
                  rows={3}
                  placeholder="過去データでの検証結果..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail_features">機能一覧（1行1項目）</Label>
                <Textarea
                  id="detail_features"
                  value={form.detail_features}
                  onChange={(e) => handleChange("detail_features", e.target.value)}
                  rows={4}
                  placeholder={"エントリーシグナル表示\nトレンド強度メーター\nアラート機能"}
                />
              </div>
            </div>

            {/* 審査に関する注意 */}
            {!isEditing && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  出品された商品は管理者の審査後に掲載されます。審査完了までしばらくお待ちください。
                </p>
              </div>
            )}

            {/* 送信 */}
            <div className="flex gap-4">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/seller/products")}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default SellerProductForm;
