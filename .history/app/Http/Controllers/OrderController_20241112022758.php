<?php

namespace App\Http\Controllers;

use App\Models\Order_detail;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = Orders::create([
            'id_user' => $request->input('id_user') ?? $id_user,
            'id_payment' => $request->input('id_payment'),
            'address' => $request->input('address'),
            'status' => 'pending',
            'order_date' => now(),
            'order_note' => $request->input('note'),
            'total_amount' => $request->input('total_amount'),
        ]);
        foreach ($request->input('order_details') as $detail) {
            Order_detail::create([
                'id_product' => $detail['id_product'],
                'id_order' => $order->id,
                'quantity' => $detail['quantity'],
                'color' => $detail['color'],
                'size' => $detail['size'],
                'total_money' => $detail['total_money'],
            ]);
            $product = Products::find($detail['id_product']);
            if ($product) {
                $newQuantity = $product->in_stock - $detail['quantity'];
                $product->update(['in_stock' => $newQuantity]);
            }
        }

        return response()->json(['message' => 'Order created successfully', 'order_id' => $order->id]);
    }
}
