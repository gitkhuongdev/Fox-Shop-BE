<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;
    protected $table = 'products';
    protected $fillable = [
        'name',
        'slug',
        'attribute',
        'price',
        'content',
        'id_brand',
        'created_at',
        'updated_at',
    ];
    // public function categories()
    // {
    //     return $this->belongsTo(Categories::class, 'idCate');
    // }

    public function brands()
    {
        return $this->belongsTo(Brand::class, 'id_brand');
    }
      public function categories()
    {
        return $this->belongsToMany(Categories::class, 'product_categories', 'id_product', 'id_categories');
    }

    public function gallery()
    {
        return $this->hasMany(Gallery::class, 'id_parent');
    }
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
  
    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'products_attribute', 'product_id', 'attribute_id');
    }
    public function products_attribute()
    {
        return $this->belongsToMany(ProductsAttribute::class, 'id_product');
    }
    public function productCategories()
    {
        return $this->belongsToMany(ProductCategory::class);
    }
    
}
