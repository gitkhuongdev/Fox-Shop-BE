<?php

namespace App\Http\Controllers;

use App\Models\Order_detail;
use App\Models\Orders;
use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $revenue = Orders::selectRaw('DATE(orders.order_date) as date')
            ->join('order_details', 'orders.id', '=', 'order_details.id_order')
            ->selectRaw('SUM(total_amount) as revenue')
            ->groupByRaw('DATE(orders.order_date)')
            ->orderByRaw('DATE(orders.order_date) ASC');

        if ($startDate && $endDate) {
            $revenue = $revenue->whereBetween('orders.order_date', [$startDate, $endDate]);
        }

        $revenue = $revenue->get();


        $products = Products::select('id', 'name')
            ->with(['gallery:id,id_parent,image'])
            ->withSum('orderDetails as total_sold', 'quantity')
            ->get();
        $bestSellers = $products->sortByDesc('total_sold')->take(10)->values()->toArray();
        ;
        // dd($bestSellers);
        return Inertia::render('Dashboard/Index', [
            'revenue' => $revenue,
            'databest' => $bestSellers
        ]);
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
