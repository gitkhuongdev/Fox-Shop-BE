<?php

namespace App\Http\Controllers;

use App\Models\Order_detail;
use App\Models\Orders;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!session()->has('user_id')) {
            return redirect('/')->with('log', false);
        }else{  
            $revenue = Orders::selectRaw('DATE(orders.order_date) as date')
            ->join('order_details', 'orders.id', '=', 'order_details.id_order')
            ->selectRaw('SUM(total_amount) as revenue')
            ->groupByRaw('DATE(orders.order_date)')
            ->orderByRaw('DATE(orders.order_date) ASC')
            ->get();
            return Inertia::render('Dashboard/Index', ['revenue'=> $revenue]);
        }
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
