<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;

class OrdersMngController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct(Orders $model)
    {
        $this->model = Orders::class;
    }
    public function index()
    {
        $orders = Orders::all();
        return Inertia::render('Order/Index' , ['orders' => $orders]);
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
