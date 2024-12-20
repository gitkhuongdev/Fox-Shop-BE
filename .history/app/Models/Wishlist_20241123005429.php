<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;
    protected $table = 'wishlist';
    protected $fillable = [
        'id_user',
        'create_date',
    ];
    public function items()
    {
        return $this->hasMany(WishlistItem::class, 'id_wishlist');
    }
}
