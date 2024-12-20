<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $wishlist = Wishlist::firstOrCreate(
            ['id_user' => $request->input('id_user')],
            ['create_date' => now()]
        );
        $exists = WishlistItem::where('id_wishlist', $wishlist->id)
            ->where('id_product', $request->input('id_product'))
            ->exists();
    
        if ($exists) {
            return response()->json(['check' => false, 'message' => 'Sản phẩm đã có trong danh sách yêu thích.']);
        }
        $wishlistItem = WishlistItem::create([
            'id_product' => $request->input('id_product'),
            'id_wishlist' => $wishlist->id,
            'create_date' => now(),
        ]);
    
        return response()->json(['check' => true, 'wishlist_item' => $wishlistItem]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Wishlist $wishlist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wishlist $wishlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Wishlist $wishlist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wishlist $wishlist)
    {
        //
    }
    
    public function getAllListByUser (Request $request, $id){
        $wishlist = Wishlist::with(['items.product'])
        ->where('id_user', $id)
        ->first();

    if ($wishlist) {
        return response()->json([
            'status' => 'success',
            'data' => $wishlist
        ], 200);
    } else {
        return response()->json([
            'status' => 'error',
            'message' => 'Danh sách yêu thích không tồn tại'
        ], 404);
    }
    }
}
