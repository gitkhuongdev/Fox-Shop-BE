<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolesController extends BaseCrudController
{

    public function __construct()
    {
        $this->model = Roles::class;
    }
        /**
     * Display a listing of the resource.
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
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles= Roles::all();
        return Inertia::render('Roles/Index', ['roles'=>$roles]);
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

    /**
     * Display the specified resource.
     */
    public function show(Roles $roles)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Roles $roles)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Roles $roles,$id)
    {
        $role  = Roles::find($id);
        if(!$role){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy mã loại người dùng']);
        }
        $role->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
}
