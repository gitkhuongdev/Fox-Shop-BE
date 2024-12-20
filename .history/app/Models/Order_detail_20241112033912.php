<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order_detail extends Model
{
    use HasFactory;
    protected $table = 'order_details';
    protected $fillable = [
    'id_product','id_attribute','id_order','quantity','total_money',	
    ];
    public function product()
{
    return $this->belongsTo(Products::class, 'id_product');
}
}
