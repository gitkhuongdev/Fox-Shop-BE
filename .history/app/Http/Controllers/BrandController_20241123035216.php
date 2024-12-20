<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BrandController extends BaseCrudController
{
    public function __construct(){
        $this->model= Brand::class;
    }
    public function index()
    {
        $brands=Brand::all();
        return Inertia::render('Brand/Index', ['brands' => $brands]);
    }
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $data=$validated;
        $data['slug']=Str::slug($validated['name']);
        $this->model::create($data);
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $result = $this->model::find($id);
        return Inertia::render('Brand/Edit',["result"=>$result]);
    }
    public function edit(Brand $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
         $brand  = Brand::find($id);
        if(!$brand){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã thương hiệu']);
        }
        $brand->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
    public function api_brands(Request $request)
    {
        $brands=Brand::
        where('status',1)
        ->get();
        return response()->json($brands);
    }
}
