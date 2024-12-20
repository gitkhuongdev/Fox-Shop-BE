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
    
        // Tạo đơn hàng
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
    
        // Thêm chi tiết đơn hàng
        foreach ($request->input('order_details') as $detail) {
            $product = Products::with('gallery')->find($detail['id_product']);
            $image = $product->gallery->first()?->image ?? null;
    
            Order_detail::create([
                'id_product' => $detail['id_product'],
                'id_order' => $order->id,
                'quantity' => $detail['quantity'],
                'color' => $detail['color'],
                'size' => $detail['size'],
                'total_money' => $detail['total_money'],
                'image' => $image,
            ]);
    
            // Cập nhật số lượng sản phẩm tồn kho
            if ($product) {
                $newQuantity = $product->in_stock - $detail['quantity'];
                $product->update(['in_stock' => $newQuantity]);
            }
        }
    
        if (!$userEmail) {
            return response()->json(['error' => 'User not found or email is missing'], 404);
        }
    
        // Gửi email xác nhận
        Mail::to($userEmail)->send(new OrderConfirmationMail($order));
    
        return response()->json(['message' => 'Order created successfully', 'order_id' => $order->id]);
    }
    
 
    public function getOrdersByUserId($id_user)
{
    $orders = Orders::with(['orderDetails.product', 'payment'])
                ->where('id_user', $id_user)
                ->orderBy('created_at', 'desc')
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


    public function checkPurchase($productId)
    {
        $userId = request()->get('userId'); 
    
        $order = Orders::where('id_user', $userId)
                       ->whereHas('orderDetails', function ($query) use ($productId) {
                           $query->where('id_product', $productId);
                       })
                       ->exists();
    
        return response()->json(['hasPurchased' => $order]);
    }


    public function cancelOrder(Request $request)
{
    $orderId = $request->input('order_id');
    $order = Orders::with('orderDetails')->find($orderId);

    if (!$order) {
        return response()->json(['error' => 'Order not found'], 404);
    }
    if ($order->status !== 'pending') {
        return response()->json(['error' => 'Only pending orders can be canceled'], 400);
    }
    $order->update(['status' => 'canceled']);
    foreach ($order->orderDetails as $detail) {
        $product = Products::find($detail->id_product);
        if ($product) {
            $newQuantity = $product->in_stock + $detail->quantity;
            $product->update(['in_stock' => $newQuantity]);
        }
    }

    return response()->json(['message' => 'Order canceled successfully']);
}

    
}
