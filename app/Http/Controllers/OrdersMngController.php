<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $orders = Orders::with([
            'orderDetails:id,id_order,id_product',
            'payment:id,method'
        ])->get();
        return Inertia::render('Orders/Index', ['orders' => $orders]);
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
    public function update(Request $request, $id)
    {
        $order = Orders::find($id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }
        $validated = $request->validate([
            'status' => 'required|in:Đang chờ xử lý,Đang xử lý,Đang lấy hàng,Đang giao hàng,Đã hoàn thành,Đã hủy',
        ]);
        $order->status = $validated['status'];
        $order->save();

        return response()->json(['check' => true, 'data' => $this->model::all()]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(oders $oders)
    {
        //
    }
}
