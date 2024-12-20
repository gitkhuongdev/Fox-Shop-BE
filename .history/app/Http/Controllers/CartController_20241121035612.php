<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Products;

class CartController extends Controller
{
    protected $cart = [];
public function index()
{  

    $cart = session()->get('cart', []);
    $productIds = array_column($cart, 'product_id');
    $products = Products::whereIn('id', $productIds)->get(); 
    $cartItems = [];
    foreach ($cart as $item) {
        $product = $products->firstWhere('id', $item['product_id']);
        if ($product) {
            $cartItems[] = [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'size' => $item['size'],
                'color' => $item['color'],
                'image' => $item['image'],
                'product' => $product,
            ];
        }
    }


    return Inertia::render('Cart/Index', ['data' => $cartItems]);
}



public function store(Request $request)
{
    $validated = $request->validate([
        'productId' => 'required|integer',
        'quantity' => 'required|integer|min:1',
        'size' => 'required|string',
        'color' => 'required|string',
        'image' => 'required|string',
    ]);
    // dd($validated);
    $cart = session()->get('cart', []);
    if (isset($cart[$validated['productId']])) {
        $cart[$validated['productId']]['quantity'] += $validated['quantity'];
    } else {
        $cart[$validated['productId']] = [
            'product_id' => $validated['productId'],
            'quantity' => $validated['quantity'],
            'size' => $validated['size'],
            'color' => $validated['color'],
            'image' => $validated['image'],
        ];
        
    }
    
    session()->put('cart', $cart);
    return response()->json([
        'message' => 'Product added to cart successfully!',
        'item' => $cart[$validated['productId']]
    ]);
}


    public function update(Request $request, $id)
    {
        $quantity = $request->input('quantity');

        foreach ($this->cart as &$item) {
            if ($item['id'] == $id) {
                $item['quantity'] = $quantity;
                return response()->json(['message' => 'Quantity updated successfully!']);
            }
        }

        return response()->json(['message' => 'Product not found in cart!'], 404);
    }

  public function destroy($id)
{
    $cart = session()->get('cart', []);
    if (!isset($cart[$id])) {
        return response()->json(['message' => 'Item not found'], 404);
    }
    unset($cart[$id]);
    session()->put('cart', $cart);
    return response()->json(['message' => 'Item removed successfully'], 200);
}

}
