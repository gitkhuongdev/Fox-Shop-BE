<?php

namespace App\Http\Controllers;
use App\Models\Permissions;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends BaseCrudController
{
    public function __construct()
    {
        $this->model = Permissions::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permissions::all();
        return Inertia::render('Permissions/Index', ['permissions' => $permissions]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Permissions $Permissions)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permissions $Permissions)
    {
        //
    }

/**
     * Update the specified resource in storage.
     */
    protected function validateRequest(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
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
    public function destroy(Permissions $Permissions,$id)
    {
        $role  = Permissions::find($id);
        if(!$role){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã loại người dùng']);
        }
        $role->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
}
