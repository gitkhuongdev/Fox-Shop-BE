<?php

namespace App\Http\Controllers;

use App\Models\Order_detail;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;


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

        if ($request->startDate && $request->endDate) {
            $revenue = $revenue->whereBetween('orders.order_date', [$request->startDate, $request->endDate]);
        }

        $revenue = $revenue->get();

        $products = Products::select('id', 'name')
            ->with(['gallery:id,id_parent,image'])
            ->withSum('orderDetails as total_sold', 'quantity')
            ->get();
        $bestSellers = $products->sortByDesc('total_sold')->take(10)->values()->toArray();

        $products = Products::select('id', 'name', 'price', 'in_stock', 'created_at')
            ->with(['gallery:id,id_parent,image'])
            ->withSum('orderDetails as total_sold', 'quantity')
            ->get();
        $bestSellers = $products->sortByDesc('total_sold')->take(10)->values()->toArray();
        $newProducts = $products->sortBy('id')->take(5)->values()->toArray();

        $reviews = Review::with([
            'product' => function ($query) {
                $query->select('id', 'name')
                    ->with(['gallery:id,id_parent,image'])
                    ->orderBy('id', 'asc')
                    ->take(5);
            }
        ])->get()->toArray();
        $orders = Orders::with([
            'orderDetails:id,id_order,id_product', // Chỉ lấy các cột cần thiết từ orderDetails
            'payment:id,method' // Chỉ lấy các cột cần thiết từ payment
        ])
            ->orderBy('id', 'desc') // Sắp xếp theo id giảm dần
            ->take(5) // Lấy 5 bản ghi
            ->get()
            ->toArray();
        return Inertia::render('Dashboard/Index', [
            'revenue' => $revenue,
            'databest' => $bestSellers,
            'reviews' => $reviews,
            'orders' => $orders,
            'products' => $newProducts,
        ]);
    }
    public function searchDate(Request $request)
    {
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $revenueNew = Orders::selectRaw('DATE(orders.order_date) as date')
            ->join('order_details', 'orders.id', '=', 'order_details.id_order')
            ->selectRaw('SUM(total_amount) as revenue')
            ->groupByRaw('DATE(orders.order_date)')
            ->whereBetween('orders.order_date', [$startDate, $endDate])
            ->orderByRaw('DATE(orders.order_date) ASC')
            ->get();
        dd($revenueNew);
        return response()->json([
            'check' => true,
            'data' => $revenueNew,
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
