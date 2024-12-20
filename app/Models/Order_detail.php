<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order_detail extends Model
{
    use HasFactory;

    protected $table = 'order_details';

    protected $fillable = [
        'id_product',
        'id_attribute',
        'id_order',
        'quantity',
        'total_money',
        'image', // Thêm image vào đây
    ];

    // Mối quan hệ với model Product
 // Mối quan hệ với Order_detail
 public function orderDetails()
 {
     return $this->hasMany(Order_detail::class, 'id_product');
 }

 // Mối quan hệ với Gallery
 public function gallery()
 {
     return $this->hasMany(Gallery::class, 'id_parent');
 }

 public function product()
{
    return $this->belongsTo(Products::class, 'id_product');
}

}
