<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Products;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
class CategoriesController extends Controller
{

    public function __construct(){
        $this->model= Categories::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories=Categories::all();

        return Inertia::render('Categories/Index', ['categories' => $categories]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    

    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories|max:255|string',
            'position' => 'nullable|numeric',
            'images' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data=[];
        $data['name'] = $request->name;
        $data['position'] = $request->position;
        $data['slug']=Str::slug($data['name']);
        $imagesPath=null;
        if ($request->hasFile('images')) {
        $imagesPath = $request->file('images')->store('categories', 'public');
        $imagesUrl = Storage::url($imagesPath);
        $data['images'] = $imagesUrl;
        }
        $this->model::create($data);
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
    public function show($id)
    {
        $result = Categories::find($id);
        // dd($result);
        return Inertia::render('Categories/Edit', ['category' => $result]);
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categories $categories)
    {
        
    }

public function update(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'name' => 'nullable|string|max:255', 
        'position' => 'nullable|numeric',
        'images' => 'nullable|max:2048',
    ]);
    
    if ($validator->fails()) {
        return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
    }
    dd($request->all());

    // Tìm tài nguyên
    $resource = Categories::findOrFail($id);
    $data = $request->only(['position']);
    if ($request->has('name')) {
        $data['name'] = $request->name;
        $data['slug'] = Str::slug($data['name']);
    }
    if ($request->hasFile('images')) {
        $path = $request->file('images')->store('categories', 'public');
        $imagesUrl = Storage::url($path);
        \Log::info("Avatar path: " . $imagesUrl);
        dd($imagesUrl);
        $data['images'] = $imagesUrl;
    }

    // Cập nhật tài nguyên
    $resource->update($data);

    // Trả về tài nguyên đã cập nhật
    return response()->json([
        'check' => true,
        'data' => $resource,
    ], 200);
}
public function switchCategories(Request $request, $id){
    $categories = this->model::find($id);
    $categories->status = ($categories->status === 1) ? 0 : 1;
}
public function updateCate(Request $request, $id) {
    $validator = Validator::make($request->all(), [
        'name' => 'nullable|string|max:255',
        'position' => 'nullable|numeric',
        'images' => 'nullable|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
    }
    $data = [];
    $data['name'] = $request->name;
    $data['slug'] = Str::slug($data['name']);
    $data['position'] = $request->position;
    if ($request->hasFile('images')) {
        $path = $request->file('images')->store('categories', 'public');
        $imagesUrl = Storage::url($path);
        \Log::info("Avatar path: " . $imagesUrl);
        $data['images'] = $imagesUrl;
    }
    $check = $this->model::find($id)->update($data);
if ($check) {
        return response()->json(['check' => true, 'data' => $this->model::find($id)]);
}

    return response()->json(['check' => false, 'msg' => 'Cập nhật thất bại']);
    
}
    protected function validateRequest(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255|unique:categories,name',
            'position'=>'numeric',
        ];
    
        $validator = \Validator::make($request->all(), $rules);
    
        if ($validator->fails()) {
            throw new HttpResponseException(response()->json([
                'check' => false,
                'msg' => $validator->errors()->first(),
            ], 200));
        }
    
        return $validator->validated();
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category  = Categories::find($id);
        if(!$category){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã loại sản phẩm']);
        }
        Categories::where('id',$id)->delete();
        // Categories::find($id)->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
    public function api_categories(Request $request)
    {
        $categories = Categories::
        where('status', 1)->get();
        return response()->json($categories);
    }
    public function api_categories_with_products(Request $request)
{
    $categories = Categories::where('status', 1)->get();
    $categories_with_products = [];
    foreach ($categories as $category) {
        $products = Products::join('product_categories', 'products.id', '=', 'product_categories.id_product')
            ->where('product_categories.id_categories', $category->id)
            ->where('products.status', 1)
            ->select('products.*')
            ->get();
        $categories_with_products[] = [
            'category' => $category,
            'products' => $products,
        ];
    }

    // Trả về kết quả dưới dạng JSON
    return response()->json($categories_with_products);
}

    public function api_paginate_products_by_category($id, Request $request)
{
    
    $limit = $request->has('limit') ? $request->limit : 10;
    $products = Products::join('product_categories', 'products.id', '=', 'product_categories.id_product')
        ->join('gallery', 'products.id', '=', 'gallery.id_parent')
        ->where('product_categories.id_categories', $id) 
        ->where('products.status', 1) 
        ->where('gallery.status', 1) 
        ->select('products.*', 'gallery.image as image') 
        ->paginate($limit);
    if ($products->isEmpty()) {
        return response()->json(['message' => 'No products found in this category'], 404);
    }

    // Trả về kết quả danh sách sản phẩm được phân trang
    return response()->json($products);
}


}
