<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;
    protected $table = 'orders';

    protected $fillable = [
        'id_user',	
        'id_payment',
        'id_vouchers',
        'address',
        'status',
        'order_date',
        'order_note',
        'total_amount',
    ];
    public function orderDetails()
{
    return $this->hasMany(OrderDetail::class, 'id_order');
}

public function payment()
{
    return $this->belongsTo(Payment::class, 'id_payment');
}
}
