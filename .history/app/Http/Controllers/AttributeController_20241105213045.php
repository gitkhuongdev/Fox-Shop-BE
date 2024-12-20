<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->model = Attribute::class;
    }
    public function index()
    {
        $attributes = Attribute::all();
        return Inertia::render('Attribute/Index', ['attributes' => $attributes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'attribute' => 'required|string|in:color,size', // Chỉ cho phép 'color' hoặc 'size'
            'value' => 'required|string',
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'check' => false,
                'msg' => $validator->errors()->first(),
            ]);
        }    
        $attribute = new Attribute();
        $attribute->name = $request->name;
        $attribute->type = $request->attribute;
        $attribute->value = $request->value;
        $attribute->save();

        return response()->json([
            'check' => true,
            'data' => $attribute, // Trả về dữ liệu thuộc tính đã thêm
            'msg' => 'Thêm thuộc tính thành công',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attribute $attribute)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attribute $attribute)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attribute $attribute)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribute $attribute)
    {
        $attribute = $this->model::find($attribute->id);
        if(!$attribute){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy bài viết']);
        }
        $attribute->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
}
