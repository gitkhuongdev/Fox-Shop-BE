<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews'; // Tên bảng

    /**
     * Các cột được phép gán giá trị hàng loạt (mass assignable).
     */
    protected $fillable = [
        'id_product',  // ID sản phẩm
        'id_user',     // ID người dùng
        'rating',      // Số sao đánh giá
        'status',      // Trạng thái (pending/approved/rejected)
        'review_date', // Ngày đánh giá
        'comment',     // Nội dung bình luận
    ];

    /**
     * Thiết lập quan hệ với bảng `products`.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product');
    }

    /**
     * Thiết lập quan hệ với bảng `users`.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
