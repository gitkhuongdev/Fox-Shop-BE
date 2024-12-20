<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $revenue = Orders::selectRaw('DATE(orders.created_at) as date')
        ->join('order_details', 'orders.id', '=', 'order_details.order_id')
        ->selectRaw('SUM(order_details.quantity * order_details.price) as revenue')
        ->groupByRaw('DATE(orders.created_at)')
        ->orderByRaw('DATE(orders.created_at) ASC')
        ->get();

        return Inertia::render('Dashboard/Index', ['revenue', $revenue]);
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
    public function show(string $id)
    {
        //
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
    public function destroy(string $id)
    {
        //
    }
}
