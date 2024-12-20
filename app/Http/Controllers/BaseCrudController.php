<?php

namespace App\Http\Controllers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class BaseCrudController extends Controller
{
    protected $model;
    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $this->model::create($validated);
        $result = $this->model::all();
        return response()->json([
            'check' => true,
            'data'=>$result
        ], 201);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $resource = $this->model::findOrFail($id);
        $resource->update($validated);
        $result = $this->model::all();
        return response()->json([
           'check'=>true,
           'data'=>$result,
        ], 200);
    }

    /**
     * Validate the incoming request.
     * You can customize this in each child class by overriding it.
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
}
