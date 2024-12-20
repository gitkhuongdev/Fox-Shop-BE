<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Gallery;
use App\Models\ProductCategory;
use App\Models\Products;
use App\Models\Attribute;
use App\Models\ProductsAttribute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Traits\HasCrud;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Leo\Categories\Models\Categories;
use Illuminate\Support\Facades\Auth;
class ProductController extends Controller
{
    use HasCrud;
    protected $model;
    public function __construct()
    {
        $this->model = Products::class;
    }

    public function index()
    {
        $result = $this->model::with('categories', 'brands', 'gallery')->get();
        $categories = \App\Models\Categories::active()->get();
        $brands = Brand::active()->get();
        $colors = Attribute::where('type', 'color')->get()->toArray();
        $sizes = Attribute::where('type', 'size')->get()->toArray();
        return Inertia::render('Products/Index', ['dataproducts' => $result, 'databrands' => $brands,
         'datacategories' => $categories, 'datacolor' => $colors, 'datasize' => $sizes]);
    }
    public function Active()
    {
        $result = $this->model::with('categories', 'brands', 'gallery')
            ->where('status', 1)
            ->where('gallery.status', 1)
            ->paginate(3);
        return response()->json($result);
    }
    public function Single_Active($id)
    {
        $product = $this->model::with('categories', 'brands')
            ->where('status', 1)
            ->where('id', $id)
            ->first();
        $result = Gallery::where('id_parent', $id)->pluck('image')->toArray();
        $gallery = [];
        foreach ($result as  $value) {
            $gallery[] = Storage::url('products/' . $id . '/' . $value);
        }
        return response()->json(['result' => $product, 'gallery' => $gallery]);
    }

    public function UploadImages(Request $request, $id)
    {
        if (!request()->has('files')) {
            return response()->json(['check' => false, 'msg' => 'Files is required   ']);
        }
        $result = [];
        foreach ($request->file('files') as $file) {

            $imageName = $file->getClientOriginalName();

            $extractTo = storage_path('app/public/products/');

            $file->move($extractTo, $imageName);

            Gallery::create([

                'id_parent' => $id,

                'image' => $imageName,

                'status' => 0

            ]);

            $result[] = Storage::url('products/' . $imageName);
        }

        $oldImages = Gallery::where('id_parent', $id)->pluck('image')->toArray();

        if (count($oldImages) > 0) {

            foreach ($oldImages as  $value) {

                $result[] = Storage::url('products/' . $id . '/' . $value);
            }
        }

        $result = array_merge($oldImages, $result);

        Products::where('id', $id)->update(['status' => 0]);

        return response()->json(['check' => true, 'result' => $result]);
    }



    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|unique:products,name',
        'price' => 'required|numeric',
        'idBrand' => 'required|exists:brands,id',
        'content' => 'required',
        'files' => 'required|array',
        'files.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        'categories' => 'required|array',
        'quantity' => 'nullable|numeric',
        'discount' => 'nullable|numeric'
    ]);

    if ($validator->fails()) {
        return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
    }

    $data = [];
    $data['name'] = $request->name;
    $data['slug'] = Str::slug($data['name']);
    $data['price'] = $request->price;
    $data['discount'] = $request->discount;
    $data['id_brand'] = $request->idBrand;
    $data['content'] = $request->content;
    $data['in_stock'] = $request->quantity;
    $data['created_at'] = now();

    // Thêm sản phẩm mới và lấy id
    $id = $this->model::insertGetId($data);
    // Lưu danh mục cho sản phẩm
    foreach ($request->categories as $value) {
        ProductCategory::create(['id_product' => $id, 'id_categories' => $value, 'created_at' => now()]);
    }
    foreach ($request->file('files') as $file) {
        $imageName = $file->getClientOriginalName();
        $extractTo = storage_path('app/public/products/');
        $file->move($extractTo, $imageName);

        Gallery::create([
            'id_parent' => $id,
            'image' => $imageName,
            'status' => 0
        ]);
    }
    foreach ($request->input('colors')   as $colorId) {
            ProductsAttribute::create([
                'product_id' => $id,
                'attribute_id' => $colorId,
            ]);
    }

    foreach ($request->input('sizes') as $sizeId) {
            ProductsAttribute::create([
                'product_id' => $id,
                'attribute_id' => $sizeId,
            ]);
    }

    $result = $this->model::with('categories', 'brands')->find($id);

    return response()->json(['check' => true, 'data' => $result]);
}





    public function show($identifier)
    {
        $result = $this->model::with('brands','categories','attributes')->find($identifier);
        $oldImages = Gallery::where('id_parent', $identifier)->pluck('image')->toArray();
        $allColors = Attribute::where('type', 'color')->get();
        $allSizes = Attribute::where('type', 'size')->get();

        $selectedAttributes = ProductsAttribute::where('product_id', $identifier)->pluck('attribute_id')->toArray();
            $gallery = [];
        $selectedCategories = ProductCategory::where('id_product', $identifier)->pluck('id_categories')->toArray();
        foreach ($oldImages as  $value) {
            $gallery[] = Storage::url('products/' .  $value);
        }
        $categories = \App\Models\Categories::active()->get();
        $brands = Brand::active()->get();

        $image = Gallery::where('id_parent', $identifier)->where('status', 1)->value("image");

        if ($image) {
            return Inertia::render('Products/Edit', ['dataId' => $identifier, 'dataBrand' => $brands,'cate'=>$selectedCategories, 'dataCate' => $categories, 'dataproduct' => $result,  'dataColor' => $allColors, 'dataSize' => $allSizes, 'selectedAttributes' => $selectedAttributes, 'datagallery' => $gallery, 'dataimage' => Storage::url('products/' . $image)]);
        } else {
            return Inertia::render('Products/Edit', ['dataId' => $identifier, 'dataBrand' => $brands,'cate'=>$selectedCategories, 'dataCate' => $categories, 'dataproduct' => $result,  'dataColor' => $allColors, 'dataSize' => $allSizes,'selectedAttributes' => $selectedAttributes, 'datagallery' => $gallery, 'dataimage' => Storage::url('products/' . $image)]);
        }
    }



    public function setImage($id, $imageName)

    {

        Gallery::where('id_parent', $id)->update(['status' => 0]);

        Gallery::where('id_parent', $id)

            ->where('image', $imageName)

            ->update(['status' => 1]);

        $result = Storage::url('products/' . $imageName);

        return response()->json(['check' => true, 'result' => $result]);
    }



    public function removeImage($id, $imageName)

    {

        $filePath = "public/products/{$imageName}";

        Storage::delete($filePath);

        Gallery::where('id_parent', $id)

            ->where('image', $imageName)

            ->delete();

        $oldImages = Gallery::where('id_parent', $id)->pluck('image')->toArray();

        $gallery = [];

        foreach ($oldImages as  $value) {

            $gallery[] = Storage::url('products/' . $value);
        }

        return response()->json(['check' => true, 'gallery' => $gallery]);
    }



    public function importImages(Request $request, $identifier)

    {

        $extractTo = storage_path('app/public/products/' . $identifier);

        $zip = new ZipArchive;

        if (request()->has('file')) {

            $zipFile = $request->file;

            if ($zip->open($zipFile) == true) {

                $zip->extractTo($extractTo);

                $zip->close();

                $files = File::files($extractTo);

                foreach ($files as $file) {

                    Gallery::create(['image' => $file->getFilename(), 'id_parent' => $identifier]);
                }



                Products::where('id', $identifier)->update(['status' => 0]);

                return response()->json(['check' => true]);
            } else {

                echo 'Failed to extract files.';
            }
        } else {

            return response()->json(['check' => false, 'msg' => 'file is required']);
        }
    }



    public function switchProduct(Request $request, $id)
    {
        $products = Products::find($id);
        $products->status = ($products->status === 1) ? 0 : 1;
        $products->save();
        return response()->json(['check' => true]);
    }
    public function switchProductQty(Request $request, $id){
        $products = Products::find($id);
        if (!$products) {
            return response()->json(['check' => false, 'msg' => 'Not exists']);
        }
        $products->status = $request->status;
        $products->save();
        return response()->json(['check' => true, 'data' => $this->model::all()]);
    }

    public function update(Request $request, $identifier)
        {
            $validator = Validator::make($request->all(), [
                'name' => 'string|max:255',
                'price' => 'numeric|min:0',
                'discount' => 'numeric|min:0',
                'in_stock' => 'nullable|numeric',
                'categories.*' => 'exists:categories,id',
                'color.*' => 'exists:attribute,id',
                'size.*' => 'exists:attribute,id' 


            ]);
            if ($validator->fails()) {
                return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
            }
            $data = $request->all();
            $product = Products::find($identifier);
            if (!$product) {
            return response()->json(['check' => false, 'msg' => 'Product not found']);
            }
            if ($product) {
            $product->name = $request->name ?? $product->name;
            if ($request->name != '') {
            $product->slug = Str::slug($request->name); 
            }
            $product->price = $request->price ?? $product->price;
            $product->discount = floatval($request->discount); // Chuyển đổi discount sang kiểu số
            $product->in_stock = intval($request->in_stock); // Chuyển đổi in_stock sang kiểu số
            $product->content = $request->content;
            $product->id_brand = $request->id_brand ?? $product->id_brand;
            $product->save();
            }
            if($request->has('categories')){
                unset($data['categories']);
                ProductCategory::where('id_product',$identifier)->delete();
                foreach ($request->categories as $key => $value) {
                    ProductCategory::create(['id_product'=>$identifier,'id_categories'=>$value,'created_at'=>now()]);
                }
            }
            if ($request->has('color') || $request->has('size')) {
                    unset($data['color'], $data['size']);
                    ProductsAttribute::where('product_id', $identifier)->delete();
                    
                    $attributes = $request->color ?? [];
                    $attributes = array_merge($attributes, $request->size ?? []);
                    
                    foreach ($attributes as $value) {
                        ProductsAttribute::create(['product_id' => $identifier, 'attribute_id' => $value, 'created_at' => now()]);
                    }
                }
                        $result = $this->model::with('categories', 'brands')->get();
                        return response()->json(['check' => true, 'data' => $result]);
        }



    public function destroy($identifier)
    {
        $product = Products::where('id', $identifier)->first();
        if (!$product) {
            return response()->json(['check' => false, 'msg' => 'Không tìm thấy sản phẩm']);
        }
        $images = Gallery::where('id_parent', $identifier)->select('image')->get();
        foreach ($images as $image) {
            $filePath = "public/products/{$image->image}";
            Storage::delete($filePath);
        }
        Gallery::where('id_parent', $identifier)->delete();
        Products::where('id', $identifier)->delete();
        $result = $this->model::with('categories', 'brands')->get();
        if (count($result) > 0) {
            return response()->json(['check' => true, 'result' => $result]);
        }
        return response()->json(['check' => true]);
    }
    public function import(Request $request)
    {
        if ($request->has('file')) {
            $file = $request->file('file');
            Excel::import(new ProductImport(), $file);
            return response()->json(['check' => true]);
        } else {
            return response()->json(['check' => false, 'msg' => 'File is required']);
        }
    }
    public function ProDetail($slug){
        $data = $this->model::where('slug', $slug)->with('categories', 'brands', 'gallery', 'attributes')->first()->toArray();  
        $data['attributes'] = ProductsAttribute::where('product_id', $data['id'])->with('attribute')->get()->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->attribute->name,
                'type' => $attribute->attribute->type,
                'value' => $attribute->attribute->value
            ];
        });
        return Inertia::render('Products/Detail', ['product' => $data]);
    }

    public function api_product(Request $request)
    {
        if ($request->has('limit')) {
            $result = Products::join('gallery', 'products.id', '=', 'gallery.id_parent')
                ->where('products.status', 1)
                ->where('gallery.status', 1)->select('products.*', 'gallery.image as image')
                ->take($request->limit)->get();
            return response()->json($result);
        } else {
            $result = Products::join('gallery', 'products.id', '=', 'gallery.id_parent')
                ->where('products.status', 1)
                ->where('gallery.status', 1)->select('products.*', 'gallery.image as image')
                ->paginate(16);
            return response()->json($result);
        }
    }
    public function api_product_cate($id)
    {
        $result = Products::join('product_categories', 'products.id', '=', 'product_categories.id_product')
            ->join('categories', 'product_categories.id_categories', '=', 'categories.id')
            ->join('gallery', 'products.id', '=', 'gallery.id_parent')
            ->where('gallery.status', 1)
            ->where('product_categories.id_categories', $id)
            ->where('products.status', 1)
            ->where('categories.status', 1)
            ->select('products.*', 'categories.name as category_name', 'gallery.image as image')
            ->distinct() // Đảm bảo kết quả không bị trùng lặp
            ->get();

        return response()->json($result);
    }
    public function api_product_best(Request $request){
        dd($request->all());
        $products = Products::with(['gallery'])
        ->join('order_details', 'products.id', '=', 'order_details.id_product')
        ->selectRaw('products.*, SUM(order_details.quantity) as total_sold')
        ->groupBy('products.id')
        ->orderByDesc('total_sold')
        ->take(10)
        ->get();

        return response()->json([
            'data' => $products
        ]);
    }

    // --------------------------------------
    public function api_search_product($slug)
    {
        $result = Products::join('gallery', 'products.id', '=', 'gallery.id_parent')
            ->where('products.status', 1)
            ->where('gallery.status', 1)
            ->where(function ($query) use ($slug) {
                $query->where('products.name', 'like', '%' . $slug . '%')
                    ->orWhere('products.slug', 'like', '%' . $slug . '%');
            })
            ->select('products.*', 'gallery.image as image')
            ->get();
        if (count($result) == 0) {
            return response()->json(['product' => []]);
        }
        return response()->json(['products' => $result]);
    }
    // --------------------------------------
    public function apiProductDetail($slug) {
        $data = $this->model::where('slug', $slug)->with('categories', 'brands', 'gallery', 'attributes')->first()->toArray();
        
        $data['attributes'] = ProductsAttribute::where('product_id', $data['id'])->with('attribute')->get()->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->attribute->name,
                'type' => $attribute->attribute->type,
                'value' => $attribute->attribute->value
            ];
        });

        return response()->json($data);
    }
    public function api_single_product($slug)
    {
        $result = Products::with(['brands', 'categories'])
            ->where('products.slug', $slug)
            ->where('products.status', 1)
            ->select('products.*')
            ->first();
        if (!$result) {
            return response()->json([]);
        }

        $medias = Gallery::where('id_parent', $result->id)
            ->pluck('image');

        // Lấy thông tin danh mục của sản phẩm
        $categoryData = ProductCategory::where('id_product', $result->id)->first();
        $id_cate = $categoryData->id_categories;

        // Lấy sản phẩm cùng danh mục
        $cate_products = Products::join('product_categories', 'products.id', '=', 'product_categories.id_product')
            ->join('gallery', 'products.id', '=', 'gallery.id_parent')
            ->where('products.status', 1)
            ->where('product_categories.id_categories', $id_cate)
            ->where('gallery.status', 1)
            ->select('products.*', 'gallery.image as image')
            ->take(4);

        // Lấy sản phẩm cùng brand
        $brand_products = Products::join('gallery', 'products.id', '=', 'gallery.id_parent')
            ->where('products.status', 1)
            ->where('products.id_brand', $result->idBrand)
            ->where('gallery.status', 1)
            ->select('products.*', 'gallery.image as image')
            ->take(4);

        // Xử lý để lấy sản phẩm liên quan
        if ($brand_products->exists() && $cate_products->exists()) {
            $links = $cate_products->union($brand_products)->get();
        } elseif (!$brand_products->exists()) {
            $links = $cate_products->get();
        } else {
            $links = $brand_products->get();
        }

        // Lấy màu và kích thước của sản phẩm
        $attributes = ProductsAttribute::where('product_id', $result->id)
            ->join('attribute', 'products_attribute.attribute_id', '=', 'attribute.id')
            ->select('attribute.type', 'attribute.name')
            ->get()
            ->groupBy('name'); // Nhóm theo 'name' để tách color và size

        // Phân loại thuộc tính color và size
        $colors = $attributes->get('color', []);
        $sizes = $attributes->get('size', []);

        // Trả về dữ liệu dưới dạng JSON
        return response()->json([
            'product' => $result,
            'medias' => $medias,
            'links' => $links,
            'colors' => $colors,
            'sizes' => $sizes
        ]);
    }

    public function api_gallery_by_product_id(Request $request, $productId)
    {
        $product = Products::find($productId);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $images = Gallery::where('id_parent', $productId)
            ->where('status', 1)
            ->pluck('image');
        return response()->json(['images' => $images]);
    }
    public function api_load_cart_product(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cart' => 'required|array',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $arr = [];
        foreach ($request->cart as $item) {
            $product = Products::join('gallery', 'products.id', '=', 'gallery.id_parent')->where('gallery.status', 1)->where('products.id', $item[0])->select('products.id', 'gallery.image', 'slug', 'name', 'price', 'discount')->get();
            foreach ($product as $item1) {
                $item2 = [
                    'id' => $item1->id,
                    'name' => $item1->name,
                    'slug' => $item1->slug,
                    'quantity' => $item[1],
                    'discount' => (int)$item1->discount,
                    'price' => (int)$item1->price,
                    'image' => $item1->image,
                    'total' => (int)$item1->discount * $item[1],
                ];
                array_push($arr, $item2);
            }
        }
        return response()->json($arr);
    }}
