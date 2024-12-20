<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;
    protected $table = 'product_categories';

    protected $fillable = [
        'id_product',
        'id_categories',
    ];

    public function sanpham()
    {
        return $this->belongsTo(Products::class, 'id_product');
    }

    public function category()
    {
        return $this->belongsTo(Categories::class, 'id_category');
    }   
}
