<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductsAttribute extends Model
{
    use HasFactory;

    // Chỉ định bảng tương ứng với model này (nếu tên bảng không phải là số nhiều của tên model)
    protected $table = 'products_attribute';

    // Các trường có thể gán giá trị hàng loạt
    protected $fillable = [
        'product_id',      // ID sản phẩm
        'attribute_id',    // ID thuộc tính (màu sắc, kích thước...)       // Số lượng của thuộc tính
    ];

    // Định nghĩa các mối quan hệ nếu cần
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }
}
