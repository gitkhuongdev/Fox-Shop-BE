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
        return Inertia::render('Orders/Index' , ['orders' => $orders]);
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

    // Xác thực trạng thái
    $validated = $request->validate([
        'status' => 'required|in:pending,processing,completed,cancelled',
    ]);

    // Cập nhật trạng thái và lưu vào cơ sở dữ liệu
    $order->status = $validated['status'];
    $order->save();

    return response()->json([
        'message' => 'Trạng thái đơn hàng đã được cập nhật!',
        'order' => $order
    ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(oders $oders)
    {
        //
    }
}
