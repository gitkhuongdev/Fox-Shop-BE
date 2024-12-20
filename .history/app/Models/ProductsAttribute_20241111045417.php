<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductsAttribute extends Model
{
    use HasFactory;
    protected $table = 'products_attribute';

    protected $fillable = [
        'product_id',  
        'attribute_id', 
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }
}
