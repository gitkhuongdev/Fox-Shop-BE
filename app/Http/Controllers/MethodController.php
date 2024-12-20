<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Method;
use Illuminate\Support\Facades\Validator;

class MethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct(){
        $this->model = Method::class;
    }
    public function Index(){
        $method = Method::all();
        return Inertia::render('Methods/Index', ['payment'=>$method]);
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
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'method' => 'required|string',
        ]);
        if($validator->fails()){
            return response()->json(['check'=>false, 'msg'=>$validator->errors()->first()]);
        }
        $data = [];
        $data['method'] = $request->method;
        $this->model::create($data);
        return response()->json(['check'=>true, 'data'=>$this->model::all()]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id){
        $resulft = $this->model::find($id);
        return Inertia::render('Methods/Edit', ['payments' => $resulft]);
    }

    public function updateMethod(Request $request, $id){
        $validator = Validator::make($request->all(),[
            'method' => 'required|string',
        ]);
        if($validator->fails()){
            return response()->json(['check'=>false, 'msg'=>$validator->errors()->first()]);
        }
        $data = [];
        $data['method'] = $request->method;
        $this->model::find($id)->update($data);
        return response()->json(['check'=>true, 'data'=>$this->model::all()]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Method $method)
    {
        $method = $this->model::find($method->id);
        if(!$method){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy phương thức thanh toán']);
        }
        $method->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
}
