<?php

namespace App\Http\Controllers;

use App\Models\Order_detail;
use App\Models\Orders;
use App\Models\Products;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\OrderConfirmationMail;
use Illuminate\Support\Facades\Mail;


class OrderController extends Controller
{
    public function store(Request $request)
    {
        $userEmail = User::find($request->input('id_user'))->email;
        $order = Orders::create([
            'id_user' => $request->input('id_user'),
            'id_payment' => $request->input('id_payment'),
            'address' => $request->input('address'),
            'status' => 'pending',
            'order_date' => now(),
            'order_note' => $request->input('note'),
            'total_amount' => $request->input('total_amount'),
            'id_vouchers' => $request->input('id_voucher') > 0 ? $request->input('id_voucher') : null,
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
        if (!$userEmail) {
            return response()->json(['error' => 'User not found or email is missing'], 404);
        }
        Mail::to($userEmail)->send(new OrderConfirmationMail($order));
        return response()->json(['message' => 'Order created successfully', 'order_id' => $order->id]);
    }
    public function getOrdersByUserId($id_user)
    {
        $orders = Orders::with(['orderDetails.product', 'payment'])
                    ->where('id_user', $id_user)
                    ->get();
        return response()->json($orders);
    }
    public function getOrdersById($id)
    {
        $orders = Orders::with(['orderDetails.product', 'payment'])
                    ->where('id', $id)
                    ->get();
        return response()->json($orders);
    }
}
