<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishlistItem extends Model
{
    use HasFactory;

    protected $table = 'wishlist_item';
    protected $fillable = [
        'id_product',
        'id_wishlist',
        'create_date',
    ];
    public function wishlist()
    {
        return $this->belongsTo(Wishlist::class, 'id_wishlist');
    }
    public function product()
    {
        return $this->belongsTo(Products::class, 'id_product');
    }
}
