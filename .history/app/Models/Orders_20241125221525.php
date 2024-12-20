<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order_detail;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'id_user', 'id_payment', 'id_vouchers', 'address', 'status', 'order_date', 'order_note', 'total_amount',
    ];

    // Mối quan hệ với Order_details
    public function orderDetails()
    {
        return $this->hasMany(Order_detail::class, 'id_order');
    }

    // Mối quan hệ với Payment
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'id_payment');
    }

    // Xóa các order_details khi xóa đơn hàng
    protected static function booted()
    {
        static::deleting(function ($order) {
            $order->orderDetails()->delete();
        });
    }
}
