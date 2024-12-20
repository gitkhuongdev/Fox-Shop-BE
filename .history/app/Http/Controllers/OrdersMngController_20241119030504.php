<?php

namespace App\Http\Controllers;

use App\Models\Oders;
use Illuminate\Http\Request;

class OrdersMngController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct(Oders $model)
    {
        $this->model = Oders::class;
    }
    public function index()
    {
        $posts = Post::all();
        return Inertia::render('Order/Index' , ['posts' => $posts]);
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
    public function show(oders $oders)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(oders $oders)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, oders $oders)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(oders $oders)
    {
        //
    }
}
